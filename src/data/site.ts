/**
 * Site-wide values that used to live in Jekyll's _config.yml. Collected here
 * so that file can be deleted without losing anything that still matters.
 */
export const site = {
  /** Shown in <title> and the feed. */
  title: 'Real Robot',
  /** The wordmark in the header. */
  brand: 'JayRobotics',
  description: 'Physical AI를 공부하며 남기는 기록. 강화학습, 알고리즘, 로보틱스 노트.',
  author: 'JaeJin Hwang',
  lang: 'ko-KR',

  /**
   * utterances keeps each thread in a GitHub issue found by `issue-term`.
   * `pathname` means the comments on a post are tied to its URL, which is why
   * the URL manifest is the hard constraint it is (CLAUDE.md section 3).
   */
  comments: {
    repo: 'JayRobotics/jayrobotics.github.io',
    issueTerm: 'pathname',
    label: 'Comments',
    themes: { light: 'github-light', dark: 'github-dark' },
  },
} as const;
