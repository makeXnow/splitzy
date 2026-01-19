export const MODEL_NAME = "gemini-2.0-flash-exp";

export const VIEW_MODES = {
  RECEIPT: 'receipt',
  PEOPLE: 'people'
};

export const COLOR_THEMES = [
  'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose'
];

export const PRESETS = COLOR_THEMES.map(theme => ({ theme }));

const THEME_MAP = {
  red: {
    bg: 'bg-red-100 dark:bg-red-900/30',
    border: 'border-red-200 dark:border-red-800',
    text: 'text-red-900 dark:text-red-100',
    chip: 'bg-red-100 dark:bg-red-900/40 border-red-200 dark:border-red-800 text-red-900 dark:text-red-100',
    activeBorder: 'border-red-500 dark:border-red-400',
    dot: 'bg-red-500'
  },
  orange: {
    bg: 'bg-orange-100 dark:bg-orange-900/30',
    border: 'border-orange-200 dark:border-orange-800',
    text: 'text-orange-900 dark:text-orange-100',
    chip: 'bg-orange-100 dark:bg-orange-900/40 border-orange-200 dark:border-orange-800 text-orange-900 dark:text-orange-100',
    activeBorder: 'border-orange-500 dark:border-orange-400',
    dot: 'bg-orange-500'
  },
  amber: {
    bg: 'bg-amber-100 dark:bg-amber-900/30',
    border: 'border-amber-200 dark:border-amber-800',
    text: 'text-amber-900 dark:text-amber-100',
    chip: 'bg-amber-100 dark:bg-amber-900/40 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-100',
    activeBorder: 'border-amber-500 dark:border-amber-400',
    dot: 'bg-amber-500'
  },
  yellow: {
    bg: 'bg-yellow-100 dark:bg-yellow-900/30',
    border: 'border-yellow-200 dark:border-yellow-800',
    text: 'text-yellow-900 dark:text-yellow-100',
    chip: 'bg-yellow-100 dark:bg-yellow-900/40 border-yellow-200 dark:border-yellow-800 text-yellow-900 dark:text-yellow-100',
    activeBorder: 'border-yellow-400 dark:border-yellow-300',
    dot: 'bg-yellow-400'
  },
  lime: {
    bg: 'bg-lime-100 dark:bg-lime-900/30',
    border: 'border-lime-200 dark:border-lime-800',
    text: 'text-lime-900 dark:text-lime-100',
    chip: 'bg-lime-100 dark:bg-lime-900/40 border-lime-200 dark:border-lime-800 text-lime-900 dark:text-lime-100',
    activeBorder: 'border-lime-500 dark:border-lime-400',
    dot: 'bg-lime-500'
  },
  green: {
    bg: 'bg-green-100 dark:bg-green-900/30',
    border: 'border-green-200 dark:border-green-800',
    text: 'text-green-900 dark:text-green-100',
    chip: 'bg-green-100 dark:bg-green-900/40 border-green-200 dark:border-green-800 text-green-900 dark:text-green-100',
    activeBorder: 'border-green-500 dark:border-green-400',
    dot: 'bg-green-500'
  },
  emerald: {
    bg: 'bg-emerald-100 dark:bg-emerald-900/30',
    border: 'border-emerald-200 dark:border-emerald-800',
    text: 'text-emerald-900 dark:text-emerald-100',
    chip: 'bg-emerald-100 dark:bg-emerald-900/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100',
    activeBorder: 'border-emerald-500 dark:border-emerald-400',
    dot: 'bg-emerald-500'
  },
  teal: {
    bg: 'bg-teal-100 dark:bg-teal-900/30',
    border: 'border-teal-200 dark:border-teal-800',
    text: 'text-teal-900 dark:text-teal-100',
    chip: 'bg-teal-100 dark:bg-teal-900/40 border-teal-200 dark:border-teal-800 text-teal-900 dark:text-teal-100',
    activeBorder: 'border-teal-500 dark:border-teal-400',
    dot: 'bg-teal-500'
  },
  cyan: {
    bg: 'bg-cyan-100 dark:bg-cyan-900/30',
    border: 'border-cyan-200 dark:border-cyan-800',
    text: 'text-cyan-900 dark:text-cyan-100',
    chip: 'bg-cyan-100 dark:bg-cyan-900/40 border-cyan-200 dark:border-cyan-800 text-cyan-900 dark:text-cyan-100',
    activeBorder: 'border-cyan-500 dark:border-cyan-400',
    dot: 'bg-cyan-500'
  },
  sky: {
    bg: 'bg-sky-100 dark:bg-sky-900/30',
    border: 'border-sky-200 dark:border-sky-800',
    text: 'text-sky-900 dark:text-sky-100',
    chip: 'bg-sky-100 dark:bg-sky-900/40 border-sky-200 dark:border-sky-800 text-sky-900 dark:text-sky-100',
    activeBorder: 'border-sky-500 dark:border-sky-400',
    dot: 'bg-sky-500'
  },
  blue: {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    border: 'border-blue-200 dark:border-blue-800',
    text: 'text-blue-900 dark:text-blue-100',
    chip: 'bg-blue-100 dark:bg-blue-900/40 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-100',
    activeBorder: 'border-blue-500 dark:border-blue-400',
    dot: 'bg-blue-500'
  },
  indigo: {
    bg: 'bg-indigo-100 dark:bg-indigo-900/30',
    border: 'border-indigo-200 dark:border-indigo-800',
    text: 'text-indigo-900 dark:text-indigo-100',
    chip: 'bg-indigo-100 dark:bg-indigo-900/40 border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-100',
    activeBorder: 'border-indigo-500 dark:border-indigo-400',
    dot: 'bg-indigo-500'
  },
  violet: {
    bg: 'bg-violet-100 dark:bg-violet-900/30',
    border: 'border-violet-200 dark:border-violet-800',
    text: 'text-violet-900 dark:text-violet-100',
    chip: 'bg-violet-100 dark:bg-violet-900/40 border-violet-200 dark:border-violet-800 text-violet-900 dark:text-violet-100',
    activeBorder: 'border-violet-500 dark:border-violet-400',
    dot: 'bg-violet-500'
  },
  purple: {
    bg: 'bg-purple-100 dark:bg-purple-900/30',
    border: 'border-purple-200 dark:border-purple-800',
    text: 'text-purple-900 dark:text-purple-100',
    chip: 'bg-purple-100 dark:bg-purple-900/40 border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-100',
    activeBorder: 'border-purple-500 dark:border-purple-400',
    dot: 'bg-purple-500'
  },
  fuchsia: {
    bg: 'bg-fuchsia-100 dark:bg-fuchsia-900/30',
    border: 'border-fuchsia-200 dark:border-fuchsia-800',
    text: 'text-fuchsia-900 dark:text-fuchsia-100',
    chip: 'bg-fuchsia-100 dark:bg-fuchsia-900/40 border-fuchsia-200 dark:border-fuchsia-800 text-fuchsia-900 dark:text-fuchsia-100',
    activeBorder: 'border-fuchsia-500 dark:border-fuchsia-400',
    dot: 'bg-fuchsia-500'
  },
  pink: {
    bg: 'bg-pink-100 dark:bg-pink-900/30',
    border: 'border-pink-200 dark:border-pink-800',
    text: 'text-pink-900 dark:text-pink-100',
    chip: 'bg-pink-100 dark:bg-pink-900/40 border-pink-200 dark:border-pink-800 text-pink-900 dark:text-pink-100',
    activeBorder: 'border-pink-500 dark:border-pink-400',
    dot: 'bg-pink-500'
  },
  rose: {
    bg: 'bg-rose-100 dark:bg-rose-900/30',
    border: 'border-rose-200 dark:border-rose-800',
    text: 'text-rose-900 dark:text-rose-100',
    chip: 'bg-rose-100 dark:bg-rose-900/40 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-100',
    activeBorder: 'border-rose-500 dark:border-rose-400',
    dot: 'bg-rose-500'
  }
};

export const getThemeClasses = (theme) => THEME_MAP[theme] || THEME_MAP.blue;
