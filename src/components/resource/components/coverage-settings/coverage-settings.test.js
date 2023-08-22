import {
  render,
  cleanup,
} from '@folio/jest-config-stripes/testing-library/react';

import Harness from '../../../../../test/jest/helpers/harness';

import CoverageSettings from './coverage-settings';

jest.mock('../../../coverage-date-list', () => ({
  isManagedCoverage,
}) => (
  <div>Coverage date list {isManagedCoverage ? 'managed' : 'custom'}</div>
));

describe('Given CoverageSettings', () => {
  let component;
  const onToggleMock = jest.fn();
  const defaultModel = {
    managedCoverages: [{
      beginCoverage: '2021-01-01',
      endCoverage: '2021-01-31',
    }],
    customCoverages: [{
      beginCoverage: '2021-01-01',
      endCoverage: '2021-01-31',
    }],
    managedEmbargoPeriod: {
      embargoUnit: 'day',
      embargoValue: '1',
    },
    customEmbargoPeriod: {
      embargoUnit: 'month',
      embargoValue: '1',
    },
    coverageStatement: 'coverage statement',
    publicationType: 'book',
  };

  const renderCoverageSettings = (props = {}) => render(
    <Harness>
      <CoverageSettings
        isOpen
        onToggle={onToggleMock}
        model={defaultModel}
        resourceSelected
        {...props}
      />
    </Harness>
  );

  afterEach(() => {
    cleanup();
    onToggleMock.mockClear();
  });

  it('should render an accordion', () => {
    component = renderCoverageSettings();

    expect(component.getByText('ui-eholdings.label.coverageSettings')).toBeDefined();
  });

  describe('when resource only has managed coverages', () => {
    it('should render only managed coverages', () => {
      component = renderCoverageSettings({
        model: {
          ...defaultModel,
          customCoverages: [],
        },
      });
      expect(component.getByText('Coverage date list managed'));
    });
  });

  describe('when resource has custom coverages', () => {
    it('should render only custom coverages', () => {
      component = renderCoverageSettings();
      expect(component.getByText('Coverage date list custom'));
    });
  });

  it('should render coverage statement', () => {
    component = renderCoverageSettings();
    expect(component.getByText('coverage statement')).toBeDefined();
  });

  describe('when resource has only managed embargo', () => {
    it('should render only managed embargo', () => {
      component = renderCoverageSettings({
        model: {
          ...defaultModel,
          customEmbargoPeriod: null,
        },
      });
      expect(component.getByText('ui-eholdings.resource.embargoUnit.day')).toBeDefined();
    });
  });

  describe('when resource custom embargo', () => {
    it('should render custom embargo', () => {
      component = renderCoverageSettings();
      expect(component.getByText('ui-eholdings.resource.embargoUnit.month')).toBeDefined();
    });
  });

  describe('when resource oes not have any customizations', () => {
    it('should render no customizations message', () => {
      component = renderCoverageSettings({
        model: {
          ...defaultModel,
          managedCoverages: [],
          customCoverages: [],
          coverageStatement: null,
          managedEmbargoPeriod: null,
          customEmbargoPeriod: null,
        },
      });
      expect(component.getByText('ui-eholdings.resource.coverage.noCustomizations')).toBeDefined();
    });
  });

  describe('when resource is not selected and does not have managed customizations', () => {
    it('should render not selected message', () => {
      component = renderCoverageSettings({
        model: {
          ...defaultModel,
          managedCoverages: [],
          managedEmbargoPeriod: null,
        },
        resourceSelected: false,
      });
      expect(component.getByText('ui-eholdings.resource.coverage.notSelected')).toBeDefined();
    });
  });
});
