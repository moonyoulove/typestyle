import { style, getStyles, reinit, cssRaw } from '../index';
import * as assert from 'assert';
import escapeStringRegexp from 'escape-string-regexp';
import { hid } from './constants';

describe("raw css support", () => {
  it('should insert raw css by itself', () => {
    reinit();
    const rawCSS = `
    body {
      width: '100%'
    }
`;
    cssRaw(rawCSS);
    assert.equal(getStyles(), rawCSS);
  })
  it('should insert raw CSS followed by style', () => {
    reinit();
    const rawCSS = `
    body {
      width: '100%'
    }
`;
    style({
      color: 'red'
    })
    cssRaw(rawCSS);
    assert.match(getStyles(),  new RegExp(`${escapeStringRegexp(rawCSS)}\\.${hid}\\{color:red\\}`));
  })
});
