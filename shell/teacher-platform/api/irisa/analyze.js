import OpenAI from 'openai';
import formidable from 'formidable';

export const config = {
  api: {
    bodyParser: false,
  },
};

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
  return { usd, inputTokens, outputTokens, model };
};

const parseForm = (req) =>
  new Promise((resolve, reject) => {
    const form = formidable({ multiples: true });
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });

const toFileMeta = (files) => {
  if (!files) return [];
  const list = Array.isArray(files) ? files : [files];
  return list.map((file) => ({
    name: file.originalFilename || file.newFilename || 'unknown',
    size: file.size || 0,
    type: file.mimetype || 'application/octet-stream',
  }));
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { fields, files } = await parseForm(req);
    const payload = fields.payload ? JSON.parse(fields.payload) : {};
    const analysisFiles = toFileMeta(files.analysisFiles);
    const referenceFiles = toFileMeta(files.referenceFiles);

    if (!process.env.OPENAI_API_KEY) {
      res.json({
        teacherSummary: '교사용 Fact 분석 (mock)',
        studentSummary: '학생/학부모용 분석 (mock)',
        recordGuide: '생기부 가이드 (mock)',
        generatedAt: new Date().toISOString(),
        cost: { usd: 0, inputTokens: 0, outputTokens: 0, model: 'mock' },
      });
      return;
    }

    const client = new OpenAI();
    const model = process.env.OPENAI_MODEL || 'gpt-4.1-mini';

    const response = await client.responses.create({
      model,
      input: [
        {
          role: 'system',
          content:
            '너는 교사용 분석 결과, 학생/학부모용 분석, 생기부 가이드를 JSON으로만 반환한다.',
        },
        {
          role: 'user',
          content: JSON.stringify({ payload, analysisFiles, referenceFiles }, null, 2),
        },
      ],
    });

    const text = response.output_text || '';
    let parsed = {};
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = {};
    }

    res.json({
      teacherSummary: parsed.teacherSummary || '교사용 Fact 분석 (fallback)',
      studentSummary: parsed.studentSummary || '학생/학부모용 분석 (fallback)',
      recordGuide: parsed.recordGuide || '생기부 가이드 (fallback)',
      generatedAt: new Date().toISOString(),
      cost: estimateCost({ model, usage: response.usage }),
    });
  } catch (error) {
    res.status(500).json({
      error: 'analyze_failed',
      details: error?.message || String(error),
    });
  }
}
