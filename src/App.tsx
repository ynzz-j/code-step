import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { AppShell } from './components/layout/AppShell';
import { WelcomePage } from './pages/WelcomePage';
import { AboutPage } from './pages/AboutPage';
import { CoursesPage } from './pages/CoursesPage';
import { LearnPage } from './pages/LearnPage';
import { CompletePage } from './pages/CompletePage';
import { UserCenterPage } from './pages/UserCenterPage';
import { initSound } from '@/utils/soundEffects';

/** 在首次用户交互时初始化音效 AudioContext */
function SoundInitializer() {
  useEffect(() => {
    const handler = () => {
      try { initSound(); } catch (_) { /* ignore */ }
      document.removeEventListener('click', handler);
      document.removeEventListener('keydown', handler);
    };
    document.addEventListener('click', handler, { once: true });
    document.addEventListener('keydown', handler, { once: true });
  }, []);
  return null;
}

function App() {
  return (
    <BrowserRouter>
      <SoundInitializer />
      <AppShell>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/learn/:courseId" element={<LearnPage />} />
          <Route path="/complete/:courseId" element={<CompletePage />} />
          <Route path="/user-center" element={<UserCenterPage />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}

export default App;
