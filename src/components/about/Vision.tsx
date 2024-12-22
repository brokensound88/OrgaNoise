import React from 'react';
import { Section } from '../ui/Section';
import { Card } from '../ui/Card';

export function Vision() {
  return (
    <Section className="py-16 bg-gray-50">
      <Card>
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Vision</h2>
        <p className="text-lg text-gray-600 mb-6">
          To revolutionize traditional business models by integrating cutting-edge technology, 
          transparency, and sustainability, becoming a global leader in innovation.
        </p>
        <div className="grid md:grid-cols-2 gap-8 mt-8">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Future-Focused</h3>
            <p className="text-gray-600">
              Building tomorrow's solutions with today's innovation and technology.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Global Impact</h3>
            <p className="text-gray-600">
              Creating positive change through sustainable and ethical business practices.
            </p>
          </div>
        </div>
      </Card>
    </Section>
  );
}