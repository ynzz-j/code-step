import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { WelcomePage } from './pages/WelcomePage';
import { AboutPage } from './pages/AboutPage';
import { CoursesPage } from './pages/CoursesPage';
import { LearnPage } from './pages/LearnPage';
import { CompletePage } from './pages/CompletePage';
import { UserCenterPage } from './pages/UserCenterPage';

function App() {
  return (
    <BrowserRouter>
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
