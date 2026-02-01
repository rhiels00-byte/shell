import { NextRequest, NextResponse } from 'next/server';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
} from 'docx';
import { jsPDF } from 'jspdf';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { result, format, tab } = body;

    const content =
      tab === 'teacher' ? result.teacherAnalysis : result.studentAnalysis;
    const fileName =
      tab === 'teacher' ? '이리사_분석결과_선생님용' : '이리사_분석결과_학생용';

    if (format === 'word') {
      // Word 문서 생성
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              new Paragraph({
                text: fileName,
                heading: HeadingLevel.HEADING_1,
                alignment: AlignmentType.CENTER,
                spacing: { after: 400 },
              }),
              ...content.split('\n').map(
                (line: string) =>
                  new Paragraph({
                    children: [new TextRun(line)],
                    spacing: { after: 120 },
                  })
              ),
            ],
          },
        ],
      });

      const buffer = await Packer.toBuffer(doc);

      return new NextResponse(Buffer.from(buffer), {
        headers: {
          'Content-Type':
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'Content-Disposition': `attachment; filename="${encodeURIComponent(
            fileName
          )}.docx"`,
        },
      });
    } else if (format === 'pdf') {
      // PDF 생성
      const doc = new jsPDF();

      // 한글 폰트 설정이 필요하지만, 간단한 구현을 위해 기본 폰트 사용
      // 실제 프로덕션에서는 한글 폰트를 추가해야 합니다
      doc.setFontSize(16);
      doc.text(fileName, 105, 20, { align: 'center' });

      doc.setFontSize(12);
      const lines = content.split('\n');
      let yPosition = 40;

      lines.forEach((line: string) => {
        if (yPosition > 280) {
          doc.addPage();
          yPosition = 20;
        }

        // 긴 줄은 자동으로 줄바꿈
        const splitLines = doc.splitTextToSize(line || ' ', 180);
        doc.text(splitLines, 15, yPosition);
        yPosition += splitLines.length * 7;
      });

      const pdfBuffer = doc.output('arraybuffer');

      return new NextResponse(Buffer.from(pdfBuffer), {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${encodeURIComponent(
            fileName
          )}.pdf"`,
        },
      });
    }

    return NextResponse.json({ error: '지원하지 않는 형식입니다.' }, { status: 400 });
  } catch (error) {
    console.error('다운로드 오류:', error);
    const errorMessage = error instanceof Error ? error.message : '다운로드 중 오류가 발생했습니다.';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
