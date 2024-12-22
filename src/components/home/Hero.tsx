import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';

export function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
          Innovating for a
          <span className="text-blue-400"> Sustainable Tomorrow</span>
        </h1>
        <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
          Leading the way in advanced technology, ethical AI, blockchain solutions,
          and sustainable farming.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button to="/about" variant="primary" icon={ArrowRight}>
            Learn More
          </Button>
          <Button to="/contact" variant="outline">
            Contact Us
          </Button>
        </div>
      </div>
    </section>
  );
}