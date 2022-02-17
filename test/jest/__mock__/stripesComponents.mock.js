jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  Icon: jest.fn(() => (<span>Icon</span>)),
  KeyValue: jest.fn(({ label, children, value }) => (
    <>
      <span>{label}</span>
      <span>{value || children}</span>
    </>
  )),
  NoValue: jest.fn(({ ariaLabel }) => (<span>{ariaLabel || 'NoValue'}</span>)),
}));
