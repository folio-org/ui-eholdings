jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useHistory: jest.fn().mockReturnValue({
    push: jest.fn(),
    replace: jest.fn(),
    location: {},
    back: jest.fn(),
    block: jest.fn().mockReturnValue(jest.fn()),
    listen: jest.fn(),
  }),
  useLocation: jest.fn().mockReturnValue({
    search: '',
    pathname: '',
  }),
  useParams: jest.fn().mockReturnValue({}),
}));
