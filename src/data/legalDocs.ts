import { LegalDocument } from '../types/content';

export const privacyPolicy: LegalDocument = {
  title: 'Privacy Policy',
  lastUpdated: '2024-03-20',
  sections: [
    {
      heading: 'Information Collection',
      content: 'We collect information that you provide directly to us, including when you create an account, make a purchase, or contact us for support.'
    },
    {
      heading: 'Use of Information',
      content: 'We use the information we collect to provide, maintain, and improve our services, to develop new ones, and to protect OrgaNoise and our users.'
    },
    {
      heading: 'Information Sharing',
      content: 'We do not share personal information with companies, organizations, or individuals outside of OrgaNoise except in specific circumstances outlined in this policy.'
    }
  ]
};

export const termsOfService: LegalDocument = {
  title: 'Terms of Service',
  lastUpdated: '2024-03-20',
  sections: [
    {
      heading: 'Acceptance of Terms',
      content: 'By accessing and using OrgaNoise\'s services, you accept and agree to be bound by these Terms of Service.'
    },
    {
      heading: 'Use License',
      content: 'Permission is granted to temporarily access and use our services for personal, non-commercial transitory viewing only.'
    },
    {
      heading: 'Disclaimer',
      content: 'The materials on OrgaNoise\'s website are provided on an \'as is\' basis. OrgaNoise makes no warranties, expressed or implied.'
    }
  ]
};