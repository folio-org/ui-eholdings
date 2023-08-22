import {
  render,
  cleanup,
} from '@folio/jest-config-stripes/testing-library/react';

import IntlProvider from '../../../../../../test/jest/helpers/intl';

import CoverageSettings from './coverage-settings';

describe('Given CoverageSettings', () => {
  let component;
  const onToggleMock = jest.fn();

  const renderCoverageSettings = (props = {}) => render(
    <IntlProvider>
      <CoverageSettings
        isOpen
        onToggle={onToggleMock}
        packageSelected
        customCoverage={{
          beginCoverage: '2021-01-01',
          endCoverage: '2021-01-31',
        }}
        {...props}
      />
    </IntlProvider>
  );

  afterEach(() => {
    cleanup();
    onToggleMock.mockClear();
  });

  it('should render an accordion', () => {
    component = renderCoverageSettings();
    expect(component.getByText('ui-eholdings.package.coverageSettings')).toBeDefined();
  });

  describe('when package is not selected', () => {
    it('should display "package not selected" message', () => {
      component = renderCoverageSettings({
        packageSelected: false,
      });

      expect(component.getByText('ui-eholdings.package.customCoverage.notSelected')).toBeDefined();
    });
  });

  describe('when package does not have a coverage', () => {
    it('should display "coverage not set" message', () => {
      component = renderCoverageSettings({
        customCoverage: {},
      });

      expect(component.getByText('ui-eholdings.package.customCoverage.notSet')).toBeDefined();
    });
  });

  describe('when package only has begin coverage', () => {
    it('should show correctly formatted coverage', () => {
      component = renderCoverageSettings({
        customCoverage: {
          beginCoverage: '2021-01-01',
        },
      });

      expect(component.getByText('1/1/2021 - ui-eholdings.date.present')).toBeDefined();
    });
  });

  describe('when package only has begin and end coverage', () => {
    it('should show correctly formatted coverage', () => {
      component = renderCoverageSettings();

      expect(component.getByText('1/1/2021 - 1/31/2021')).toBeDefined();
    });
  });
});
