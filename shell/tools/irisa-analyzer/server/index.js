import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

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

app.post(
  '/api/analyze',
  upload.fields([
    { name: 'analysisFiles', maxCount: 50 },
    { name: 'referenceFiles', maxCount: 50 },
  ]),
  (req, res) => {
    const analysisFiles = req.files?.analysisFiles ?? [];
    const referenceFiles = req.files?.referenceFiles ?? [];
    const payload = req.body?.payload ? JSON.parse(req.body.payload) : {};

    res.json({
      teacherSummary: `교사용 Fact 분석 (백엔드 목업)\n\n- 분석 대상: ${payload?.target || 'single'}\n- 학생 수: ${payload?.students?.length ?? 1}\n- 분석 파일 수: ${analysisFiles.length}\n- 기준표 파일 수: ${referenceFiles.length}`,
      studentSummary: '학생/학부모용 분석 (백엔드 목업)\n\n긍정적인 학습 태도가 관찰됩니다.',
      recordGuide: '생기부 작성 가이드 (백엔드 목업)\n\n과정 중심 학습 태도와 성장을 서술하세요.',
      generatedAt: new Date().toISOString(),
    });
  }
);

app.get('/api/download', (_req, res) => {
  const content = 'Irisa Analyzer mock download';
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Content-Disposition', 'attachment; filename="irisa-analysis.txt"');
  res.send(content);
});

app.listen(port, () => {
  console.log(`Irisa Analyzer mock API running on http://localhost:${port}`);
});
