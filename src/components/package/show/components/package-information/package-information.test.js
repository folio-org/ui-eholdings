import {
  render,
  cleanup,
} from '@folio/jest-config-stripes/testing-library/react';

import Harness from '../../../../../../test/jest/helpers/harness';

import PackageInformation from './package-information';

describe('Given PackageInformation', () => {
  let component;
  const onToggleMock = jest.fn();

  const renderPackageInformation = (props = {}) => render(
    <Harness>
      <PackageInformation
        isOpen
        onToggle={onToggleMock}
        model={{
          providerId: 'provider-id',
          providerName: 'provider-name',
          contentType: 'book',
          packageType: 'complete',
          selectedCount: 10,
          titleCount: 20,
        }}
        {...props}
      />
    </Harness>
  );

  afterEach(() => {
    cleanup();
    onToggleMock.mockClear();
  });

  it('should render an accordion', () => {
    component = renderPackageInformation();
    expect(component.getByText('ui-eholdings.label.packageInformation')).toBeDefined();
  });

  it('should display a link to provider', () => {
    component = renderPackageInformation();
    expect(component.getByText('provider-name').href).toBe('http://localhost/eholdings/providers/provider-id');
  });

  it('should display content type', () => {
    component = renderPackageInformation();
    expect(component.getByTestId('package-details-content-type').textContent).toBe('book');
  });

  it('should display package type', () => {
    component = renderPackageInformation();
    expect(component.getByTestId('package-details-type').textContent).toBe('complete');
  });

  it('should display selected count', () => {
    component = renderPackageInformation();
    expect(component.getByTestId('package-details-titles-selected').textContent).toBe('10');
  });

  it('should display content type', () => {
    component = renderPackageInformation();
    expect(component.getByTestId('package-details-titles-total').textContent).toBe('20');
  });

  describe('when package does not have content type', () => {
    it('should not display content type', () => {
      component = renderPackageInformation({
        model: {
          contentType: null,
        },
      });
      expect(component.queryByTestId('package-details-content-type')).toBeNull();
    });
  });

  describe('when package does not have type', () => {
    it('should not display package type', () => {
      component = renderPackageInformation({
        model: {
          packageType: null,
        },
      });
      expect(component.queryByTestId('package-details-type')).toBeNull();
    });
  });
});
