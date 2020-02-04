// eslint-disable-next-line no-console
const warn = console.warn;
const blacklist = [
  /componentWillReceiveProps has been renamed/,
  /componentWillUpdate has been renamed/,
  /componentWillMount has been renamed/,
];

export default function turnOffWarnings() {
  // eslint-disable-next-line no-console
  console.warn = function (...args) {
    if (blacklist.some(rx => rx.test(args[0]))) {
      return;
    }
    warn.apply(console, args);
  };
}
