import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import type { ClassInfo } from '../types';

const grades = [1, 2, 3, 4, 5, 6]; // 초등학교 기준
const classNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const subjects = [
  '국어', '영어', '수학', '사회', '과학',
  '체육', '음악', '미술', '실과', '도덕'
];

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [selectedClasses, setSelectedClasses] = useState<ClassInfo[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 유효성 검사
    const newErrors: { [key: string]: string } = {};

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다';
    }

    if (selectedClasses.length === 0) {
      newErrors.classes = '최소 1개의 학급을 선택해주세요';
    }

    if (selectedSubjects.length === 0) {
      newErrors.subjects = '최소 1개의 과목을 선택해주세요';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    console.log('Signup data:', {
      username: formData.username,
      classes: selectedClasses,
      subjects: selectedSubjects,
    });
    // TODO: 실제 회원가입 로직
    navigate('/login');
  };

  const toggleClass = (grade: number, classNum: number) => {
    const classInfo = { grade, class: classNum };
    const exists = selectedClasses.some(
      (c) => c.grade === grade && c.class === classNum
    );

    if (exists) {
      setSelectedClasses(
        selectedClasses.filter(
          (c) => !(c.grade === grade && c.class === classNum)
        )
      );
    } else {
      setSelectedClasses([...selectedClasses, classInfo]);
    }
    setErrors({ ...errors, classes: '' });
  };

  const toggleSubject = (subject: string) => {
    if (selectedSubjects.includes(subject)) {
      setSelectedSubjects(selectedSubjects.filter((s) => s !== subject));
    } else {
      setSelectedSubjects([...selectedSubjects, subject]);
    }
    setErrors({ ...errors, subjects: '' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-blue-50 p-4">
      <Card className="w-full max-w-2xl my-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">회원가입</h1>
          <p className="text-gray-600">교사 지원 플랫폼에 오신 것을 환영합니다</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 기본 정보 */}
          <div className="space-y-4">
            <Input
              type="text"
              label="아이디"
              placeholder="아이디를 입력하세요"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              required
            />

            <Input
              type="password"
              label="비밀번호"
              placeholder="비밀번호를 입력하세요"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />

            <Input
              type="password"
              label="비밀번호 확인"
              placeholder="비밀번호를 다시 입력하세요"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              error={errors.confirmPassword}
              required
            />
          </div>

          {/* 담당 학급 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              담당 학급 (복수 선택 가능)
            </label>
            <div className="grid grid-cols-6 gap-2">
              {grades.map((grade) =>
                classNumbers.map((classNum) => {
                  const isSelected = selectedClasses.some(
                    (c) => c.grade === grade && c.class === classNum
                  );
                  return (
                    <button
                      key={`${grade}-${classNum}`}
                      type="button"
                      onClick={() => toggleClass(grade, classNum)}
                      className={`
                        px-3 py-2 rounded-lg text-sm font-medium transition-all
                        ${
                          isSelected
                            ? 'bg-primary-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }
                      `}
                    >
                      {grade}-{classNum}
                    </button>
                  );
                })
              )}
            </div>
            {errors.classes && (
              <p className="mt-2 text-sm text-red-500">{errors.classes}</p>
            )}
          </div>

          {/* 담당 과목 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              담당 과목 (복수 선택 가능)
            </label>
            <div className="grid grid-cols-5 gap-2">
              {subjects.map((subject) => {
                const isSelected = selectedSubjects.includes(subject);
                return (
                  <button
                    key={subject}
                    type="button"
                    onClick={() => toggleSubject(subject)}
                    className={`
                      px-4 py-2 rounded-lg text-sm font-medium transition-all
                      ${
                        isSelected
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }
                    `}
                  >
                    {subject}
                  </button>
                );
              })}
            </div>
            {errors.subjects && (
              <p className="mt-2 text-sm text-red-500">{errors.subjects}</p>
            )}
          </div>

          <Button type="submit" className="w-full">
            회원가입
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            이미 계정이 있으신가요?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-primary-500 hover:text-primary-600 font-medium"
            >
              로그인
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
}
