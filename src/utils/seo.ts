import { MetaData, StructuredData } from '../types/seo';

export function generatePageMetadata(
  title: string,
  description: string,
  options: Partial<MetaData> = {}
): MetaData {
  return {
    title,
    description,
    keywords: [],
    ...options
  };
}

export function generateOrganizationSchema(): StructuredData {
  return {
    type: 'Organization',
    data: {
      name: 'OrgaNoise Ltd',
      url: 'https://organoise.com',
      logo: 'https://organoise.com/logo.png',
      description: 'Innovating for a Sustainable Tomorrow',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'London',
        addressCountry: 'UK'
      }
    }
  };
}