import React from 'react';
import { StructuredData } from '../../types/seo';

interface StructuredDataScriptProps {
  data: StructuredData;
}

export function StructuredDataScript({ data }: StructuredDataScriptProps) {
  const jsonLD = {
    '@context': 'https://schema.org',
    '@type': data.type,
    ...data.data
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLD) }}
    />
  );
}