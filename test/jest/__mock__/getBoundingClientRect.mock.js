Object.defineProperty(HTMLElement.prototype, 'getBoundingClientRect', {
  configurable: true,
  value: () => ({
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    x: 0,
    y: 0,
    toJSON: () => {},
  }),
});

Range.prototype.getBoundingClientRect = () => ({
  width: 0,
  height: 0,
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  x: 0,
  y: 0,
  toJSON: () => {},
});

Object.defineProperty(document, 'elementFromPoint', {
  configurable: true,
  value: () => null,
});
