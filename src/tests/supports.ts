import { style, getStyles, reinit } from '../index';
import * as assert from 'assert';
import { hid } from './constants';

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
