// Auto-generated Full Practice Tests Registry
export interface FullPracticeTestItem {
  id: string;
  title: string;
  filename: string;
  fileUrl: string;
  category: 'official' | 'turbo_mock' | 'prediction' | 'diagnostic';
  badge: string;
  difficulty: 'Standard' | 'Hard' | '750+';
  durationMinutes: number;
  moduleTimeMinutes: number;
  totalQuestions: number;
  sizeMB: number;
  description: string;
}

export const FULL_PRACTICE_TESTS: FullPracticeTestItem[] = [
  {
    id: 'pt1',
    title: 'Official Practice Test 1',
    filename: 'mock_01_practice_test_1.pdf',
    fileUrl: '/questions_to_add/full_mocks/mock_01_practice_test_1.pdf',
    category: 'official',
    badge: 'College Board',
    difficulty: 'Standard',
    durationMinutes: 70,
    moduleTimeMinutes: 35,
    totalQuestions: 44,
    sizeMB: 1.2,
    description: 'Standard 2-module practice exam covering linear equations, ratios, and quadratic basics with standard 35-minute module pacing.'
  },
  {
    id: 'pt2',
    title: 'Official Practice Test 2',
    filename: 'mock_02_practice_test_2.pdf',
    fileUrl: '/questions_to_add/full_mocks/mock_02_practice_test_2.pdf',
    category: 'official',
    badge: 'Official Mock (BK-5)',
    difficulty: 'Standard',
    durationMinutes: 70,
    moduleTimeMinutes: 35,
    totalQuestions: 44,
    sizeMB: 1.4,
    description: 'Features exponential functions, geometry solids, and algebraic models.'
  },
  {
    id: 'pt3',
    title: 'Official Practice Test 3',
    filename: 'mock_03_practice_test_3.pdf',
    fileUrl: '/questions_to_add/full_mocks/mock_03_practice_test_3.pdf',
    category: 'official',
    badge: 'Official Mock (BK-6)',
    difficulty: 'Standard',
    durationMinutes: 70,
    moduleTimeMinutes: 35,
    totalQuestions: 44,
    sizeMB: 1.5,
    description: 'Focuses on similar triangles, quadratic motion models, and unit rates.'
  },
  {
    id: 'pt4',
    title: 'Official Practice Test 4',
    filename: 'mock_04_practice_test_4.pdf',
    fileUrl: '/questions_to_add/full_mocks/mock_04_practice_test_4.pdf',
    category: 'official',
    badge: 'Official Mock (BK-7)',
    difficulty: 'Standard',
    durationMinutes: 70,
    moduleTimeMinutes: 35,
    totalQuestions: 44,
    sizeMB: 1.3,
    description: 'Includes scatterplots, cubic polynomials, dot plots, and circle tangents.'
  },
  {
    id: 'pt5',
    title: 'Official Practice Test 5',
    filename: 'mock_05_practice_test_5.pdf',
    fileUrl: '/questions_to_add/full_mocks/mock_05_practice_test_5.pdf',
    category: 'official',
    badge: 'Official Mock (Test 4 Math)',
    difficulty: 'Hard',
    durationMinutes: 70,
    moduleTimeMinutes: 35,
    totalQuestions: 44,
    sizeMB: 1.6,
    description: 'Covers parabola equations, linear systems, inequality graphs, and circle geometry.'
  },
  {
    id: 'pt6',
    title: 'Official Practice Test 6',
    filename: 'mock_06_practice_test_6.pdf',
    fileUrl: '/questions_to_add/full_mocks/mock_06_practice_test_6.pdf',
    category: 'official',
    badge: 'College Board Practice Test 4',
    difficulty: 'Standard',
    durationMinutes: 70,
    moduleTimeMinutes: 35,
    totalQuestions: 44,
    sizeMB: 1.8,
    description: 'Features depreciation models, projectile motion graphs, and scatterplots.'
  },
  {
    id: 'pt7',
    title: 'Official Practice Test 7',
    filename: 'mock_08_practice_test_7.pdf',
    fileUrl: '/questions_to_add/full_mocks/mock_08_practice_test_7.pdf',
    category: 'official',
    badge: 'Official Mock (Mock 1)',
    difficulty: 'Hard',
    durationMinutes: 70,
    moduleTimeMinutes: 35,
    totalQuestions: 44,
    sizeMB: 1.4,
    description: 'Covers right triangle trigonometry, dot plots, and polynomial systems.'
  },
  {
    id: 'pt8',
    title: 'Official Practice Test 8',
    filename: 'mock_09_practice_test_8.pdf',
    fileUrl: '/questions_to_add/full_mocks/mock_09_practice_test_8.pdf',
    category: 'turbo_mock',
    badge: 'Official Mock (Turbo Test)',
    difficulty: '750+',
    durationMinutes: 70,
    moduleTimeMinutes: 35,
    totalQuestions: 44,
    sizeMB: 1.7,
    description: 'Challenging set covering orbital period models, linear systems, and geometric proofs.'
  },
  {
    id: 'pt9',
    title: 'Official Practice Test 9',
    filename: 'mock_07_BK-Practise-Test-6.pdf',
    fileUrl: '/questions_to_add/full_mocks/mock_07_BK-Practise-Test-6.pdf',
    category: 'official',
    badge: 'Official Mock (BK-6 Complete)',
    difficulty: 'Standard',
    durationMinutes: 70,
    moduleTimeMinutes: 35,
    totalQuestions: 44,
    sizeMB: 1.5,
    description: 'Includes circle equations, quadratic models, inequalities, and solid geometry.'
  },
  {
    id: 'pt10',
    title: 'Official Practice Test 10',
    filename: 'mock_13_Mock-Turbo-1.pdf',
    fileUrl: '/questions_to_add/full_mocks/mock_13_Mock-Turbo-1.pdf',
    category: 'turbo_mock',
    badge: 'Official Mock (Mock Turbo 1)',
    difficulty: '750+',
    durationMinutes: 70,
    moduleTimeMinutes: 35,
    totalQuestions: 44,
    sizeMB: 2.1,
    description: 'Covers absolute value systems, polynomial factorization, and right-triangle trigonometry.'
  },
  {
    id: 'pt11',
    title: 'Official Practice Test 11',
    filename: 'mock_56_SAT-Turbo-Prep-Test-1.pdf',
    fileUrl: '/questions_to_add/full_mocks/mock_56_SAT-Turbo-Prep-Test-1.pdf',
    category: 'turbo_mock',
    badge: 'Official Mock (SAT Turbo Prep Test 1)',
    difficulty: '750+',
    durationMinutes: 70,
    moduleTimeMinutes: 35,
    totalQuestions: 44,
    sizeMB: 2.4,
    description: 'Advanced mock covering pyramid geometry, exponential growth models, and margin of error.'
  }
];
