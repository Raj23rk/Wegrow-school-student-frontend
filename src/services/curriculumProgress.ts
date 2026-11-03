export interface CurriculumProgress {
  courseTitle: string;
  activePhaseNumber: number;
  activePhaseTitle: string;
  activeMilestone: string;
  completedHours: number;
  totalHours: number;
  completedPhases: number[];
  recentCoveredTopic: string;
  lastUpdatedDate: string;
  batch: string;
}

const STORAGE_KEY = 'wegrow_curriculum_progress_v1';

export const DEFAULT_CURRICULUM_PROGRESS: CurriculumProgress = {
  courseTitle: 'Complete AI & Generative AI Course (6 Phases • 20 Modules)',
  activePhaseNumber: 2,
  activePhaseTitle: 'Phase 2: ML Fundamentals, Lobe & Advanced ML',
  activeMilestone: 'Phase 2 in progress',
  completedHours: 64,
  totalHours: 345,
  completedPhases: [1],
  recentCoveredTopic: 'Machine Learning Core, Lobe Image Classification & Teachable Machine',
  lastUpdatedDate: new Date().toISOString().split('T')[0],
  batch: 'Cohort Alpha (12-Month Diploma)',
};

export function getCurriculumProgress(): CurriculumProgress {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...DEFAULT_CURRICULUM_PROGRESS, ...parsed };
    }
  } catch (err) {
    console.warn('Could not read curriculum progress from storage:', err);
  }
  return DEFAULT_CURRICULUM_PROGRESS;
}

export function saveCurriculumProgress(progress: CurriculumProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (err) {
    console.warn('Could not save curriculum progress to storage:', err);
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('curriculum:progress_updated', {
        detail: progress,
      })
    );
  }
}

