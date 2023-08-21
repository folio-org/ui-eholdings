import {
  render,
  fireEvent,
} from '@folio/jest-config-stripes/testing-library/react';

import Harness from '../../../test/jest/helpers/harness';

import ProviderListItem from './provider-list-item';

const testPropsWithoutItem = {
  link: 'test-link-url',
};

const testBasicProps = {
  ...testPropsWithoutItem,
  item: {
    name: 'test-provider-name',
    packagesSelected: 10,
    totalPackages: 100,
  },
};

describe('Given ProviderListItem', () => {
  const mockOnClick = jest.fn();

  const renderProviderListItem = ({ ...props }) => render(
    <Harness>
      <ProviderListItem {...props} />
    </Harness>
  );

  it('should render skeleton when item is not provided', () => {
    const { getByTestId } = renderProviderListItem(testPropsWithoutItem);

    expect(getByTestId('skeleton-element')).toBeDefined();
  });

  it('should render ProviderListItem link', () => {
    const { getByTestId } = renderProviderListItem(testBasicProps);

    expect(getByTestId('provider-list-item-link')).toBeDefined();
  });

  it('should display provider name', () => {
    const { getByText } = renderProviderListItem(testBasicProps);

    expect(getByText('test-provider-name')).toBeDefined();
  });

  it('should display selected count', () => {
    const { getByText } = renderProviderListItem(testBasicProps);

    expect(getByText('ui-eholdings.selectedCount')).toBeDefined();
  });

  it('should display total packages count', () => {
    const { getByText } = renderProviderListItem(testBasicProps);

    expect(getByText('ui-eholdings.label.totalPackages')).toBeDefined();
  });

  it('should not invoke onClick callback', () => {
    const { getByRole } = renderProviderListItem(testBasicProps);

    fireEvent.click(getByRole('link', { name: /test-provider-name/ }));

    expect(mockOnClick).not.toBeCalled();
  });

  it('should invoke onClick callback', () => {
    const testPropsWithOnClick = {
      ...testBasicProps,
      onClick: mockOnClick,
    };

    const { getByRole } = renderProviderListItem(testPropsWithOnClick);

    fireEvent.click(getByRole('link', { name: /test-provider-name/ }));

    expect(mockOnClick).toBeCalled();
  });
});
