import React from 'react';
import { Container } from './Container';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
}

export function Section({
  children,
  className = '',
  containerClassName = '',
}: SectionProps) {
  return (
    <section className={className}>
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}