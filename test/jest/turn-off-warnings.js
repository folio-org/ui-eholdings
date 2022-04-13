// eslint-disable-next-line no-console
const warn = console.warn;
const blacklist = [
  /[@formatjs/intl]/,
];

// eslint-disable-next-line no-console
const error = console.error;
const errorBlacklist = [
  /React Intl/,
  /Cannot update a component from inside the function body of a different component/,
  /Can't perform a React state update on an unmounted component./,
  /Invalid prop `component` supplied to.*Field/,
  /@formatjs\/intl Error MISSING_TRANSLATION/,
  /Warning: React does not recognize the `%s` prop on a DOM element/,
  /Warning: Unknown event handler property `%s`./,
  /No metadata harvested from package files, so you will not get app icons./,
  /Invalid prop `icon` supplied to `Icon`/,
];

global.beforeAll(() => {
  // eslint-disable-next-line no-console
  console.warn = function (...args) {
    if (blacklist.some(rx => rx.test(args.join(' ')))) {
      return;
    }
    warn.apply(console, args);
  };

  // eslint-disable-next-line no-console
  console.error = function (...args) {
    if (errorBlacklist.some(rx => rx.test(args.join(' ')))) {
      return;
    }
    error.apply(console, args);
  };
});
