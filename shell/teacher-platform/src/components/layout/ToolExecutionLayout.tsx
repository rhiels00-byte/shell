import { useState } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';

interface ToolExecutionLayoutProps {
  toolId: string;
  toolName: string;
  inputComponent: ReactNode;
  outputComponent: ReactNode;
  onSave: (type: 'download' | 'copy' | 'archive') => void;
  isLoading?: boolean;
}

export default function ToolExecutionLayout({
  toolName,
  inputComponent,
  outputComponent,
  onSave,
  isLoading = false,
}: ToolExecutionLayoutProps) {
  const navigate = useNavigate();
  const [showSaveMenu, setShowSaveMenu] = useState(false);

  const handleSave = (type: 'download' | 'copy' | 'archive') => {
    onSave(type);
    setShowSaveMenu(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-[1920px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="뒤로가기"
            >
              ← 뒤로
            </button>
            <h1 className="text-2xl font-bold text-gray-900">{toolName}</h1>
          </div>

          {/* 저장 옵션 드롭다운 */}
          <div className="relative">
            <Button
              onClick={() => setShowSaveMenu(!showSaveMenu)}
              variant="primary"
              disabled={isLoading}
            >
              저장 옵션 ▼
            </Button>

            {showSaveMenu && (
              <>
                {/* 배경 클릭시 닫기 */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowSaveMenu(false)}
                />

                {/* 드롭다운 메뉴 */}
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                  <div className="py-1">
                    <button
                      onClick={() => handleSave('download')}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3"
                    >
                      <span className="text-xl">⬇️</span>
                      <div>
                        <div className="font-medium text-gray-900">다운로드</div>
                        <div className="text-xs text-gray-500">파일로 저장</div>
                      </div>
                    </button>

                    <button
                      onClick={() => handleSave('copy')}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3"
                    >
                      <span className="text-xl">📋</span>
                      <div>
                        <div className="font-medium text-gray-900">복사</div>
                        <div className="text-xs text-gray-500">
                          클립보드에 복사
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => handleSave('archive')}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3"
                    >
                      <span className="text-xl">📁</span>
                      <div>
                        <div className="font-medium text-gray-900">
                          만든 자료함에 저장
                        </div>
                        <div className="text-xs text-gray-500">
                          내부 저장소에 보관
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠: 2단 레이아웃 */}
      <div className="max-w-[1920px] mx-auto h-[calc(100vh-80px)]">
        <div className="grid grid-cols-1 lg:grid-cols-5 h-full">
          {/* 왼쪽: 입력 영역 (40%) */}
          <div className="lg:col-span-2 bg-white border-r border-gray-200 overflow-y-auto">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                정보 입력
              </h2>
              {inputComponent}
            </div>
          </div>

          {/* 오른쪽: 미리보기 영역 (60%) */}
          <div className="lg:col-span-3 bg-gray-50 overflow-y-auto">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                미리보기
              </h2>

              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">생성 중...</p>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg border border-gray-200 p-6 min-h-[400px]">
                  {outputComponent}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
