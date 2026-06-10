/**
 * Lightweight ticker snippets for Home/About — full testimonials load only on /testimonials.
 */
import { testimonials2021Ticker } from './testimonials-2021-ticker.js';

const ticker2025 = [
  {
    id: 'nathan-douglas-2025',
    sourceYear: 2025,
    by: 'Nathan Douglas',
    byShort: 'N. D.',
    excerpt:
      "He's not stuck in a box like most professionals—he's got range, and he's not scared to go deep.",
  },
  {
    id: 'titus-willke-2025',
    sourceYear: 2025,
    by: 'Titus Willke',
    byShort: 'T. W.',
    excerpt: 'Belief Mastery changed how I operate on a daily basis—it changed my life.',
  },
  {
    id: 'titus-willke-mens-group-2025',
    sourceYear: 2025,
    by: 'Titus Willke',
    byShort: 'T. W.',
    role: "Men's group, 2025",
    excerpt:
      'The culture of willingness to grow set it apart from any other group work I had done.',
  },
];

export function getTickerTestimonials() {
  return [...ticker2025, ...testimonials2021Ticker].sort((a, b) => {
    if (b.sourceYear !== a.sourceYear) return b.sourceYear - a.sourceYear;
    return a.by.localeCompare(b.by);
  });
}
