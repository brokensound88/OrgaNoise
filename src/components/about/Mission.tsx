import React from 'react';
import { Section } from '../ui/Section';
import { Card } from '../ui/Card';

export function Mission() {
  return (
    <Section className="py-16">
      <Card>
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
        <p className="text-lg text-gray-600 mb-6">
          To drive innovation, sustainability, and efficiency across industries while fostering ethical 
          and environmentally-conscious practices.
        </p>
        <div className="grid md:grid-cols-2 gap-8 mt-8">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Innovation</h3>
            <p className="text-gray-600">
              Pushing boundaries in technology and sustainable solutions to create meaningful impact.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Sustainability</h3>
            <p className="text-gray-600">
              Committed to environmental stewardship and responsible business practices.
            </p>
          </div>
        </div>
      </Card>
    </Section>
  );
}