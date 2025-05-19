import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import { MainPage } from './pages/MainPage/MainPage';
import { NotFoundPage } from './pages/NotFoundPage/NotFoundPage';
import { Suspense } from 'react';
import { LogInPage } from './pages/LogInPage/LogInPage';
import { SignUpPage } from './pages/SingUpPage/SingUpPage';

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/mainPage" element={<MainPage />}></Route>
        <Route path="/login" element={<LogInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        {/* <Route path="/main/:userId" element={<ChatPage />} /> */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;
