import {
  render,
  cleanup,
} from '@folio/jest-config-stripes/testing-library/react';

import IntlProvider from '../../../../../../test/jest/helpers/intl';

import ProviderInformation from './provider-information';

describe('Given ProviderInformation', () => {
  let component;
  const onToggleMock = jest.fn();

  const renderProviderInformation = (props = {}) => render(
    <IntlProvider>
      <ProviderInformation
        isOpen
        onToggle={onToggleMock}
        packagesSelected={5}
        packagesTotal={10}
        {...props}
      />
    </IntlProvider>
  );

  beforeEach(() => {
    component = renderProviderInformation();
  });

  afterEach(() => {
    cleanup();
    onToggleMock.mockClear();
  });

  it('should render an accordion', () => {
    expect(component.getByText('ui-eholdings.provider.providerInformation')).toBeDefined();
  });

  it('should display accordion content by default', () => {
    expect(component.getByText('ui-eholdings.provider.packagesSelected')).toBeDefined();
  });

  it('should display correct number of selected packages', () => {
    const selectedKeyValue = component.getByTestId('provider-details-packages-selected');

    expect(selectedKeyValue.textContent).toEqual('5');
  });

  it('should display correct number of total packages', () => {
    const selectedKeyValue = component.getByTestId('provider-details-packages-total');

    expect(selectedKeyValue.textContent).toEqual('10');
  });
});
