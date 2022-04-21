import {
  render,
  fireEvent,
} from '@testing-library/react';

import Harness from '../../../../test/jest/helpers/harness';

import UsageConsolidationAccordion from './usage-consolidation-accordion';

jest.mock('../usage-consolidation-content-title', () => () => (<div>UsageConsolidationContentTitle component</div>));
jest.mock('../usage-consolidation-content-resource', () => () => (<div>UsageConsolidationContentResource component</div>));

const costPerUseData = {
  data: {
    packageCostPerUse: {
      attributes: {
        analysis: {
          cost: 10,
          costPerUse: 10,
          usage: 10,
        },
      },
    },
    platformType: 'all',
  },
  errors: [],
  isFailed: false,
  isLoaded: true,
  isLoading: false,
  isPackageTitlesFailed: false,
  isPackageTitlesLoaded: false,
  isPackageTitlesLoading: false,
};

const usageConsolidation = {
  data: {
    credentialsId: 'credentials-id',
    currency: 'currency',
    customerKey: 'customer-key',
    platformType: 'platform-type',
    startMonth: 'January',
  },
  errors: [],
  isFailed: false,
  isKeyFailed: false,
  isKeyLoaded: false,
  isKeyLoading: false,
  isLoaded: true,
  isLoading: false,
};

const renderUsageConsolidationAccordion = (props = {}) => render(
  <Harness>
    <UsageConsolidationAccordion
      costPerUseData={costPerUseData}
      getUsageConsolidation={() => {}}
      id="test-id"
      isOpen
      onFilterSubmit={() => {}}
      onToggle={() => {}}
      onViewTitles={() => {}}
      recordName="record-name"
      recordType="package"
      usageConsolidation={usageConsolidation}
      {...props}
    />
  </Harness>
);

describe('Given UsageConsolidationAccordion', () => {
  const mockOnFilterSubmit = jest.fn();
  const mockOnToggle = jest.fn();
  const mockOnViewTitles = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render UsageConsolidationAccordion', () => {
    const { getByTestId } = renderUsageConsolidationAccordion();

    expect(getByTestId('usage-consolidation-accordion')).toBeDefined();
  });

  it('should display accordion headline', () => {
    const { getByText } = renderUsageConsolidationAccordion();

    expect(getByText('ui-eholdings.usageConsolidation')).toBeDefined();
  });

  describe('when click on accordion headline', () => {
    it('should handle onToggle', () => {
      const { getByText } = renderUsageConsolidationAccordion({
        onToggle: mockOnToggle,
      });

      fireEvent.click(getByText('ui-eholdings.usageConsolidation'));

      expect(mockOnToggle).toBeCalled();
    });
  });

  it('should display info popover button in the header', () => {
    const { getByTestId } = renderUsageConsolidationAccordion();

    expect(getByTestId('usage-consolidation-header-info-popover')).toBeDefined();
  });

  describe('when click on info popover button in the header', () => {
    it('should not handle onToggle', () => {
      const { getByTestId } = renderUsageConsolidationAccordion({
        onToggle: mockOnToggle,
      });

      fireEvent.click(getByTestId('usage-consolidation-header-info-popover'));

      expect(mockOnToggle).not.toBeCalled();
    });
  });

  it('should display usage condolidation filters', () => {
    const { getByText } = renderUsageConsolidationAccordion();

    expect(getByText('ui-eholdings.usageConsolidation.filters.year')).toBeDefined();
    expect(getByText('ui-eholdings.usageConsolidation.filters.platformType')).toBeDefined();
  });

  describe('when click on View button under filters', () => {
    it('should handle onFilterSubmit', () => {
      const { getByRole } = renderUsageConsolidationAccordion({
        onFilterSubmit: mockOnFilterSubmit,
      });

      fireEvent.click(getByRole('button', { name: 'ui-eholdings.usageConsolidation.filters.view' }));

      expect(mockOnFilterSubmit).toBeCalled();
    });
  });

  describe('when isOpen set to false', () => {
    it('should not display usage condolidation filters', () => {
      const { queryByText } = renderUsageConsolidationAccordion({
        isOpen: false,
      });

      expect(queryByText('ui-eholdings.usageConsolidation.filters.year')).toBeNull();
      expect(queryByText('ui-eholdings.usageConsolidation.filters.platformType')).toBeNull();
    });
  });

  describe('when record type is package', () => {
    it('should display table columns titles', () => {
      const { getByText } = renderUsageConsolidationAccordion();

      expect(getByText('ui-eholdings.usageConsolidation.summary.packageCost')).toBeDefined();
      expect(getByText('ui-eholdings.usageConsolidation.summary.totalUsage')).toBeDefined();
      expect(getByText('ui-eholdings.usageConsolidation.summary.costPerUse')).toBeDefined();
    });
  });

  describe('when record type is title', () => {
    it('should render UsageConsolidationContentTitle component', () => {
      const { getByText } = renderUsageConsolidationAccordion({
        recordType: 'title',
      });

      expect(getByText('UsageConsolidationContentTitle component')).toBeDefined();
    });
  });

  describe('when record type is resource', () => {
    it('should render UsageConsolidationContentTitle component', () => {
      const { getByText } = renderUsageConsolidationAccordion({
        recordType: 'resource',
      });

      expect(getByText('UsageConsolidationContentResource component')).toBeDefined();
    });
  });

  describe('when record type is not package/title/resource', () => {
    it('should not render content', () => {
      const { queryByText } = renderUsageConsolidationAccordion({
        recordType: 'non-existing',
      });

      expect(queryByText('ui-eholdings.usageConsolidation.summary.packageCost')).toBeNull();
      expect(queryByText('ui-eholdings.usageConsolidation.summary.totalUsage')).toBeNull();
      expect(queryByText('ui-eholdings.usageConsolidation.summary.costPerUse')).toBeNull();

      expect(queryByText('UsageConsolidationContentTitle component')).toBeNull();
      expect(queryByText('UsageConsolidationContentResource component')).toBeNull();
    });
  });

  it('should display Actions button', () => {
    const { getByRole } = renderUsageConsolidationAccordion();

    expect(getByRole('button', { name: 'ui-eholdings.usageConsolidation.summary.actions' })).toBeDefined();
  });

  describe('when click on Actions button', () => {
    it('should display View and Export options', () => {
      const { getByRole } = renderUsageConsolidationAccordion();

      fireEvent.click(getByRole('button', { name: 'ui-eholdings.usageConsolidation.summary.actions' }));

      expect(getByRole('menuitem', { name: 'ui-eholdings.usageConsolidation.summary.actions.view' })).toBeDefined();
      expect(getByRole('menuitem', { name: 'ui-eholdings.usageConsolidation.summary.actions.export' })).toBeDefined();
    });

    describe('when click on View option', () => {
      it('should handle onViewTitles', () => {
        const { getByRole } = renderUsageConsolidationAccordion({
          onViewTitles: mockOnViewTitles,
        });

        fireEvent.click(getByRole('button', { name: 'ui-eholdings.usageConsolidation.summary.actions' }));
        fireEvent.click(getByRole('menuitem', { name: 'ui-eholdings.usageConsolidation.summary.actions.view' }));

        expect(mockOnViewTitles).toBeCalled();
      });
    });
  });

  describe('when there are usageConsolidation errors', () => {
    it('should display error toast message', () => {
      const { getByText } = renderUsageConsolidationAccordion({
        usageConsolidation: {
          ...usageConsolidation,
          errors: [{ title: 'Usage consolidation error' }],
        },
      });

      expect(getByText('Usage consolidation error')).toBeDefined();
    });
  });

  describe('when costPerUseData is not loaded and is not failed', () => {
    it('should not render content', () => {
      const { queryByText } = renderUsageConsolidationAccordion({
        costPerUseData: {
          ...costPerUseData,
          isLoaded: false,
        },
      });

      expect(queryByText('ui-eholdings.usageConsolidation.summary.packageCost')).toBeNull();
      expect(queryByText('ui-eholdings.usageConsolidation.summary.totalUsage')).toBeNull();
      expect(queryByText('ui-eholdings.usageConsolidation.summary.costPerUse')).toBeNull();

      expect(queryByText('UsageConsolidationContentTitle component')).toBeNull();
      expect(queryByText('UsageConsolidationContentResource component')).toBeNull();
    });
  });

  describe('when costPerUseData is failed', () => {
    it('should display an error message', () => {
      const { getByText } = renderUsageConsolidationAccordion({
        costPerUseData: {
          ...costPerUseData,
          isFailed: true,
        },
      });

      expect(getByText('ui-eholdings.usageConsolidation.summary.error')).toBeDefined();
    });
  });

  describe('when usageConsolidation is failed', () => {
    it('should not render usage consolidation accordion', () => {
      const { queryByTestId } = renderUsageConsolidationAccordion({
        usageConsolidation: {
          ...usageConsolidation,
          isFailed: true,
        },
      });

      expect(queryByTestId('usage-consolidation-accordion')).toBeNull();
    });
  });

  describe('when usageConsolidation data credentialsId is not provided', () => {
    it('should not render usage consolidation accordion', () => {
      const { queryByTestId } = renderUsageConsolidationAccordion({
        usageConsolidation: {
          ...usageConsolidation,
          data: {},
        },
      });

      expect(queryByTestId('usage-consolidation-accordion')).toBeNull();
    });
  });

  describe('when costPerUseData is loading', () => {
    it('should render spinner', () => {
      const { container } = renderUsageConsolidationAccordion({
        costPerUseData: {
          ...costPerUseData,
          isLoading: true,
        },
      });

      expect(container.querySelector('.icon-spinner-ellipsis')).toBeDefined();
    });
  });
});
