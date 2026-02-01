import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 5174;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.post('/api/analyze', (req, res) => {
  const { input } = req.body || {};

  res.json({
    teacherSummary: `교사용 Fact 분석 (백엔드 목업)\n\n- 분석 대상: ${input?.target || 'single'}\n- 학생: ${input?.studentName || '미입력'}\n- 업로드 파일 수: ${input?.files?.length ?? 0}개`,
    studentSummary: '학생/학부모용 분석 (백엔드 목업)\n\n긍정적인 학습 태도가 관찰됩니다.',
    recordGuide: '생기부 작성 가이드 (백엔드 목업)\n\n과정 중심 학습 태도와 성장을 서술하세요.',
    generatedAt: new Date().toISOString(),
  });
});

app.get('/api/download', (_req, res) => {
  const content = 'Irisa Analyzer mock download';
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Content-Disposition', 'attachment; filename="irisa-analysis.txt"');
  res.send(content);
});

app.listen(port, () => {
  console.log(`Irisa Analyzer mock API running on http://localhost:${port}`);
});
