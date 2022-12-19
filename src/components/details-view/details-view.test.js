import {
  render,
  fireEvent,
} from '@testing-library/react';

import { createMemoryHistory } from 'history';

import Harness from '../../../test/jest/helpers/harness';

import DetailsView from './details-view';

const history = createMemoryHistory();
const historyPushSpy = jest.spyOn(history, 'push');

const location = {
  pathname: 'pathname',
  search: '',
  hash: '',
};

const model = {
  isLoaded: true,
  isLoading: false,
  name: 'Name',
  request: {
    errors: [],
    isPending: false,
    isRejected: false,
    isResolved: true,
  },
};

const getDetailView = props => (
  <Harness>
    <DetailsView
      bodyContent={<div>Body content</div>}
      history={history}
      location={location}
      model={model}
      paneTitle={model.name}
      type="testtype"
      resultsLength={10000}
      accordionHeaderLoading={false}
      {...props}
    />
  </Harness>
);

const renderDetailsView = (props = {}) => render(
  getDetailView(props),
);

describe('Given DetailsView', () => {
  const mockRenderList = jest.fn();

  it('should render DetailsView component', () => {
    const { getByTestId } = renderDetailsView();

    expect(getByTestId('details-view-type-testtype')).toBeDefined();
  });

  it('should display the first menu pane', () => {
    const {
      getByRole,
      getByTestId,
    } = renderDetailsView();

    expect(getByRole('button', { name: 'ui-eholdings.label.icon.closeX' })).toBeDefined();
    expect(getByTestId('details-view-pane-title')).toBeDefined();
  });

  it('should display Name in the first menu pane and in the header', () => {
    const { getAllByRole } = renderDetailsView();

    expect(getAllByRole('heading', { name: 'Name' })).toHaveLength(2);
  });

  it('should display body content', () => {
    const { getByText } = renderDetailsView();

    expect(getByText('Body content')).toBeDefined();
  });

  describe('when renderList is provided', () => {
    it('should display list type accordion', () => {
      const { getByText } = renderDetailsView({
        renderList: mockRenderList,
        listType: 'testListType',
      });

      expect(getByText('ui-eholdings.listType.testListType')).toBeDefined();
    });

    describe('when sections are provided', () => {
      it('should handle renderList', () => {
        renderDetailsView({
          sections: { showTestSection: true },
          listSectionId: 'showTestSection',
          renderList: mockRenderList,
        });

        expect(mockRenderList).toBeCalled();
      });

      it('should display collapse all button', () => {
        const { getByRole } = renderDetailsView({
          sections: { showTestSection: true },
          listSectionId: 'showTestSection',
          renderList: mockRenderList,
        });

        expect(getByRole('button', { name: 'stripes-components.collapseAll' })).toBeDefined();
      });
    });
  });

  describe('when paneSub is provided', () => {
    it('should display paneSub', () => {
      const { getByText } = renderDetailsView({
        paneSub: 'Pane sub text',
      });

      expect(getByText('Pane sub text')).toBeDefined();
    });
  });

  describe('when component is rendered', () => {
    describe('when model is loaded', () => {
      it('should focus the heading', () => {
        const { getByTestId } = renderDetailsView();

        const heading = getByTestId('details-view-name-heading');

        expect(heading).toHaveFocus();
      });
    });
  });

  describe('when component updates', () => {
    describe('when model is loaded', () => {
      it('should focus the heading', () => {
        const {
          rerender,
          getByTestId,
        } = renderDetailsView({
          model: {
            ...model,
            isLoaded: false,
          },
        });

        rerender(
          getDetailView({
            model: {
              ...model,
              isLoaded: true,
            },
          }),
        );

        const heading = getByTestId('details-view-name-heading');

        expect(heading).toHaveFocus();
      });
    });
  });

  describe('when model was already loaded', () => {
    it('should not focus heading', () => {
      const {
        rerender,
        getByTestId,
      } = renderDetailsView();

      const heading = getByTestId('details-view-name-heading');

      expect(heading).toHaveFocus();

      fireEvent.blur(heading);

      rerender(
        getDetailView({
          model: {
            ...model,
            isLoaded: false,
          },
        }),
      );

      expect(heading).not.toHaveFocus();
    });
  });

  describe('when model is not loaded', () => {
    describe('when request is rejected', () => {
      it('should display an error', () => {
        const {
          getByText,
        } = renderDetailsView({
          model: {
            ...model,
            isLoaded: false,
            request: {
              errors: [{ title: 'Error title' }],
              isRejected: true,
            },
          },
        });

        expect(getByText('Error title')).toBeDefined();
      });
    });

    describe('when request is not rejected', () => {
      it('should not display an error', () => {
        const {
          queryByText,
        } = renderDetailsView({
          model: {
            ...model,
            isLoaded: false,
            request: {
              errors: [{ title: 'Error title' }],
            },
          },
        });

        expect(queryByText('Error title')).toBeDefined();
      });
    });
  });

  describe('when click on the close icon in the first menu pane', () => {
    it('should navigate to the Eholdings search page', () => {
      const search = '?searchType=packages&q=b&offset=1&searchfield=title';
      const { getByRole } = renderDetailsView({
        location: {
          ...location,
          search,
        },
      });

      fireEvent.click(getByRole('button', { name: 'ui-eholdings.label.icon.closeX' }));

      expect(historyPushSpy).toHaveBeenCalledWith({
        pathname: '/eholdings',
        search,
      });
    });
  });
});
