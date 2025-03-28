import { cssRule, style, getStyles, reinit, media } from '../index';
import * as assert from 'assert';
import { hid } from './constants';

describe("media query", () => {
  it("standard freestyle", () => {
    reinit();
    style({
      color: 'red',
      $nest: {
        '@media (min-width: 400px)': { color: 'red' }
      }
    });
    const standardFreeStyle = getStyles();
    reinit();
    style({ color: 'red' }, media({
      minWidth: 400
    }, { color: 'red' }));
    assert.equal(getStyles(), standardFreeStyle);
  });

  it("support type", () => {
    reinit();
    style({ color: 'red' }, media({ minWidth: 400, type: 'screen' }, { color: 'red' }));
    assert.match(getStyles(), new RegExp(`^\\.${hid}\\{color:red\\}@media screen and \\(min-width: 400px\\)\\{\\.${hid}\\{color:red\\}\\}$`));
  });

  it("support $nest", () => {
    reinit();
    style(media(
      { minWidth: 400 },
      {
        color: 'red',
        $nest: {
          '&:hover': {
            color: 'green'
          }
        }
      }));
    assert.match(getStyles(), new RegExp(`^@media \\(min-width: 400px\\)\\{\\.${hid}\\{color:red\\}\\.${hid}:hover\\{color:green\\}\\}$`));
  });

  it("support non-pixel min-width", () => {
    reinit();
    const mediaRules = media(
      { minWidth: '20vh' },
      { width: '10vh' }
    );
    cssRule('.component', mediaRules);
    assert.equal(getStyles(), '@media (min-width: 20vh){.component{width:10vh}}');
  });

  it("support non-pixel max-width", () => {
    reinit();
    const mediaRules = media(
      { maxWidth: '20vh' },
      { width: '10vh' }
    );
    cssRule('.component', mediaRules);
    assert.equal(getStyles(), '@media (max-width: 20vh){.component{width:10vh}}');
  });

  it("support non-pixel min-height", () => {
    reinit();
    const mediaRules = media(
      { minHeight: '20vh' },
      { height: '10vh' }
    );
    cssRule('.component', mediaRules);
    assert.equal(getStyles(), '@media (min-height: 20vh){.component{height:10vh}}');
  });

  it("support non-pixel max-height", () => {
    reinit();
    const mediaRules = media(
      { maxHeight: '20vh' },
      { height: '10vh' }
    );
    cssRule('.component', mediaRules);
    assert.equal(getStyles(), '@media (max-height: 20vh){.component{height:10vh}}');
  });

  it("support orientation", () => {
    reinit();
    const mediaRules = media(
      { orientation: 'portrait' },
      { color: 'red' }
    );
    cssRule('.component', mediaRules);
    assert.equal(getStyles(), '@media (orientation: portrait){.component{color:red}}');
  });
})
