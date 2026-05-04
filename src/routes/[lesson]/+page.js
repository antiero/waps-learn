const allowed = new Set(['oscillator', 'filter', 'envelope']);

export function load({ params }) {
  const lesson = allowed.has(params.lesson) ? params.lesson : 'oscillator';
  return { lesson };
}

export const prerender = true;
export const entries = ['oscillator', 'filter', 'envelope'];
