jest.mock('../../../src/hooks', () => ({
  ...jest.requireActual('../../../src/hooks'),
  useProvider: jest.fn().mockReturnValue({
    isLoaded: true,
    isLoading: false,
    id: 'providerid',
    data: {
      providerToken: {
        value: 'provider-token',
        prompt: 'proxy-prompt',
      },
      proxy: {
        id: 'proxy-id',
      },
    },
  }),
  usePackageModel: jest.fn().mockReturnValue({
    model: {},
    isLoaded: true,
    isLoading: false,
    request: {},
    update: {},
    destroy: {},
  }),
  usePackageUpdate: jest.fn().mockReturnValue({
    updatePackage: jest.fn(),
    isLoading: false,
    errors: [],
    isError: false,
  }),
  useUpdatePackageTitlesSelection: jest.fn().mockReturnValue({
    updateTitles: jest.fn(),
  }),
}));
