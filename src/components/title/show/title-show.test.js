import {
  fireEvent,
  render,
} from '@testing-library/react';

import { createMemoryHistory } from 'history';
import noop from 'lodash/noop';

import Harness from '../../../../test/jest/helpers/harness';

import TitleShow from './title-show';

const history = createMemoryHistory();
const historyReplaceSpy = jest.spyOn(history, 'replace');

jest.mock('../../scroll-view', () => () => (<div>ScrollView component</div>));
jest.mock('../../../features/usage-consolidation-accordion', () => () => (<div>UsageConsolidationAccordion component</div>));
jest.mock('../_field-groups/add-title-to-package', () => () => (<div>AddTitleToPackage component</div>));
jest.mock('@folio/stripes/smart-components', () => ({
  NotesSmartAccordion: jest.fn(() => <div>NotesSmartAccordion component</div>),
}));

const mapMock = jest.fn();

const testCostPerUse = {
  data: {
    attributes: {
      analysis: {
        cost: 123,
        costPerUse: 456,
        usage: 789,
      },
      parameters: {
        currency: '',
        startMonth: '',
      },
    },
    id: 'testCostPerUse-data-id',
    type: 'testCostPerUse-data-type',
  },
  errors: [],
  isFailed: false,
  isLoaded: false,
  isLoading: false,
};

const testModel = {
  id: 'model-id',
  name: 'model-name',
  edition: 'model-edition',
  publisherName: 'model-publisher',
  publicationType: 'Book',
  isPeerReviewed: false,
  isTitleCustom: false,
  description: 'model-description',
  isLoaded: true,
  isLoading: false,
  contributors: [
    {
      contributor: 'Jane Doe',
      type: 'author',
    },
  ],
  resources: {
    records: [],
  },
  hasSelectedResources: true,
  identifiers: [
    {
      id: 'identifier-id',
      type: 'ISBN',
      subtype: 'Online',
    },
  ],
  subjects: [
    {
      subject: 'model-subject',
      type: 'model-subject-type',
    },
  ],
  update: {
    errors: [],
    isPending: false,
    isRejected: false,
    isResolved: false,
  },
  request: {
    errors: [],
    isPending: false,
    isRejected: false,
    isResolved: false,
  },
  destroy: {
    errors: [],
    isPending: false,
    isRejected: false,
    isResolved: false,
  },
};

const testModelExtended = {
  ...testModel,
  resources: {
    records: [
      {
        id: 'package-id1',
        packageName: 'package-name1',
        isSelected: true,
      },
      {
        id: 'package-id2',
        packageName: 'package-name2',
        isSelected: false,
      }
    ],
    length: 2,
    map: mapMock,
  },
};

const testRequest = {
  errors: [],
  isPending: false,
  isRejected: false,
  isResolved: false,
};

const renderTitleShow = (props = {}) => render(
  <Harness history={history}>
    <TitleShow
      addCustomPackage={noop}
      costPerUse={testCostPerUse}
      customPackages={{
        map: mapMock,
      }}
      fetchTitleCostPerUse={noop}
      model={testModel}
      onEdit={noop}
      request={testRequest}
      {...props}
    />
  </Harness>
);

describe('Given TitleShow', () => {
  it('should display title name in the pane and in the headline', () => {
    const { getAllByText } = renderTitleShow();

    expect(getAllByText('model-name')).toHaveLength(2);
  });

  it('should display `Collapse all` button', () => {
    const { getByRole } = renderTitleShow();

    expect(getByRole('button', { name: 'stripes-components.collapseAll' })).toBeDefined();
  });

  describe('when all sections are collapsed', () => {
    it('should all be expanded after click on the `Expand all` button', () => {
      const { getByRole } = renderTitleShow();

      fireEvent.click(getByRole('button', {
        name: 'ui-eholdings.title.titleInformation',
        expanded: true,
      }));
      fireEvent.click(getByRole('button', {
        name: 'ui-eholdings.listType.packages',
        expanded: true,
      }));

      fireEvent.click(getByRole('button', { name: 'stripes-components.expandAll' }));

      expect(getByRole('button', {
        name: 'ui-eholdings.title.titleInformation',
        expanded: true,
      })).toBeDefined();
      expect(getByRole('button', {
        name: 'ui-eholdings.listType.packages',
        expanded: true,
      })).toBeDefined();
    });
  });

  describe('title information accordion', () => {
    it('should be rendered', () => {
      const { getByText } = renderTitleShow();

      expect(getByText('ui-eholdings.title.titleInformation')).toBeDefined();
    });

    it('should display title author', () => {
      const { getByText } = renderTitleShow();

      expect(getByText('ui-eholdings.contributorType.author')).toBeDefined();
      expect(getByText('Jane Doe')).toBeDefined();
    });

    it('should display title edition', () => {
      const { getByText } = renderTitleShow();

      expect(getByText('ui-eholdings.title.edition')).toBeDefined();
      expect(getByText('model-edition')).toBeDefined();
    });

    it('should display title publisher', () => {
      const { getByText } = renderTitleShow();

      expect(getByText('ui-eholdings.title.publisherName')).toBeDefined();
      expect(getByText('model-publisher')).toBeDefined();
    });

    it('should display title publication type', () => {
      const { getByText } = renderTitleShow();

      expect(getByText('ui-eholdings.title.publicationType')).toBeDefined();
      expect(getByText('Book')).toBeDefined();
    });

    it('should display title identifiers list', () => {
      const { getByText } = renderTitleShow();

      expect(getByText('ISBN (Online)')).toBeDefined();
      expect(getByText('identifier-id')).toBeDefined();
    });

    it('should display title subjects', () => {
      const { getByText } = renderTitleShow();

      expect(getByText('ui-eholdings.title.subjects')).toBeDefined();
      expect(getByText('model-subject')).toBeDefined();
    });

    it('should display `No` for title peer reviewed', () => {
      const { getByText } = renderTitleShow();

      expect(getByText('ui-eholdings.title.peerReviewed')).toBeDefined();
      expect(getByText('ui-eholdings.no')).toBeDefined();
    });

    it('should display `Yes` for title peer reviewed', () => {
      const { getByText } = renderTitleShow({
        model: {
          ...testModel,
          isPeerReviewed: true,
        },
      });

      expect(getByText('ui-eholdings.title.peerReviewed')).toBeDefined();
      expect(getByText('ui-eholdings.yes')).toBeDefined();
    });

    it('should display `Managed` for title type', () => {
      const { getByText } = renderTitleShow();

      expect(getByText('ui-eholdings.title.titleType')).toBeDefined();
      expect(getByText('ui-eholdings.managed')).toBeDefined();
    });

    it('should display `Custom` for title type', () => {
      const { getByText } = renderTitleShow({
        model: {
          ...testModel,
          isTitleCustom: true,
        },
      });

      expect(getByText('ui-eholdings.title.titleType')).toBeDefined();
      expect(getByText('ui-eholdings.custom')).toBeDefined();
    });

    it('should render `Add to custom package` button', () => {
      const { getByRole } = renderTitleShow();

      expect(getByRole('button', { name: 'ui-eholdings.title.addToCustomPackage' })).toBeDefined();
    });

    it('should be collapsed after click on the heading', () => {
      const { getByRole } = renderTitleShow();

      fireEvent.click(getByRole('button', {
        name: 'ui-eholdings.title.titleInformation',
        expanded: true,
      }));

      expect(getByRole('button', {
        name: 'ui-eholdings.title.titleInformation',
        expanded: false,
      })).toBeDefined();
    });

    describe('add title to custom package modal window', () => {
      it('should be called when clicked on the `Add to custom package` button', () => {
        const { getByText } = renderTitleShow({
          model: testModelExtended,
        });

        fireEvent.click(getByText('ui-eholdings.title.addToCustomPackage'));

        expect(getByText('ui-eholdings.title.modalMessage.addTitleToCustomPackage')).toBeDefined();
      });

      it('should display AddTitleToPackage component', () => {
        const { getByText } = renderTitleShow({
          model: testModelExtended,
        });

        fireEvent.click(getByText('ui-eholdings.title.addToCustomPackage'));

        expect(getByText('AddTitleToPackage component')).toBeDefined();
      });

      it('should display Cancel button', () => {
        const { getByText, getByRole } = renderTitleShow({
          model: testModelExtended,
        });

        fireEvent.click(getByText('ui-eholdings.title.addToCustomPackage'));

        expect(getByRole('button', { name: 'ui-eholdings.cancel' })).toBeDefined();
      });

      it('should display Submit button', () => {
        const { getByText, getByRole } = renderTitleShow({
          model: testModelExtended,
        });

        fireEvent.click(getByText('ui-eholdings.title.addToCustomPackage'));

        expect(getByRole('button', { name: 'ui-eholdings.submit' })).toBeDefined();
      });

      it('should display Saving button', () => {
        const { getByText, getByRole } = renderTitleShow({
          model: testModelExtended,
          request: {
            ...testRequest,
            isPending: true,
          },
        });

        fireEvent.click(getByText('ui-eholdings.title.addToCustomPackage'));

        expect(getByRole('button', { name: 'ui-eholdings.saving' })).toBeDefined();
      });
    });
  });

  it('should render NotesSmartAccordion component', () => {
    const { getByText } = renderTitleShow();

    expect(getByText('NotesSmartAccordion component')).toBeDefined();
  });

  it('should render UsageConsolidationAccordion component', () => {
    const { getByText } = renderTitleShow();

    expect(getByText('UsageConsolidationAccordion component')).toBeDefined();
  });

  describe('packages accordion', () => {
    it('should be rendered', () => {
      const { getByText } = renderTitleShow();

      expect(getByText('ui-eholdings.listType.packages')).toBeDefined();
    });

    it('should not display packages', () => {
      const { getByText } = renderTitleShow();

      expect(getByText('ui-eholdings.notFound')).toBeDefined();
    });

    it('should display number of packages', () => {
      const { getByText } = renderTitleShow({
        model: testModelExtended,
      });

      expect(getByText('ui-eholdings.label.accordionList')).toBeDefined();
      expect(getByText('2')).toBeDefined();
    });

    it('should render ScrollView component', () => {
      const { getByText } = renderTitleShow({
        model: testModelExtended,
      });

      expect(getByText('ScrollView component')).toBeDefined();
    });

    describe('filter packages modal window', () => {
      it('should be called when click on the Filter packages button', () => {
        const { getByLabelText, getByText } = renderTitleShow({
          model: testModelExtended,
        });

        fireEvent.click(getByLabelText('ui-eholdings.filter.togglePane'));

        expect(getByText('ui-eholdings.filter.filterType.packages')).toBeDefined();
      });

      it('should filter packages when click on the Search button', () => {
        const { getByLabelText, getByText } = renderTitleShow({
          model: testModelExtended,
        });

        fireEvent.click(getByLabelText('ui-eholdings.filter.togglePane'));
        fireEvent.click(getByText('ui-eholdings.selected'));
        fireEvent.click(getByText('ui-eholdings.filter.search'));

        expect(historyReplaceSpy).toBeCalled();
      });
    });
  });

  describe('when coming from creating a new custom package', () => {
    it('should show a corresponding success toast', () => {
      const { getByText } = renderTitleShow({
        isNewRecord: true,
      });

      expect(getByText('ui-eholdings.title.toast.isNewRecord')).toBeDefined();
    });
  });

  describe('when coming from saving edits to the package', () => {
    it('should show a corresponding success toast', () => {
      const { getByText } = renderTitleShow({
        isFreshlySaved: true,
      });

      expect(getByText('ui-eholdings.title.toast.isFreshlySaved')).toBeDefined();
    });
  });
});
