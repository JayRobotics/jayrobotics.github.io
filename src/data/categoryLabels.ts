/**
 * Short badges for post lists. A category that is not listed falls back to its
 * own name, so adding one does not require touching this file.
 *
 * Moved here from _data/category_labels.yml: Vite has no YAML loader by
 * default, and a four-entry lookup does not justify adding one.
 */
export const categoryLabels: Record<string, string> = {
  'Reinforcement Learning': 'RL',
  Algorithm: 'Algo',
  'GitHub Pages': 'Pages',
  Setup: 'Setup',
};
