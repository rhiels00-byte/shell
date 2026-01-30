import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home';
import Tools from './pages/Tools';
import ChatHistory from './pages/ChatHistory';
import Materials from './pages/Materials';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ToolExecution from './pages/ToolExecution';
import ExpectedQuestionsGenerator from './pages/tools/ExpectedQuestionsGenerator';

function App() {
  // TODO: 실제 인증 상태 관리는 Context 또는 상태 관리 라이브러리 사용
  const isAuthenticated = true; // 임시로 true 설정

  return (
    <BrowserRouter>
      <Routes>
        {/* 인증 페이지 */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* 도구 실행 (별도 레이아웃) */}
        <Route
          path="/tool/expected-questions-generator"
          element={
            isAuthenticated ? <ExpectedQuestionsGenerator /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/tool/:toolId"
          element={
            isAuthenticated ? <ToolExecution /> : <Navigate to="/login" />
          }
        />

        {/* 메인 앱 */}
        <Route
          path="/"
          element={
            isAuthenticated ? <MainLayout /> : <Navigate to="/login" />
          }
        >
          <Route index element={<Home />} />
          <Route path="tools" element={<Tools />} />
          <Route path="chat-history" element={<ChatHistory />} />
          <Route path="materials" element={<Materials />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
