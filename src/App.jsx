import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import { MainPage } from './pages/MainPage/MainPage';
import { NotFoundPage } from './pages/NotFoundPage/NotFoundPage';
import { Suspense } from 'react';
import { LogInPage } from './pages/LogInPage/LogInPage';
import { SignUpPage } from './pages/SingUpPage/SingUpPage';
import { ChatPage } from './pages/ChatPage/ChatPage';
import { Verify2FAPage } from './components/Verify2FAPage/Verify2FAPage';

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/mainPage" element={<MainPage />}></Route>
        <Route path="/login" element={<LogInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/verify-2fa" element={<Verify2FAPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;
