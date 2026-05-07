export const APP_NAME = 'CodeStep';
export const APP_VERSION = '0.1.0';

export const SUPPORTED_LANGUAGES = ['java', 'python', 'javascript'] as const;

export const EXECUTION_TIMEOUT_MS = 5000;
export const AUTO_VALIDATE_DELAY_MS = 500;

export const KEYBOARD_SHORTCUTS = {
  VALIDATE: 'Enter',
  HINT: 'Tab',
  RESET: 'r',
  ANSWER: 'a',
  FOCUS_MODE: 'f',
  EXIT_FOCUS: 'Escape',
  PREV_STEP: 'ArrowUp',
  NEXT_STEP: 'ArrowDown',
} as const;
