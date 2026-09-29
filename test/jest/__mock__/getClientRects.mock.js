Object.defineProperty(HTMLElement.prototype, 'getClientRects', {
  configurable: true,
  value: () => [],
});

Range.prototype.getClientRects = () => [];
