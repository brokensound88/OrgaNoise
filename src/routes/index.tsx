import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Spinner } from '../components/ui/loading/Spinner';
import * as LazyPages from '../utils/lazyRoutes';

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}

export function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<LazyPages.Home />} />
        <Route path="/about" element={<LazyPages.About />} />
        <Route path="/projects" element={<LazyPages.Projects />} />
        <Route path="/blog" element={<LazyPages.Blog />} />
        <Route path="/contact" element={<LazyPages.Contact />} />
        <Route path="*" element={<LazyPages.NotFound />} />
      </Routes>
    </Suspense>
  );
}