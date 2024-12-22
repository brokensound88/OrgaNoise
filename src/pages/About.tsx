import React from 'react';
import { Mission } from '../components/about/Mission';
import { Vision } from '../components/about/Vision';

export function About() {
  return (
    <div className="flex flex-col">
      <Mission />
      <Vision />
    </div>
  );
}