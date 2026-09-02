import React from 'react';
import { GeometryTrigBg } from './GeometryTrigBg';
import { AlgebraBg } from './AlgebraBg';
import { AdvancedMathBg } from './AdvancedMathBg';
import { ProblemSolvingBg } from './ProblemSolvingBg';
import { QuestionDomain } from '../../../types/questionBank';

export { GeometryTrigBg, AlgebraBg, AdvancedMathBg, ProblemSolvingBg };

export const DomainCardBg: React.FC<{ domain: QuestionDomain | string }> = ({ domain }) => {
  if (domain === 'Geometry & Trigonometry') {
    return <GeometryTrigBg />;
  }
  if (domain === 'Algebra') {
    return <AlgebraBg />;
  }
  if (domain === 'Advanced Math') {
    return <AdvancedMathBg />;
  }
  if (domain === 'Problem-Solving & Data Analysis' || domain === 'Problem Solving') {
    return <ProblemSolvingBg />;
  }
  return null;
};

export default DomainCardBg;
