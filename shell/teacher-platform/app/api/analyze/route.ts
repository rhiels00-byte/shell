import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import type { ChatCompletionContentPart } from 'openai/resources/chat/completions';
import { getTeacherAnalysisPrompt } from '@/lib/prompts/teacherAnalysis';
import { getStudentAnalysisPrompt } from '@/lib/prompts/studentAnalysis';
import { getRecordGuidePrompt } from '@/lib/prompts/recordGuide';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy-key-for-build',
});

interface StudentInfo {
  id: string;
  name?: string;
  number?: number;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const schoolLevel = formData.get('schoolLevel') as string;
    const grade = formData.get('grade') as string;
    const studentsJson = formData.get('students') as string;

    const students: StudentInfo[] = JSON.parse(studentsJson);

    // 파일 추출
    const analysisFiles: File[] = [];
    const referenceFiles: File[] = [];

    for (const [key, value] of formData.entries()) {
      if (key.startsWith('file_analysis') && value instanceof File) {
        analysisFiles.push(value);
      } else if (key.startsWith('file_reference') && value instanceof File) {
        referenceFiles.push(value);
      }
    }

    if (analysisFiles.length === 0) {
      return NextResponse.json(
        { error: '최소 하나의 분석용 파일을 업로드해주세요.' },
        { status: 400 }
      );
    }

    // 학생별 분석 수행
    const results = await Promise.all(
      students.map(async (student) => {
        return await analyzeStudent(
          student,
          schoolLevel,
          grade,
          analysisFiles,
          referenceFiles
        );
      })
    );

    return NextResponse.json({
      results,
    });
  } catch (error) {
    console.error('분석 오류:', error);
    const errorMessage =
      error instanceof Error ? error.message : '분석 중 오류가 발생했습니다.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

async function analyzeStudent(
  student: StudentInfo,
  schoolLevel: string,
  grade: string,
  analysisFiles: File[],
  _referenceFiles: File[]
) {
  const studentName = student.name || `학생 ${student.number}`;

  let teacherAnalysis = '';
  let studentAnalysis = '';

  // 분석용 파일 처리
  if (analysisFiles.length > 0) {
    // 이미지/PDF 파일을 Vision API로 분석
    const imageFiles = analysisFiles.filter(
      (f) => f.type.startsWith('image/') || f.type === 'application/pdf'
    );

    if (imageFiles.length > 0) {
      // 교사용 분석
      teacherAnalysis = await analyzeWithVision(
        imageFiles,
        getTeacherAnalysisPrompt(schoolLevel, grade),
        studentName
      );

      // 학생용 분석
      studentAnalysis = await analyzeWithVision(
        imageFiles,
        getStudentAnalysisPrompt(schoolLevel, grade),
        studentName
      );
    } else {
      // 비디오나 기타 파일의 경우 데모 텍스트
      teacherAnalysis = generateDemoTeacherAnalysis(studentName);
      studentAnalysis = generateDemoStudentAnalysis(studentName);
    }
  }

  // 생기부 가이드 생성 (둘 다 있을 때만)
  let recordGuide = '';
  if (teacherAnalysis && studentAnalysis) {
    const recordPrompt = getRecordGuidePrompt(
      schoolLevel,
      grade,
      teacherAnalysis,
      studentAnalysis
    );

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: recordPrompt,
        },
      ],
      max_tokens: 1500,
    });

    recordGuide = response.choices[0].message.content || '';
  }

  // 학생용 분석에 생기부 가이드 추가
  const finalStudentAnalysis = recordGuide
    ? `${studentAnalysis}\n\n---\n\n## 생기부 작성 가이드\n\n${recordGuide}`
    : studentAnalysis;

  return {
    studentId: student.id,
    studentName,
    teacherAnalysis,
    studentAnalysis: finalStudentAnalysis,
    recordGuide,
  };
}

async function analyzeWithVision(
  files: File[],
  prompt: string,
  studentName: string
): Promise<string> {
  try {
    const content: ChatCompletionContentPart[] = [
      { type: 'text', text: `${prompt}\n\n학생 이름: ${studentName}` },
    ];

    // 파일들을 base64로 변환하여 추가
    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = buffer.toString('base64');
      const mimeType = file.type;

      content.push({
        type: 'image_url',
        image_url: {
          url: `data:${mimeType};base64,${base64}`,
        },
      });
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content,
        },
      ],
      max_tokens: 2000,
    });

    return response.choices[0].message.content || '';
  } catch (error) {
    console.error('Vision API 오류:', error);
    return `[분석 오류] ${studentName}의 자료를 분석하는 중 오류가 발생했습니다.`;
  }
}

function generateDemoTeacherAnalysis(studentName: string): string {
  return `[${studentName} - 교사용 Fact 분석]

### 1. 문제 이해도 분석
- 학생이 문제를 차근차근 읽고 핵심 정보를 파악하려 노력한 것으로 보입니다.
- 주요 개념: 덧셈과 뺄셈의 관계 이해

### 2. 풀이 과정 분석
- 사용한 전략: 그림을 그려서 시각화
- 과정에서의 강점: 단계별로 정리하며 풀이
- 개선 필요: 계산 과정에서 실수 확인 필요

### 3. 결과 평가
**[정답인 경우]**
- 칭찬 포인트: 문제 해결 과정을 논리적으로 전개했습니다.
- 우수한 점: Think Aloud 과정에서 자신의 사고를 명확히 표현했습니다.

### 4. Next Step

**[심화 학습용 유사 문항 3개]**

1. 35 + 48 = ?
   ① 73  ② 83  ③ 93  ④ 63
   답: ②

2. 56 - 29 = ?
   ① 27  ② 37  ③ 17  ④ 47
   답: ①

3. 42 + 35 - 18 = ?
   ① 59  ② 69  ③ 49  ④ 79
   답: ①`;
}

function generateDemoStudentAnalysis(studentName: string): string {
  return `[${studentName} - 학생/학부모용 분석]

## 강점 분석

${studentName} 학생은 문제 해결 과정에서 다음과 같은 강점을 보였습니다:

1. **논리적 사고력**: 단계별로 차근차근 문제를 풀어나갑니다.
2. **시각화 능력**: 그림이나 도표를 활용하여 문제를 이해합니다.
3. **끈기**: 어려운 문제도 포기하지 않고 끝까지 도전합니다.

## 성장 영역

더욱 발전하기 위해 다음 영역에 집중할 수 있습니다:

1. **정확성**: 계산 과정에서 실수를 줄이기 위한 검산 습관
2. **속도**: 익숙한 문제는 빠르게 해결하는 연습

## 학부모 가이드

가정에서 이렇게 도와주세요:

- 학생이 문제를 풀 때 과정을 말로 설명하도록 격려해주세요
- 답이 틀려도 과정을 칭찬해주세요
- 하루 10분 계산 연습으로 정확성을 높여주세요`;
}
