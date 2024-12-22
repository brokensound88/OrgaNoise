import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeProvider';
import { LoadingProvider } from './components/ui/loading/LoadingProvider';
import { LoadingOverlay } from './components/ui/loading/LoadingOverlay';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AppRoutes } from './routes';

export default function App() {
  return (
    <ThemeProvider>
      <LoadingProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors">
            <Navbar />
            <LoadingOverlay>
              <main className="flex-grow">
                <AppRoutes />
              </main>
            </LoadingOverlay>
            <Footer />
          </div>
        </Router>
      </LoadingProvider>
    </ThemeProvider>
  );
}