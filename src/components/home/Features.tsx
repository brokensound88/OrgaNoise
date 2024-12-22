import React from 'react';
import { Section } from '../ui/Section';
import { Card } from '../ui/Card';

const features = [
  {
    title: 'Advanced Technology',
    description: 'Cutting-edge solutions for tomorrow\'s challenges',
    company: 'Aevum Ltd',
  },
  {
    title: 'Ethical AI',
    description: 'Responsible artificial intelligence development',
    company: 'Alfred AI',
  },
  {
    title: 'Blockchain Solutions',
    description: 'Secure and transparent payment systems',
    company: 'Shift',
  },
  {
    title: 'Sustainable Farming',
    description: 'Innovative agricultural technologies',
    company: 'Koomi Farms',
  },
  {
    title: 'Supply Chain',
    description: 'Efficient logistics and distribution',
    company: 'Nido Super',
  },
];

export function Features() {
  return (
    <Section className="py-20 bg-white">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          Our Innovative Solutions
        </h2>
        <p className="mt-4 text-xl text-gray-600">
          Discover how we're shaping the future across multiple industries
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <Card key={index} hover>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {feature.title}
            </h3>
            <p className="text-gray-600 mb-4">{feature.description}</p>
            <p className="text-sm text-blue-600 font-medium">
              {feature.company}
            </p>
          </Card>
        ))}
      </div>
    </Section>
  );
}