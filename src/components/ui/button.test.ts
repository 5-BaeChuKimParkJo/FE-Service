import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Button } from './Button';

describe('Button rendering', () => {
  it('passes exactly one link child to the Radix slot', () => {
    const html = renderToStaticMarkup(
      createElement(
        Button,
        { asChild: true },
        createElement('a', { href: '/auctions/test' }, 'Return to auction'),
      ),
    );
    expect(html).toContain('href="/auctions/test"');
    expect(html).toContain('Return to auction');
    expect(html).not.toContain('<button');
  });

  it('keeps the regular pending button disabled with its spinner and label', () => {
    const html = renderToStaticMarkup(
      createElement(Button, { isPending: true }, 'Checking'),
    );
    expect(html).toContain('<button');
    expect(html).toContain('disabled=""');
    expect(html).toContain('<svg');
    expect(html).toContain('Checking');
  });
});
