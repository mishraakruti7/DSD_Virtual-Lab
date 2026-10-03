import React from 'react';
import { LegalDocumentLayout } from '../components/common/LegalDocumentLayout';
import { PRIVACY_POLICY } from '../data/legalDocuments';

export const PrivacyPage: React.FC = () => {
  return <LegalDocumentLayout doc={PRIVACY_POLICY} />;
};
