jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  KeyValue: jest.fn(({ label, children }) => (
    <>
      <span>{label}</span>
      <span>{children}</span>
    </>
  )),
  NoValue: jest.fn(({ ariaLabel }) => (<span>{ariaLabel}</span>)),
}));
