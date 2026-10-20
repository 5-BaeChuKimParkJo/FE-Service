import { expect, it } from 'vitest';
import Swiper from 'swiper';

it('does not pollute shared prototypes when merging crafted Swiper options', () => {
  const indexOf = Array.prototype.indexOf;
  const prototype = Object.prototype as Record<string, unknown>;
  const key = 'chalnakSwiperPolluted';
  try {
    Array.prototype.indexOf = () => -1;
    Swiper.extendDefaults(JSON.parse(`{"__proto__":{"${key}":true}}`));
    expect(Object.hasOwn(prototype, key)).toBe(false);
  } finally {
    Array.prototype.indexOf = indexOf;
    delete prototype[key];
  }
});
