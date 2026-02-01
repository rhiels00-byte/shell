import OpenAI from 'openai';

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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { students, files } = req.body || {};

  if (!process.env.OPENAI_API_KEY) {
    res.json({ mappings: heuristicMappings({ students, files }), cost: { usd: 0, inputTokens: 0, outputTokens: 0, model: 'mock' } });
    return;
  }

  try {
    const client = new OpenAI();
    const model = process.env.OPENAI_MODEL || 'gpt-4.1-mini';

    const response = await client.responses.create({
      model,
      input: [
        {
          role: 'system',
          content:
            '너는 업로드된 파일과 학생 정보를 보고 자동 매핑을 생성한다. 반드시 JSON 배열만 출력한다. 각 항목 형식: {"fileId": string, "fileName": string, "studentIndex": number|null, "unit": "전체"|"페이지"|"구간"|"행/표", "range": string}',
        },
        {
          role: 'user',
          content: JSON.stringify({ students, files }, null, 2),
        },
      ],
    });

    const text = response.output_text || '';
    let parsed = [];
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = [];
    }

    if (!Array.isArray(parsed)) {
      res.json({ mappings: heuristicMappings({ students, files }), cost: estimateCost({ model, usage: response.usage }) });
      return;
    }

    res.json({ mappings: parsed, cost: estimateCost({ model, usage: response.usage }) });
  } catch (error) {
    res.json({ mappings: heuristicMappings({ students, files }), cost: { usd: 0, inputTokens: 0, outputTokens: 0, model: 'fallback' } });
  }
}
