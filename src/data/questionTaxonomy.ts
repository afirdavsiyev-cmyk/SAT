/**
 * Canonical Digital SAT Math Domain & Topic Curriculum Taxonomy
 * Matches MathBook 2.0 structure excluding formula / cheat-sheet sections
 */

export const SAT_DOMAINS = [
  {
    id: 'algebra',
    title: 'Algebra',
    topics: [
      'Expressions',
      'Linear Equations',
      'Linear System of Equations',
      'Linear Functions',
      'Linear Inequalities'
    ]
  },
  {
    id: 'advanced_math',
    title: 'Advanced math',
    topics: [
      'Polynomials',
      'Exponents&Radicals',
      'Functions&Function Notation',
      'Exponential Functions',
      'Quadratics'
    ]
  },
  {
    id: 'problem_solving',
    title: 'Problem solving',
    topics: [
      'Percent; Ratio&Proportion',
      'Unit Conversion',
      'Probability',
      'Mean, Median, Mode, Range',
      'Scatterplots',
      'Research organizing(Margin of Error; Outliers)'
    ]
  },
  {
    id: 'geometry_trig',
    title: 'Geometry and Trigonometry',
    topics: [
      'Lines&Angles',
      'Triangles',
      'Trigonometry',
      'Circles',
      'Areas&Volumes'
    ]
  }
] as const;

export type SATDomainId = typeof SAT_DOMAINS[number]['id'];
export type SATTopic = typeof SAT_DOMAINS[number]['topics'][number];

/**
 * Convenience list of all distinct topics across all domains
 */
export const ALL_SAT_TOPICS: readonly SATTopic[] = SAT_DOMAINS.flatMap((d) => d.topics);

/**
 * Domain Title Lookup
 */
export const SAT_DOMAIN_TITLES: Record<SATDomainId, string> = {
  algebra: 'Algebra',
  advanced_math: 'Advanced math',
  problem_solving: 'Problem solving',
  geometry_trig: 'Geometry and Trigonometry'
};

/**
 * Helper to retrieve topics for a specific domain ID
 */
export function getTopicsByDomain(domainId: SATDomainId): readonly string[] {
  const domain = SAT_DOMAINS.find((d) => d.id === domainId);
  return domain ? domain.topics : [];
}

/**
 * Helper to find the parent domain ID for a given topic
 */
export function getDomainByTopic(topic: string): SATDomainId | undefined {
  const found = SAT_DOMAINS.find((d) =>
    (d.topics as readonly string[]).includes(topic)
  );
  return found?.id;
}
