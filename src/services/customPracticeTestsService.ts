import { Question } from '../types';
import { CustomPracticeTest } from '../types/admin';
import { DB_NAME, DB_VERSION } from './disputeService';

export const CUSTOM_TESTS_STORE = 'custom_practice_tests';
export const CUSTOM_TESTS_FALLBACK_KEY = 'scoreup_custom_practice_tests';

/**
 * Sorts questions by difficulty: Easy -> Medium -> Hard.
 * Re-indexes the question `number` field sequentially (1, 2, 3...)
 * while preserving the relative order of questions having the same difficulty.
 */
export function sortQuestionsByDifficulty(questions: Question[]): Question[] {
  if (!questions || !Array.isArray(questions)) return [];

  const difficultyRank: Record<string, number> = {
    Easy: 1,
    Medium: 2,
    Hard: 3,
  };

  return [...questions]
    .sort((a, b) => {
      const rankA = difficultyRank[a.difficulty] ?? 2;
      const rankB = difficultyRank[b.difficulty] ?? 2;
      return rankA - rankB;
    })
    .map((q, idx) => ({
      ...q,
      number: idx + 1,
    }));
}

/**
 * Checks if IndexedDB is available in the current environment.
 */
function isIndexedDBSupported(): boolean {
  return typeof window !== 'undefined' && 'indexedDB' in window && !!window.indexedDB;
}

/**
 * Open or initialize the datastore for custom practice tests.
 */
function openDatastore(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!isIndexedDBSupported()) {
      return reject(new Error('IndexedDB is not supported'));
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('dispute_reports')) {
        db.createObjectStore('dispute_reports', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(CUSTOM_TESTS_STORE)) {
        const testStore = db.createObjectStore(CUSTOM_TESTS_STORE, { keyPath: 'id' });
        testStore.createIndex('createdAt', 'createdAt', { unique: false });
        testStore.createIndex('updatedAt', 'updatedAt', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Failed to open datastore.'));
  });
}

function getFallbackTests(): CustomPracticeTest[] {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return [];
    const raw = window.localStorage.getItem(CUSTOM_TESTS_FALLBACK_KEY);
    return raw ? (JSON.parse(raw) as CustomPracticeTest[]) : [];
  } catch (err) {
    console.warn('Failed to read custom tests from fallback localStorage:', err);
    return [];
  }
}

function saveFallbackTests(tests: CustomPracticeTest[]): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(CUSTOM_TESTS_FALLBACK_KEY, JSON.stringify(tests));
    }
  } catch (err) {
    console.warn('Failed to save custom tests to fallback localStorage:', err);
  }
}

function notifyCustomTestsUpdated(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('scoreup_custom_tests_updated'));
  }
}

/**
 * Saves or updates a custom practice test in IndexedDB with localStorage fallback.
 */
export async function saveCustomPracticeTest(
  test: CustomPracticeTest
): Promise<CustomPracticeTest> {
  const m1 = test.module1Questions || [];
  const m2 = test.module2Questions || [];
  const now = Date.now();

  const preparedTest: CustomPracticeTest = {
    ...test,
    id: test.id || `custom_test_${now}_${Math.random().toString(36).substring(2, 7)}`,
    module1Questions: m1,
    module2Questions: m2,
    totalQuestions: m1.length + m2.length,
    durationMinutes: test.durationMinutes || (test.moduleTimeMinutes ? test.moduleTimeMinutes * 2 : 70),
    moduleTimeMinutes: test.moduleTimeMinutes || 35,
    difficulty: test.difficulty || 'Standard',
    category: test.category || 'custom',
    createdAt: test.createdAt || now,
    updatedAt: now,
  };

  if (isIndexedDBSupported()) {
    try {
      const db = await openDatastore();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction([CUSTOM_TESTS_STORE], 'readwrite');
        const store = tx.objectStore(CUSTOM_TESTS_STORE);
        const req = store.put(preparedTest);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error || new Error('Failed to save custom test to IndexedDB'));
      });
    } catch (err) {
      console.warn('IndexedDB save failed, using localStorage fallback:', err);
    }
  }

  const fallback = getFallbackTests().filter((t) => t.id !== preparedTest.id);
  fallback.unshift(preparedTest);
  saveFallbackTests(fallback);

  notifyCustomTestsUpdated();
  return preparedTest;
}

/**
 * Retrieves all saved custom practice tests, ordered newest update first.
 */
export async function getAllCustomPracticeTests(): Promise<CustomPracticeTest[]> {
  let tests: CustomPracticeTest[] = [];

  if (isIndexedDBSupported()) {
    try {
      const db = await openDatastore();
      tests = await new Promise<CustomPracticeTest[]>((resolve, reject) => {
        const tx = db.transaction([CUSTOM_TESTS_STORE], 'readonly');
        const store = tx.objectStore(CUSTOM_TESTS_STORE);
        const req = store.getAll();
        req.onsuccess = () => resolve((req.result as CustomPracticeTest[]) || []);
        req.onerror = () => reject(req.error || new Error('Failed to read custom tests'));
      });
    } catch (err) {
      console.warn('IndexedDB read failed, using localStorage fallback:', err);
    }
  }

  if (tests.length === 0) {
    tests = getFallbackTests();
  }

  return tests.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
}

/**
 * Retrieves a custom practice test by ID.
 */
export async function getCustomPracticeTestById(id: string): Promise<CustomPracticeTest | null> {
  if (!id) return null;

  if (isIndexedDBSupported()) {
    try {
      const db = await openDatastore();
      const result = await new Promise<CustomPracticeTest | null>((resolve, reject) => {
        const tx = db.transaction([CUSTOM_TESTS_STORE], 'readonly');
        const store = tx.objectStore(CUSTOM_TESTS_STORE);
        const req = store.get(id);
        req.onsuccess = () => resolve((req.result as CustomPracticeTest) || null);
        req.onerror = () => reject(req.error || new Error('Failed to query custom test'));
      });

      if (result) return result;
    } catch (err) {
      console.warn('IndexedDB query failed, querying fallback localStorage:', err);
    }
  }

  const fallback = getFallbackTests();
  return fallback.find((t) => t.id === id) || null;
}

/**
 * Deletes a custom practice test by ID.
 */
export async function deleteCustomPracticeTest(id: string): Promise<boolean> {
  if (!id) return false;

  let deleted = false;
  if (isIndexedDBSupported()) {
    try {
      const db = await openDatastore();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction([CUSTOM_TESTS_STORE], 'readwrite');
        const store = tx.objectStore(CUSTOM_TESTS_STORE);
        const req = store.delete(id);
        req.onsuccess = () => {
          deleted = true;
          resolve();
        };
        req.onerror = () => reject(req.error || new Error('Failed to delete custom test'));
      });
    } catch (err) {
      console.warn('IndexedDB delete failed, deleting from localStorage fallback:', err);
    }
  }

  const fallback = getFallbackTests();
  const next = fallback.filter((d) => d.id !== id);
  if (next.length !== fallback.length) {
    deleted = true;
  }
  saveFallbackTests(next);

  if (deleted) {
    notifyCustomTestsUpdated();
  }
  return deleted;
}

/**
 * Exports a CustomPracticeTest into a valid, formatted TypeScript module string
 * matching the conventions in src/data/officialPracticeTest1.ts.
 */
export function exportTestToTypeScript(test: CustomPracticeTest): string {
  const safeIdentifier = (test.title || test.id || 'Custom_Practice_Test')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');

  const questionsConstName = `${safeIdentifier}_QUESTIONS`;
  const metaConstName = `${safeIdentifier}_META`;

  // Sort and re-number module 1 questions
  const sortedM1 = sortQuestionsByDifficulty(test.module1Questions || []).map((q, idx) => ({
    ...q,
    module: 1 as const,
    number: idx + 1,
  }));

  // Sort and re-number module 2 questions
  const m1Count = sortedM1.length;
  const sortedM2 = sortQuestionsByDifficulty(test.module2Questions || []).map((q, idx) => ({
    ...q,
    module: 2 as const,
    number: m1Count + idx + 1,
  }));

  const allQuestions = [...sortedM1, ...sortedM2];

  const metadata = {
    id: test.id,
    title: test.title,
    description: test.description || `Custom SAT Math Practice Test with ${allQuestions.length} questions.`,
    category: test.category || 'custom',
    badge: test.badge || 'ScoreUp Custom',
    difficulty: test.difficulty || 'Standard',
    durationMinutes: test.durationMinutes || 70,
    moduleTimeMinutes: test.moduleTimeMinutes || 35,
    totalQuestions: allQuestions.length,
    module1Count: sortedM1.length,
    module2Count: sortedM2.length,
    createdAt: test.createdAt,
    updatedAt: test.updatedAt,
  };

  return `// Auto-generated by ScoreUp Admin & AI Content Pipeline
import { Question } from '../types';

/**
 * ${test.title}
 * Total Questions: ${allQuestions.length}
 * Module 1: Questions 1 – ${sortedM1.length} (${test.moduleTimeMinutes || 35} Minutes)
 * Module 2: Questions ${sortedM1.length + 1} – ${allQuestions.length} (${test.moduleTimeMinutes || 35} Minutes)
 * Difficulty: ${test.difficulty || 'Standard'}
 * Exported: ${new Date().toISOString()}
 */

export const ${metaConstName} = ${JSON.stringify(metadata, null, 2)} as const;

export const ${questionsConstName}: Question[] = ${JSON.stringify(allQuestions, null, 2)};
`;
}

export const ADMIN_QUESTION_BANK_KEY = 'scoreup_admin_question_bank';

/**
 * Saves a single question to the custom admin question bank in localStorage.
 * If question already exists by ID, it updates it; otherwise prepends it.
 */
export function saveQuestionToBank(question: Question): Question {
  if (!question || !question.id) {
    throw new Error('Valid question with ID is required.');
  }

  try {
    const existing = getSavedQuestionBank();
    const index = existing.findIndex((q) => q.id === question.id);
    let updated: Question[];
    if (index >= 0) {
      updated = [...existing];
      updated[index] = question;
    } else {
      updated = [question, ...existing];
    }

    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(ADMIN_QUESTION_BANK_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('scoreup_question_bank_updated', { detail: question }));
    }
    return question;
  } catch (err) {
    console.error('Failed to save question to question bank:', err);
    throw err;
  }
}

/**
 * Retrieves all saved questions from the custom admin question bank.
 */
export function getSavedQuestionBank(): Question[] {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return [];
    const raw = window.localStorage.getItem(ADMIN_QUESTION_BANK_KEY);
    return raw ? (JSON.parse(raw) as Question[]) : [];
  } catch (err) {
    console.warn('Failed to load saved question bank:', err);
    return [];
  }
}

/**
 * Deletes a question from the custom admin question bank by ID.
 */
export function deleteQuestionFromBank(questionId: string): boolean {
  try {
    const existing = getSavedQuestionBank();
    const filtered = existing.filter((q) => q.id !== questionId);
    if (filtered.length !== existing.length) {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(ADMIN_QUESTION_BANK_KEY, JSON.stringify(filtered));
        window.dispatchEvent(new CustomEvent('scoreup_question_bank_updated'));
      }
      return true;
    }
    return false;
  } catch (err) {
    console.error('Failed to delete question from question bank:', err);
    return false;
  }
}

