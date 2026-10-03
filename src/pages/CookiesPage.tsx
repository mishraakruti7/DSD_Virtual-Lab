import React from 'react';
import { LegalDocumentLayout } from '../components/common/LegalDocumentLayout';
import { COOKIE_POLICY } from '../data/legalDocuments';

export const CookiesPage: React.FC = () => {
  return <LegalDocumentLayout doc={COOKIE_POLICY} />;
};
