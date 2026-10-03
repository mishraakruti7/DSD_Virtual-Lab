import React from 'react';
import { LegalDocumentLayout } from '../components/common/LegalDocumentLayout';
import { ACCESSIBILITY_STATEMENT } from '../data/legalDocuments';

export const AccessibilityPage: React.FC = () => {
  return <LegalDocumentLayout doc={ACCESSIBILITY_STATEMENT} />;
};
