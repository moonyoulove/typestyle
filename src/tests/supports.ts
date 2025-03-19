import { style, getStyles, reinit, hid } from '../index';
import * as assert from 'assert';

describe('@supports', () => {
  it('standard freestyle', () => {
    reinit();
    style({
      color: 'red',
      $nest: {
        '@supports (display: flex)': {
          color: 'white'
        }
      }
    });
    assert.match(getStyles(), new RegExp(`.${hid}\\{color:red\\}@supports \\(display: flex\\)\\{\\.${hid}\\{color:white\\}\\}`));
  });
});
