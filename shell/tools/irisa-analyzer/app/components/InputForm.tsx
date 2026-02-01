'use client';

import { useState } from 'react';
import type {
  AnalysisMode,
  StudentInfo,
  UploadedFile,
  FileType,
} from '../types';

interface InputFormProps {
  onAnalyze: (data: AnalyzeData) => Promise<void>;
  isAnalyzing: boolean;
  hasResult: boolean;
}

export interface AnalyzeData {
  mode: AnalysisMode;
  schoolLevel: 'elementary' | 'middle' | 'high';
  grade: string;
  students: StudentInfo[];
  files: UploadedFile[];
}

export default function InputForm({
  onAnalyze,
  isAnalyzing,
  hasResult,
}: InputFormProps) {
  // Step 1: 분석 대상 선택
  const [mode, setMode] = useState<AnalysisMode>('single');
  const [schoolLevel, setSchoolLevel] = useState<'elementary' | 'middle' | 'high'>('elementary');
  const [grade, setGrade] = useState('1');

  // Step 2: 학생 정보
  const [students, setStudents] = useState<StudentInfo[]>([
    { id: '1', name: '', number: 1 },
  ]);

  // Step 3: 파일 업로드
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const handleModeChange = (newMode: AnalysisMode) => {
    setMode(newMode);
    if (newMode === 'single') {
      setStudents([{ id: '1', name: '', number: 1 }]);
    } else {
      setStudents([
        { id: '1', name: '', number: 1 },
        { id: '2', name: '', number: 2 },
      ]);
    }
  };

  const addStudent = () => {
    const newId = String(students.length + 1);
    setStudents([
      ...students,
      { id: newId, name: '', number: students.length + 1 },
    ]);
  };

  const removeStudent = (id: string) => {
    if (students.length <= 1) return;
    setStudents(students.filter((s) => s.id !== id));
  };

  const updateStudent = (id: string, field: 'name' | 'number', value: string | number) => {
    setStudents(
      students.map((s) =>
        s.id === id ? { ...s, [field]: value } : s
      )
    );
  };

  const handleFileUpload = (type: FileType) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = Array.from(e.target.files || []);
    const newFiles: UploadedFile[] = uploadedFiles.map((file) => ({
      id: `${type}-${Date.now()}-${Math.random()}`,
      file,
      type,
      name: file.name,
    }));
    setFiles([...files, ...newFiles]);
  };

  const removeFile = (id: string) => {
    setFiles(files.filter((f) => f.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 검증
    if (students.length === 0) {
      alert('최소 1명의 학생 정보를 입력해주세요.');
      return;
    }

    if (files.length === 0) {
      alert('최소 1개의 파일을 업로드해주세요.');
      return;
    }

    const analysisFiles = files.filter((f) => f.type === 'analysis');
    if (analysisFiles.length === 0) {
      alert('분석용 파일을 최소 1개 업로드해주세요.');
      return;
    }

    await onAnalyze({
      mode,
      schoolLevel,
      grade,
      students,
      files,
    });
  };

  const maxGrade = schoolLevel === 'elementary' ? 6 : 3;
  const analysisFiles = files.filter((f) => f.type === 'analysis');
  const referenceFiles = files.filter((f) => f.type === 'reference');

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Step 1: 분석 대상 선택 */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
          1. 분석 대상 선택
        </h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            분석 모드
          </label>
          <div className="flex gap-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                value="single"
                checked={mode === 'single'}
                onChange={() => handleModeChange('single')}
                className="mr-2"
              />
              <span className="text-sm">학생 1명 분석</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                value="multiple"
                checked={mode === 'multiple'}
                onChange={() => handleModeChange('multiple')}
                className="mr-2"
              />
              <span className="text-sm">학생 여러 명 분석</span>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              학교급
            </label>
            <select
              value={schoolLevel}
              onChange={(e) => {
                setSchoolLevel(e.target.value as typeof schoolLevel);
                setGrade('1');
              }}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="elementary">초등학교</option>
              <option value="middle">중학교</option>
              <option value="high">고등학교</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              학년
            </label>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {Array.from({ length: maxGrade }, (_, i) => i + 1).map((g) => (
                <option key={g} value={g}>
                  {g}학년
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Step 2: 학생 정보 입력 */}
      <section className="space-y-4">
        <div className="flex justify-between items-center border-b pb-2">
          <h3 className="text-lg font-semibold text-gray-900">
            2. 학생 정보 입력
          </h3>
          {mode === 'multiple' && (
            <button
              type="button"
              onClick={addStudent}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              + 학생 추가
            </button>
          )}
        </div>

        <div className="space-y-3">
          {students.map((student) => (
            <div key={student.id} className="flex gap-3 items-center bg-gray-50 p-3 rounded-md">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="학생 이름 (선택)"
                  value={student.name || ''}
                  onChange={(e) => updateStudent(student.id, 'name', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="w-32">
                <input
                  type="number"
                  placeholder="순번"
                  min="1"
                  value={student.number || ''}
                  onChange={(e) => updateStudent(student.id, 'number', parseInt(e.target.value))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              {mode === 'multiple' && students.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeStudent(student.id)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  삭제
                </button>
              )}
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-500">
          * 교사가 입력한 정보만 사용됩니다. AI가 추론하지 않습니다.
        </p>
      </section>

      {/* Step 3: 파일 업로드 */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
          3. 자료 업로드
        </h3>

        {/* 분석용 파일 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            분석용 자료 (필수)
          </label>
          <p className="text-xs text-gray-500 mb-2">
            매쓰캔버스 풀이, SEL 검사, 기타 학습 활동 자료 등 - 형식 무관
          </p>
          <input
            type="file"
            multiple
            accept="*/*"
            onChange={handleFileUpload('analysis')}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {analysisFiles.length > 0 && (
            <div className="mt-2 space-y-1">
              {analysisFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex justify-between items-center text-sm bg-green-50 px-3 py-2 rounded"
                >
                  <span className="text-green-700">✓ {file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeFile(file.id)}
                    className="text-red-600 hover:text-red-800 text-xs"
                  >
                    삭제
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 기준 문서 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            기준 문서 (선택)
          </label>
          <p className="text-xs text-gray-500 mb-2">
            루브릭, 해석 가이드, 생기부 기재요령 등 AI가 참고할 문서
          </p>
          <input
            type="file"
            multiple
            accept="*/*"
            onChange={handleFileUpload('reference')}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
          />
          {referenceFiles.length > 0 && (
            <div className="mt-2 space-y-1">
              {referenceFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex justify-between items-center text-sm bg-purple-50 px-3 py-2 rounded"
                >
                  <span className="text-purple-700">📋 {file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeFile(file.id)}
                    className="text-red-600 hover:text-red-800 text-xs"
                  >
                    삭제
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 분석 생성 버튼 */}
      <button
        type="submit"
        disabled={isAnalyzing || analysisFiles.length === 0}
        className={`w-full py-3 px-4 rounded-md font-medium text-white ${
          isAnalyzing || analysisFiles.length === 0
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isAnalyzing ? '분석 중...' : hasResult ? '다시 분석' : '분석 생성'}
      </button>

      {isAnalyzing && (
        <div className="text-center">
          <p className="text-sm text-gray-600">
            {mode === 'single' ? '학생 1명' : `학생 ${students.length}명`}의 자료를 분석하고 있습니다...
          </p>
          <p className="text-xs text-gray-500 mt-1">
            분석의 최소 단위는 학생 1명(Student Atomic Unit)입니다
          </p>
        </div>
      )}
    </form>
  );
}
