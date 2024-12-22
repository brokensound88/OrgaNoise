import React from 'react';
import { Section } from '../components/ui/Section';
import { Card } from '../components/ui/Card';

const projects = [
  {
    name: 'Aevum Ltd',
    description: 'Advanced technology development for future-ready solutions.',
    category: 'Technology',
  },
  {
    name: 'Alfred AI',
    description: 'Ethical AI platforms for responsible automation.',
    category: 'Artificial Intelligence',
  },
  {
    name: 'Shift',
    description: 'Secure blockchain payment systems for modern commerce.',
    category: 'Blockchain',
  },
  {
    name: 'Koomi Farms',
    description: 'Sustainable farming technologies for the future of agriculture.',
    category: 'Agriculture',
  },
  {
    name: 'Nido Super',
    description: 'Efficient supply chain solutions for global distribution.',
    category: 'Logistics',
  },
];

export function Projects() {
  return (
    <Section className="py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Our Projects</h1>
      <div className="grid gap-8">
        {projects.map((project) => (
          <Card key={project.name} hover>
            <div className="flex flex-col md:flex-row justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {project.name}
                </h2>
                <p className="text-gray-600 mb-4">{project.description}</p>
              </div>
              <div className="md:ml-8">
                <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {project.category}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}