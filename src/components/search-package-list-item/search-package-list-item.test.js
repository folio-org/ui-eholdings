import {
  screen,
  render,
  fireEvent
} from '@folio/jest-config-stripes/testing-library/react';

import { Router } from 'react-router';
import { createMemoryHistory } from 'history';

import SearchPackageListItem from './search-package-list-item';

jest.mock('../tags-label', () => () => (<div>TagsLabel component</div>));
jest.mock('../hidden-label', () => () => (<div>HiddenLabel component</div>));

const routerHistory = createMemoryHistory();

const testTags = ['first', 'second', 'third'];

const testPropsWithoutItem = {
  link: 'test-link-url',
};

const testBasicProps = {
  ...testPropsWithoutItem,
  item: {
    name: 'test-package-name',
    providerName: 'test-provider-name',
    isSelected: true,
    titleCount: 1,
    visibilityData: {
      isHidden: false,
    },
    tags: {
      tagList: testTags,
    },
  },
};

const testFullProps = {
  ...testBasicProps,
  item: {
    ...testBasicProps.item,
    visibilityData: {
      isHidden: true,
    }
  },
  showProviderName: true,
  showTitleCount: true,
  showTags: true,
};

describe('Given SearchPackageListItem', () => {
  const mockOnClick = jest.fn();

  const renderSearchPackageListItem = ({ ...props }) => render(
    <Router history={routerHistory}>
      <SearchPackageListItem {...props} />
    </Router>
  );

  it('should render skeleton when item is not provided', () => {
    const { getByTestId } = renderSearchPackageListItem(testPropsWithoutItem);

    expect(getByTestId('skeleton-element')).toBeDefined();
  });

  it('should render SearchPackageListItem link', () => {
    const { getByTestId } = renderSearchPackageListItem(testBasicProps);

    expect(getByTestId('search-package-list-item-link')).toBeDefined();
  });

  it('should not invoke onClick callback', () => {
    renderSearchPackageListItem(testBasicProps);
    fireEvent.click(screen.getByRole('link', { name: /test-package-name/ }));

    expect(mockOnClick).not.toBeCalled();
  });

  it('should invoke onClick callback', () => {
    const testPropsWithOnClick = {
      ...testBasicProps,
      onClick: mockOnClick,
    };

    renderSearchPackageListItem(testPropsWithOnClick);

    fireEvent.click(screen.getByRole('link', { name: /test-package-name/ }));

    expect(mockOnClick).toBeCalled();
  });

  it('should display provider name', () => {
    const { getByText } = renderSearchPackageListItem(testFullProps);

    expect(getByText('test-provider-name')).toBeDefined();
  });

  it('should display title count', () => {
    const { getByText } = renderSearchPackageListItem(testFullProps);

    expect(getByText('ui-eholdings.label.totalTitles')).toBeDefined();
  });

  it('should render HiddenLabel component', () => {
    const { getByText } = renderSearchPackageListItem(testFullProps);

    expect(getByText('HiddenLabel component')).toBeDefined();
  });

  it('should render TagsLabel component', () => {
    const { getByText } = renderSearchPackageListItem(testFullProps);

    expect(getByText('TagsLabel component')).toBeDefined();
  });
});
