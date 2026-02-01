import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import OpenAI from 'openai';

const app = express();
const port = process.env.PORT || 5174;

const storageRoot = path.resolve(process.cwd(), 'server', 'storage');
const uploadDir = path.join(storageRoot, 'uploads');
const extractedDir = path.join(storageRoot, 'extracted');
const datasetDir = path.join(storageRoot, 'datasets');

[storageRoot, uploadDir, extractedDir, datasetDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const timestamp = Date.now();
    const safeName = file.originalname.replace(/\s+/g, '_');
    cb(null, `${timestamp}_${safeName}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
});

app.use(cors());
app.use(express.json({ limit: '10mb' }));

const promptRoot = path.resolve(process.cwd(), 'prompts');
const promptMap = {
  p1: 'P1_prompt_spec.md',
  p2: 'P2_prompt_spec.md',
  p3: 'P3_prompt_spec.md',
};

const getPrompt = (type) => {
  const fileName = promptMap[type];
  if (!fileName) return '';
  const filePath = path.join(promptRoot, fileName);
  if (!fs.existsSync(filePath)) return '';
  return fs.readFileSync(filePath, 'utf-8');
};

const client = process.env.OPENAI_API_KEY ? new OpenAI() : null;

const MODEL_PRICING = {
  'gpt-4.1-mini': { input: 0.4, output: 1.6 },
  'gpt-4.1': { input: 2.0, output: 8.0 },
  'gpt-4.1-nano': { input: 0.1, output: 0.4 },
};

const estimateCost = ({ model, usage }) => {
  if (!usage) return { usd: 0, inputTokens: 0, outputTokens: 0, model };
  const pricing = MODEL_PRICING[model] || MODEL_PRICING['gpt-4.1-mini'];
  const inputTokens = usage.input_tokens || usage.input_tokens_total || 0;
  const outputTokens = usage.output_tokens || usage.output_tokens_total || 0;
  const usd =
    (inputTokens / 1_000_000) * pricing.input +
    (outputTokens / 1_000_000) * pricing.output;
  return { usd, inputTokens, outputTokens, model: model || 'gpt-4.1-mini' };
};

const buildPayloadSummary = ({ payload, analysisFiles, referenceFiles }) => {
  const fileMeta = (files) =>
    files.map((file) => ({
      originalName: file.originalname,
      storedName: file.filename,
      size: file.size,
      type: file.mimetype,
    }));

  return {
    input: payload,
    analysisFiles: fileMeta(analysisFiles),
    referenceFiles: fileMeta(referenceFiles),
  };
};

const mockResponse = ({ payload, analysisFiles, referenceFiles }) => ({
  teacherSummary: `교사용 Fact 분석 (백엔드 목업)\n\n- 분석 대상: ${payload?.target || 'single'}\n- 학생 수: ${payload?.students?.length ?? 1}\n- 분석 파일 수: ${analysisFiles.length}\n- 기준표 파일 수: ${referenceFiles.length}`,
  studentSummary: '학생/학부모용 분석 (백엔드 목업)\n\n긍정적인 학습 태도가 관찰됩니다.',
  recordGuide: '생기부 작성 가이드 (백엔드 목업)\n\n과정 중심 학습 태도와 성장을 서술하세요.',
  generatedAt: new Date().toISOString(),
});

const safeJsonParse = (text) => {
  if (!text) return null;
  const trimmed = text.trim();
  const fenced =
    trimmed.match(/```json([\s\S]*?)```/i) || trimmed.match(/```([\s\S]*?)```/);
  const candidate = fenced ? fenced[1].trim() : trimmed;
  try {
    return JSON.parse(candidate);
  } catch {
    const start = candidate.indexOf('{');
    const end = candidate.lastIndexOf('}');
    if (start >= 0 && end > start) {
      const sliced = candidate.slice(start, end + 1);
      try {
        return JSON.parse(sliced);
      } catch {
        return null;
      }
    }
    return null;
  }
};

const getResponseText = (response) => {
  if (!response) return '';
  if (response.output_text) return response.output_text;
  if (Array.isArray(response.output)) {
    const parts = [];
    for (const item of response.output) {
      const content = item?.content || [];
      for (const node of content) {
        if (node?.type === 'output_text' || node?.type === 'text') {
          parts.push(node?.text || '');
        }
      }
    }
    return parts.join('\n').trim();
  }
  return '';
};

const normalizeAnalysis = (parsed, fallback) => {
  if (!parsed || typeof parsed !== 'object') return fallback;
  const teacherSummary = parsed.teacherSummary || fallback.teacherSummary;
  const studentSummary = parsed.studentSummary || fallback.studentSummary;
  const recordGuide = parsed.recordGuide || fallback.recordGuide;
  return { ...fallback, teacherSummary, studentSummary, recordGuide };
};

const heuristicMappings = ({ students, files }) => {
  if (!files || files.length === 0) return [];
  const studentNames = (students || []).map((s) => s.name).filter(Boolean);

  return files.map((file, idx) => {
    let studentIndex = null;
    if (studentNames.length === 1) {
      studentIndex = 0;
    } else if (studentNames.length > 1) {
      const nameMatchIndex = studentNames.findIndex((name) =>
        file.name.includes(name)
      );
      studentIndex = nameMatchIndex >= 0 ? nameMatchIndex : idx % studentNames.length;
    }

    const fileId = `${file.name}-${file.size || 0}-${file.lastModified || 0}`;
    return {
      fileId,
      fileName: file.name,
      studentIndex,
      unit: '전체',
      range: '전체',
    };
  });
};

app.post('/api/mappings', async (req, res) => {
  const { students, files } = req.body || {};

  if (!client) {
    return res.json({ mappings: heuristicMappings({ students, files }), cost: { usd: 0, inputTokens: 0, outputTokens: 0, model: 'mock' } });
  }

  const promptBundle = getPrompt('p2') || getPrompt('p1');
  const mappingPrompt = `너는 업로드된 파일과 학생 정보를 보고 자동 매핑을 생성한다.\n반드시 JSON 배열만 출력한다.\n각 항목 형식: {"fileId": string, "fileName": string, "studentIndex": number|null, "unit": "전체"|"페이지"|"구간"|"행/표", "range": string}`;

  try {
    const model = process.env.OPENAI_MODEL || 'gpt-4.1-mini';
    const response = await client.responses.create({
      model,
      text: { format: { type: 'json_object' } },
      input: [
        { role: 'system', content: promptBundle + '\n\n' + mappingPrompt },
        {
          role: 'user',
          content: JSON.stringify({ students, files }, null, 2),
        },
      ],
    });

    const text = getResponseText(response);
    const parsed = safeJsonParse(text);
    const cost = estimateCost({ model, usage: response.usage });

    if (!Array.isArray(parsed)) {
      return res.json({ mappings: heuristicMappings({ students, files }), cost });
    }

    return res.json({ mappings: parsed, cost });
  } catch (error) {
    console.error(error);
    return res.json({ mappings: heuristicMappings({ students, files }), cost: { usd: 0, inputTokens: 0, outputTokens: 0, model: 'fallback' } });
  }
});

app.post(
  '/api/analyze',
  upload.fields([
    { name: 'analysisFiles', maxCount: 50 },
    { name: 'referenceFiles', maxCount: 50 },
  ]),
  async (req, res) => {
    const analysisFiles = req.files?.analysisFiles ?? [];
    const referenceFiles = req.files?.referenceFiles ?? [];
    const payload = req.body?.payload ? JSON.parse(req.body.payload) : {};

    if (!client) {
      return res.json({ ...mockResponse({ payload, analysisFiles, referenceFiles }), cost: { usd: 0, inputTokens: 0, outputTokens: 0, model: 'mock' } });
    }

    const promptBundle = loadPromptBundle();
    const summary = buildPayloadSummary({ payload, analysisFiles, referenceFiles });

    try {
      const model = process.env.OPENAI_MODEL || 'gpt-4.1-mini';
      const response = await client.responses.create({
        model,
        text: { format: { type: 'json_object' } },
        input: [
          {
            role: 'system',
            content:
              getPrompt('p1') +
              '\n\n반드시 JSON 객체만 반환한다. 키는 teacherSummary, studentSummary, recordGuide이다.',
          },
          {
            role: 'user',
            content: `다음 입력을 기반으로 분석 결과를 생성해줘.\n\n입력 데이터(JSON):\n${JSON.stringify(
              summary,
              null,
              2
            )}`,
          },
        ],
      });

      const text = getResponseText(response);
      const parsed = safeJsonParse(text);

      const cost = estimateCost({ model, usage: response.usage });
      const normalized = normalizeAnalysis(
        parsed,
        mockResponse({ payload, analysisFiles, referenceFiles })
      );
      return res.json({
        ...normalized,
        generatedAt: new Date().toISOString(),
        cost,
      });
    } catch (error) {
      console.error(error);
      return res.json({ ...mockResponse({ payload, analysisFiles, referenceFiles }), cost: { usd: 0, inputTokens: 0, outputTokens: 0, model: 'fallback' } });
    }
  }
);

app.get('/api/download', (_req, res) => {
  const content = 'Irisa Analyzer mock download';
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Content-Disposition', 'attachment; filename="irisa-analysis.txt"');
  res.send(content);
});

app.listen(port, () => {
  console.log(`Irisa Analyzer API running on http://localhost:${port}`);
});
