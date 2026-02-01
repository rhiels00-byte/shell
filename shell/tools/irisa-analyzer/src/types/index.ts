export type AnalysisTarget = 'single' | 'multiple';
export type SchoolLevel = 'elementary' | 'middle' | 'high';

export interface InputData {
  target: AnalysisTarget;
  studentName: string;
  studentNumber: string;
  grade: string;
  level: SchoolLevel;
  referenceText: string;
  notes: string;
  files: File[];
}

export interface AnalysisResult {
  teacherSummary: string;
  studentSummary: string;
  recordGuide: string;
  generatedAt: string;
}
