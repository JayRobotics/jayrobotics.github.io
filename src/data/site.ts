/**
 * Site-wide values that used to live in Jekyll's _config.yml. Collected here
 * so that file can be deleted without losing anything that still matters.
 */
export const site = {
  /** Shown in <title> and the feed. */
  title: 'Real Robot',
  /** The wordmark in the header. */
  brand: 'JayRobotics',
  /** The heading on the home page. */
  tagline: 'Physical AI를 공부하며 남기는 기록',
  /** The paragraph under it. */
  intro:
    'IL/RL을 기반으로 정책을 학습시키는 일과, 그 정책이 실제 하드웨어 위에서 무너지지 않게 만드는 일 사이의 간극에 관심이 있습니다.',
  /**
   * What search results and the feed show. Built from the tagline so editing
   * one line changes both; they were three separate strings in three files,
   * which is how the page says one thing and Google says another.
   */
  get description() {
    return `${this.tagline}. 강화학습, 알고리즘, 로보틱스 노트.`;
  },
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
