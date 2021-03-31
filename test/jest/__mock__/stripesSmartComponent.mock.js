jest.mock('@folio/stripes/smart-components', () => ({
  ...jest.requireActual('@folio/stripes/smart-components'),
  NotesSmartAccordion: ({ open }) => (open ? (<span>content of NotesSmartAccordion</span>) : null),
}));
