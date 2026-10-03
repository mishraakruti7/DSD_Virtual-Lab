import React from 'react';
import { LegalDocumentLayout } from '../components/common/LegalDocumentLayout';
import { TERMS_OF_SERVICE } from '../data/legalDocuments';

export const TermsPage: React.FC = () => {
  return <LegalDocumentLayout doc={TERMS_OF_SERVICE} />;
};
