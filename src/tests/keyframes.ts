import { reinit, keyframes, hid } from '../index';
import * as assert from 'assert';

describe("keyframes", () => {
  it('supports $debugName in animation name', () => {
      reinit();
      const animationName = keyframes({
        $debugName: 'fade-in',
        from: { opacity: 0 },
        to: { opacity: 1 }
      });
      assert.match(animationName, new RegExp(`^fade-in_${hid}$`));
  });

  it('supports generated animation name', () => {
    reinit();
    const animationName = keyframes({
      from: { opacity: 0 },
      to: { opacity: 1 }
    });
    assert.match(animationName, new RegExp(`^${hid}$`));
  });
});
