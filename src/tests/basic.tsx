import { style, stylesheet, getStyles, reinit, classes, cssRule, createTypeStyle, hid} from '../index';
import * as assert from 'assert';

describe("initial test", () => {
  it("should pass", () => {
    reinit();
    assert(getStyles() === '');

    style({ color: 'red' });
    assert.match(getStyles(), new RegExp(`^\\.${hid}\\{color:red\\}$`));
  });

  it("reinit should clear", () => {
    reinit();
    assert(getStyles() === '');

    style({ color: 'red' });
    assert.match(getStyles(), new RegExp(`^\\.${hid}\\{color:red\\}$`));
  });

  it("child same", () => {
    reinit();
    style({ color: 'red', $nest: { '&>*': { color: 'red' } } });
    assert.match(getStyles(), new RegExp(`^\\.${hid},\\.${hid}>\\*\\{color:red\\}$`));
  });

  it("child same unique", () => {
    reinit();
    style({ color: 'red', $nest: { '&>*': { color: 'red', $unique: true } } });
    assert.match(getStyles(), new RegExp(`^\\.${hid}\\{color:red\\}\\.${hid}>\\*\\{color:red\\}$`));
  });

  it("child different", () => {
    reinit();
    style({ color: 'red', $nest: { '&>*': { color: 'blue' } } });
    assert.match(getStyles(), new RegExp(`^\\.${hid}\\{color:red\\}\\.${hid}>\\*\\{color:blue\\}$`));
  });

  it("media same", () => {
    reinit();
    style({
      color: 'red',
      $nest: {
        '@media (min-width: 400px)': { color: 'red' }
      }
    });
    assert.match(getStyles(), new RegExp(`^\\.${hid}\\{color:red\\}@media \\(min-width: 400px\\)\\{\\.${hid}\\{color:red\\}\\}$`));
  });

  it("media different", () => {
    reinit();
    style({ color: 'red', $nest: { '@media (min-width: 400px)': { color: 'blue' } } });
    assert.match(getStyles(), new RegExp(`^\\.${hid}\\{color:red\\}@media \\(min-width: 400px\\)\\{\\.${hid}\\{color:blue\\}\\}$`));
  });

  it("classes should compose", () => {
    assert.equal(classes("a", "b"), "a b");
    assert.equal(classes("a", false && "b"), "a");
    assert.equal(classes("a", false && "b", "c"), "a c");
    assert.equal(classes("a", false && "b", "c", { d: false, e: true }, { f: {}, g: null }), "a c e f");
  });

  it("transparent string should render transparent in color property", () => {
    reinit();
    cssRule('.transparent', { color: 'transparent' });
    style({ color: 'transparent' });
    assert.match(getStyles(), new RegExp(`^\\.transparent,\\.${hid}\\{color:transparent\\}$`));
  });

  it("should support dedupe by default", () => {
    reinit();
    style({
      color: 'blue',
      $nest: {
        '&::-webkit-input-placeholder': {
          color: `rgba(0, 0, 0, 0)`,
        },
        '&::-moz-placeholder': {
          color: `rgba(0, 0, 0, 0)`,
        },
        '&::-ms-input-placeholder': {
          color: `rgba(0, 0, 0, 0)`,
        }
      }
    });
    assert.match(getStyles(), new RegExp(`^\\.${hid}\\{color:blue\\}\\.${hid}::-webkit-input-placeholder,\\.${hid}::-moz-placeholder,\\.${hid}::-ms-input-placeholder\\{color:rgba\\(0, 0, 0, 0\\)\\}$`));
  });

  it("should support $unique", () => {
    reinit();
    style({
      color: 'blue',
      $nest: {
        '&::-webkit-input-placeholder': {
          $unique: true,
          color: `rgba(0, 0, 0, 0)`,
        },
        '&::-moz-placeholder': {
          $unique: true,
          color: `rgba(0, 0, 0, 0)`,
        },
        '&::-ms-input-placeholder': {
          $unique: true,
          color: `rgba(0, 0, 0, 0)`,
        }
      }
    });
    assert.match(getStyles(), new RegExp(`^\\.${hid}\\{color:blue\\}\\.${hid}::-webkit-input-placeholder\\{color:rgba\\(0, 0, 0, 0\\)\\}\\.${hid}::-moz-placeholder\\{color:rgba\\(0, 0, 0, 0\\)\\}\\.${hid}::-ms-input-placeholder\\{color:rgba\\(0, 0, 0, 0\\)\\}$`));
  });

  it("should support $debugName", () => {
    reinit();
    style({
      $debugName: 'sample',
      color: 'blue',
      $nest: {
        '&:hover': {
          color: 'rgba(0, 0, 0, 0)',
        }
      }
    });
    assert.match(getStyles(), new RegExp(`^\\.sample_${hid}\\{color:blue\\}\\.sample_${hid}:hover\\{color:rgba\\(0, 0, 0, 0\\)\\}$`));
  });

  it("should generate meaningful classnames using stylesheet", () => {
    reinit();
    const classes = stylesheet({
      warning: {
        color: 'red'
      },
      success: {
        color: 'green'
      }
    });
    assert.match(classes.warning, new RegExp(`^warning_${hid}$`));
    assert.match(classes.success, new RegExp(`^success_${hid}$`));
    assert.match(getStyles(), new RegExp(`^\\.warning_${hid}\\{color:red\\}\\.success_${hid}\\{color:green\\}$`));
  })

  it("style should ignore 'false' 'null' and 'undefined'", () => {
    reinit();
    style(
      { color: 'blue' },
      false && { color: 'red' },
      null,
      undefined,
      { backgroundColor: 'red' }
    );
    assert.match(getStyles(), new RegExp(`^\\.${hid}\\{background-color:red;color:blue\\}$`));
  });

  it("should generate unique instances when typestyle() is called", () => {
    const ts1 = createTypeStyle({ textContent: '' });
    const ts2 = createTypeStyle({ textContent: '' });

    ts1.style({ fontSize: 14 });
    ts2.style({ fontSize: 16 });

    assert.match(ts1.getStyles(), new RegExp(`^\\.${hid}\\{font-size:14px\\}$`));
    assert.match(ts2.getStyles(), new RegExp(`^\\.${hid}\\{font-size:16px\\}$`));
  });

  it("should work if no target is set on an instance", () => {
    const ts = createTypeStyle();
    ts.cssRule('body', { fontSize: 12 });

    assert.equal(ts.getStyles(), 'body{font-size:12px}');
  });
})
