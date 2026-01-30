import { useState } from 'react';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import type { ClassInfo } from '../types';

const grades = [1, 2, 3, 4, 5, 6];
const classNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const subjects = [
  '국어', '영어', '수학', '사회', '과학',
  '체육', '음악', '미술', '실과', '도덕'
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState<'account' | 'classes' | 'preferences'>('account');

  // 계정 정보
  const [accountInfo, setAccountInfo] = useState({
    username: 'teacher001',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // 학급/과목 정보
  const [selectedClasses, setSelectedClasses] = useState<ClassInfo[]>([
    { grade: 2, class: 3 },
    { grade: 2, class: 5 },
  ]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(['수학', '과학']);

  // 환경 설정
  const [preferences, setPreferences] = useState({
    notifications: true,
    theme: 'light' as 'light' | 'dark',
    language: 'ko',
  });

  const toggleClass = (grade: number, classNum: number) => {
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
      setSelectedClasses([...selectedClasses, { grade, class: classNum }]);
    }
  };

  const toggleSubject = (subject: string) => {
    if (selectedSubjects.includes(subject)) {
      setSelectedSubjects(selectedSubjects.filter((s) => s !== subject));
    } else {
      setSelectedSubjects([...selectedSubjects, subject]);
    }
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Password change:', accountInfo);
    // TODO: 비밀번호 변경 로직
  };

  const handleClassUpdate = () => {
    console.log('Classes updated:', selectedClasses, selectedSubjects);
    // TODO: 학급/과목 업데이트 로직
  };

  const handlePreferencesUpdate = () => {
    console.log('Preferences updated:', preferences);
    // TODO: 환경설정 업데이트 로직
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">설정</h1>
          <p className="text-gray-600">계정 및 서비스 설정을 관리합니다</p>
        </div>

        {/* 탭 메뉴 */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('account')}
            className={`px-6 py-3 font-medium transition-colors border-b-2 ${
              activeTab === 'account'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            계정 정보
          </button>
          <button
            onClick={() => setActiveTab('classes')}
            className={`px-6 py-3 font-medium transition-colors border-b-2 ${
              activeTab === 'classes'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            학급/과목 관리
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`px-6 py-3 font-medium transition-colors border-b-2 ${
              activeTab === 'preferences'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            환경 설정
          </button>
        </div>

        {/* 계정 정보 */}
        {activeTab === 'account' && (
          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-6">계정 정보</h2>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                아이디
              </label>
              <p className="text-gray-900">{accountInfo.username}</p>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                비밀번호 변경
              </h3>

              <Input
                type="password"
                label="현재 비밀번호"
                value={accountInfo.currentPassword}
                onChange={(e) =>
                  setAccountInfo({
                    ...accountInfo,
                    currentPassword: e.target.value,
                  })
                }
              />

              <Input
                type="password"
                label="새 비밀번호"
                value={accountInfo.newPassword}
                onChange={(e) =>
                  setAccountInfo({
                    ...accountInfo,
                    newPassword: e.target.value,
                  })
                }
              />

              <Input
                type="password"
                label="새 비밀번호 확인"
                value={accountInfo.confirmPassword}
                onChange={(e) =>
                  setAccountInfo({
                    ...accountInfo,
                    confirmPassword: e.target.value,
                  })
                }
              />

              <Button type="submit">비밀번호 변경</Button>
            </form>
          </Card>
        )}

        {/* 학급/과목 관리 */}
        {activeTab === 'classes' && (
          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              학급/과목 관리
            </h2>

            <div className="space-y-6">
              {/* 담당 학급 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  담당 학급
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
              </div>

              {/* 담당 과목 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  담당 과목
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
              </div>

              <Button onClick={handleClassUpdate}>변경사항 저장</Button>
            </div>
          </Card>
        )}

        {/* 환경 설정 */}
        {activeTab === 'preferences' && (
          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-6">환경 설정</h2>

            <div className="space-y-6">
              {/* 알림 설정 */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">알림</h3>
                  <p className="text-sm text-gray-600">
                    중요한 업데이트 알림을 받습니다
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.notifications}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        notifications: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                </label>
              </div>

              {/* 테마 설정 */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">테마</h3>
                <div className="flex gap-3">
                  <button
                    onClick={() =>
                      setPreferences({ ...preferences, theme: 'light' })
                    }
                    className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                      preferences.theme === 'light'
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    ☀️ 라이트 모드
                  </button>
                  <button
                    onClick={() =>
                      setPreferences({ ...preferences, theme: 'dark' })
                    }
                    className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                      preferences.theme === 'dark'
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    🌙 다크 모드
                  </button>
                </div>
              </div>

              {/* 언어 설정 */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">언어</h3>
                <select
                  value={preferences.language}
                  onChange={(e) =>
                    setPreferences({ ...preferences, language: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 focus:outline-none"
                >
                  <option value="ko">한국어</option>
                  <option value="en">English</option>
                </select>
              </div>

              <Button onClick={handlePreferencesUpdate}>변경사항 저장</Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
