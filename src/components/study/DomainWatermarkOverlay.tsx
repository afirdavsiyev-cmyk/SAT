import React from 'react';
import { QuestionDomain } from '../../types/questionBank';
import { DomainCardBg } from './domain-backgrounds/index';

interface DomainWatermarkOverlayProps {
  domain: QuestionDomain | string;
}

export const DomainWatermarkOverlay: React.FC<DomainWatermarkOverlayProps> = ({ domain }) => {
  return <DomainCardBg domain={domain} />;
};

export default DomainWatermarkOverlay;
