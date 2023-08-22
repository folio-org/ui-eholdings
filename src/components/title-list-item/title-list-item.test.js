import {
  screen,
  render,
  fireEvent,
} from '@folio/jest-config-stripes/testing-library/react';

import Harness from '../../../test/jest/helpers/harness';

import TitleListItem from './title-list-item';

jest.mock('../identifiers-list', () => () => (<div>IdentifiersList component</div>));
jest.mock('../selected-label/selected-label', () => () => (<div>SelectedLabel component</div>));
jest.mock('../tags-label', () => () => (<div>TagsLabel component</div>));
jest.mock('../hidden-label', () => () => (<div>HiddenLabel component</div>));

const testTags = ['first', 'second', 'third'];

const testPropsWithoutItem = {
  link: 'test-link-url',
};

const testBasicProps = {
  ...testPropsWithoutItem,
  item: {
    contributors: [
      {
        type: 'test-contributor-type',
        contributor: 'test-contributor-name',
      },
    ],
    identifiers: [
      {
        id: 'test-id',
        subtype: 'test-subtype',
        type: 'test-type',
      },
    ],
    isSelected: false,
    name: 'test-name',
    tags: {
      tagList: testTags,
    },
    visibilityData: {
      isHidden: false,
    },
  },
};

const testExtendedProps = {
  ...testBasicProps,
  showContributors: true,
  showIdentifiers: true,
  showPublisherAndType: true,
  showSelected: true,
};

const testPropsWithExtendedItem = {
  ...testExtendedProps,
  item: {
    ...testExtendedProps.item,
    publicationType: 'test-publication-type',
    publisherName: 'test-publisher-name',
    visibilityData: {
      isHidden: true,
    },
  },
};

describe('Given TitleListItem', () => {
  const mockOnClick = jest.fn();

  const renderTitleListItem = ({ ...props }) => render(
    <Harness>
      <TitleListItem {...props} />
    </Harness>
  );

  it('should render skeleton when item prop is not provided', () => {
    const { getByTestId } = renderTitleListItem(testPropsWithoutItem);

    expect(getByTestId('skeleton-element')).toBeDefined();
  });

  it('should render TitleListItem link', () => {
    const { getByTestId } = renderTitleListItem(testBasicProps);

    expect(getByTestId('title-list-item-link')).toBeDefined();
  });

  it('should render TitleListItem headline', () => {
    const { getByText } = renderTitleListItem(testBasicProps);

    expect(getByText('test-name')).toBeDefined();
  });

  it('should not invoke onClick callback', () => {
    renderTitleListItem(testBasicProps);

    fireEvent.click(screen.getByRole('link', { name: /test-name/ }));

    expect(mockOnClick).not.toBeCalled();
  });

  it('should invoke onClick callback', () => {
    const testPropsWithOnClick = {
      ...testBasicProps,
      onClick: mockOnClick,
    };

    renderTitleListItem(testPropsWithOnClick);

    fireEvent.click(screen.getByRole('link', { name: /test-name/ }));

    expect(mockOnClick).toBeCalled();
  });

  it('should display publication type and publisher name', () => {
    const { getByText } = renderTitleListItem(testPropsWithExtendedItem);

    expect(getByText('test-publication-type')).toBeDefined();
    expect(getByText('test-publisher-name')).toBeDefined();
  });

  it('should display contributors', () => {
    const { getByText } = renderTitleListItem(testExtendedProps);

    expect(getByText('test-contributor-name')).toBeDefined();
  });

  it('should display identifiers', () => {
    const { getByText } = renderTitleListItem(testExtendedProps);

    expect(getByText('IdentifiersList component')).toBeDefined();
  });

  it('should display selected and tags labels', () => {
    const { getByText } = renderTitleListItem(testExtendedProps);

    expect(getByText('SelectedLabel component')).toBeDefined();
    expect(getByText('TagsLabel component')).toBeDefined();
  });

  it('should not display hidden label', () => {
    const { queryByText } = renderTitleListItem(testExtendedProps);

    expect(queryByText('HiddenLabel component')).toBeNull();
  });

  it('should display hidden label', () => {
    const { getByText } = renderTitleListItem(testPropsWithExtendedItem);

    expect(getByText('HiddenLabel component')).toBeDefined();
  });
});
