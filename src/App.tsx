import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/common/Navbar';
import { Home } from './pages/Home';
import { Watch } from './pages/Watch';
import { Search } from './pages/Search'; // استيراد صفحة البحث
import Channel from './pages/Channel';
import Shorts from './pages/Shorts';

const queryClient = new QueryClient();

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router basename={import.meta.env.BASE_URL}>
          <div className="min-h-screen bg-white dark:bg-dark-blue text-slate-900 dark:text-slate-100">
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<Search />} />
                <Route path="/watch/:videoId" element={<Watch />} />
                <Route path="/shorts" element={<Shorts />} />
                <Route path="/channel/:channelId" element={<Channel />} />
              </Routes>
            </main>
          </div>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;