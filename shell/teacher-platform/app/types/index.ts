// 학생 정보
export interface StudentInfo {
  id: string;
  name?: string;
  number?: number;
  grade?: string;
}

// 분석 대상 모드
export type AnalysisMode = 'single' | 'multiple';

// 파일 타입
export type FileType = 'analysis' | 'reference';

// 업로드된 파일
export interface UploadedFile {
  id: string;
  file: File;
  type: FileType;
  name: string;
}

// 추출된 단위 (파일 분해 후)
export interface ExtractedUnit {
  id: string;
  fileId: string;
  fileName: string;
  pageRange?: string;
  timeRange?: string;
  rowRange?: string;
  preview: string;
  studentId?: string; // 매핑된 학생 ID (AI가 추론하거나 교사가 확인)
  confidence?: number; // AI 추론 신뢰도 (0-1)
}

// 학생 데이터셋 (분석 단위)
export interface StudentDataset {
  studentId: string;
  extractedUnits: ExtractedUnit[];
}

// 분석 결과 (학생 1명)
export interface StudentAnalysisResult {
  studentId: string;
  studentName: string;
  teacherAnalysis: string;
  studentAnalysis: string;
  recordGuide: string;
}

// 전체 분석 결과 (N명)
export interface AnalysisResults {
  results: StudentAnalysisResult[];
  timestamp: string;
}

// 폼 데이터
export interface FormData {
  mode: AnalysisMode;
  schoolLevel: 'elementary' | 'middle' | 'high';
  grade: string;
  students: StudentInfo[];
  analysisFiles: UploadedFile[];
  referenceFiles: UploadedFile[];
}

// 단계별 상태
export type WorkflowStep =
  | 'setup'           // 기본 설정
  | 'students'        // 학생 정보 입력
  | 'upload'          // 파일 업로드
  | 'mapping'         // 자료-학생 매핑 확인
  | 'reference'       // 기준 문서 선택 (선택사항)
  | 'analyze'         // 분석 생성
  | 'results';        // 결과 확인
