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
const promptFiles = [
  'P1_prompt_spec.md',
  'P2_prompt_spec.md',
  'P3_prompt_spec.md',
];

const loadPromptBundle = () => {
  return promptFiles
    .map((file) => {
      const filePath = path.join(promptRoot, file);
      if (!fs.existsSync(filePath)) return `# Missing: ${file}`;
      return fs.readFileSync(filePath, 'utf-8');
    })
    .join('\n\n');
};

const client = process.env.OPENAI_API_KEY ? new OpenAI() : null;

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
      return res.json(mockResponse({ payload, analysisFiles, referenceFiles }));
    }

    const promptBundle = loadPromptBundle();
    const summary = buildPayloadSummary({ payload, analysisFiles, referenceFiles });

    try {
      const response = await client.responses.create({
        model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
        input: [
          {
            role: 'system',
            content:
              promptBundle +
              '\n\n너는 교사용 분석 결과, 학생/학부모용 분석, 생기부 가이드를 JSON으로만 반환한다.',
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

      const text = response.output_text || '';
      const parsed = JSON.parse(text);

      return res.json({
        teacherSummary: parsed.teacherSummary ?? '',
        studentSummary: parsed.studentSummary ?? '',
        recordGuide: parsed.recordGuide ?? '',
        generatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error(error);
      return res.json(mockResponse({ payload, analysisFiles, referenceFiles }));
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
