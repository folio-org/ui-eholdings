import {
  render,
  screen,
  fireEvent,
} from '@folio/jest-config-stripes/testing-library/react';

import { ProviderPackageList } from './provider-package-list';
import { PROVIDER_PACKAGES_LIST_COLUMNS } from '../../../../../constants/list-columns';
import Harness from '../../../../../../test/jest/helpers/harness';

jest.mock('../../../../selected-label', () => ({ isSelected }) => (
  <div>{`SelectedLabel:${isSelected}`}</div>
));

jest.mock('../../../../coverage-date-list', () => ({ coverageArray }) => (
  <div>{`CoverageDateList:${JSON.stringify(coverageArray)}`}</div>
));

jest.mock('../../../../internal-link', () => ({ to, children, className }) => (
  <a href={to} className={className}>{children}</a>
));

const testProviderPackagesList = [
  {
    id: 'package-1',
    attributes: {
      name: 'First Package',
      isSelected: true,
      selecedCount: 5,
      titleCount: 10,
      contentType: 'Aggregated Full Text',
      customCoverage: {
        beginCoverage: '2021-01-01',
        endCoverage: '2021-12-31',
      },
      packageType: 'Complete',
      visibilityData: {
        isHidden: false,
      },
      tags: {
        tagList: ['tag-1', 'tag-2'],
      },
    },
  },
  {
    id: 'package-2',
    attributes: {
      name: 'Second Package',
      isSelected: false,
      selecedCount: 0,
      titleCount: 3,
      contentType: 'Abstract and Index',
      customCoverage: {
        beginCoverage: '2022-01-01',
        endCoverage: '2022-12-31',
      },
      packageType: 'Partial',
      visibilityData: {
        isHidden: true,
      },
      tags: {
        tagList: ['tag-3'],
      },
    },
  },
];

const visibleColumns = [
  PROVIDER_PACKAGES_LIST_COLUMNS.STATUS,
  PROVIDER_PACKAGES_LIST_COLUMNS.PACKAGE_NAME,
  PROVIDER_PACKAGES_LIST_COLUMNS.SELECTED_COUNT,
  PROVIDER_PACKAGES_LIST_COLUMNS.TITLES_COUNT,
  PROVIDER_PACKAGES_LIST_COLUMNS.CONTENT_TYPE,
  PROVIDER_PACKAGES_LIST_COLUMNS.CUSTOM_COVERAGE,
  PROVIDER_PACKAGES_LIST_COLUMNS.PACKAGE_TYPE,
  PROVIDER_PACKAGES_LIST_COLUMNS.TAGS,
];

describe('Given ProviderPackageList', () => {
  const renderProviderPackageList = (props = {}) => render(
    <Harness>
      <ProviderPackageList
        visibleColumns={visibleColumns}
        providerPackages={{
          data: testProviderPackagesList,
          page: 1,
          pageSize: 25,
          isLoading: false,
          totalResults: testProviderPackagesList.length,
          fetchNextPage: jest.fn(),
          fetchPreviousPage: jest.fn(),
        }}
        {...props}
      />
    </Harness>
  );

  it('should render the provider package list', () => {
    renderProviderPackageList();

    expect(document.getElementById('provider-package-list')).toBeInTheDocument();
  });

  it('should render column headers', () => {
    renderProviderPackageList();

    expect(screen.getByText('ui-eholdings.packagesList.status')).toBeInTheDocument();
    expect(screen.getByText('ui-eholdings.packagesList.name')).toBeInTheDocument();
    expect(screen.getByText('ui-eholdings.packagesList.selectedCount')).toBeInTheDocument();
    expect(screen.getByText('ui-eholdings.packagesList.titlesCount')).toBeInTheDocument();
    expect(screen.getByText('ui-eholdings.packagesList.contentType')).toBeInTheDocument();
    expect(screen.getByText('ui-eholdings.packagesList.customCoverage')).toBeInTheDocument();
    expect(screen.getByText('ui-eholdings.packagesList.packageType')).toBeInTheDocument();
    expect(screen.getByText('ui-eholdings.packagesList.tags')).toBeInTheDocument();
  });

  it('should render selected label for each package', () => {
    renderProviderPackageList();

    expect(screen.getByText('SelectedLabel:true')).toBeInTheDocument();
    expect(screen.getByText('SelectedLabel:false')).toBeInTheDocument();
  });

  it('should render package names as links to the provider package page', () => {
    renderProviderPackageList();

    const firstPackageLink = screen.getByRole('link', { name: 'First Package' });
    const secondPackageLink = screen.getByRole('link', { name: 'Second Package' });

    expect(firstPackageLink).toBeInTheDocument();
    expect(firstPackageLink).toHaveAttribute('href', '/eholdings/packages/package-1');
    expect(secondPackageLink).toBeInTheDocument();
    expect(secondPackageLink).toHaveAttribute('href', '/eholdings/packages/package-2');
  });

  it('should render selected counts', () => {
    renderProviderPackageList();

    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('should render titles counts', () => {
    renderProviderPackageList();

    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('should render content types', () => {
    renderProviderPackageList();

    expect(screen.getByText('Aggregated Full Text')).toBeInTheDocument();
    expect(screen.getByText('Abstract and Index')).toBeInTheDocument();
  });

  it('should render custom coverage for each package', () => {
    renderProviderPackageList();

    const [firstPackage, secondPackage] = testProviderPackagesList;

    expect(screen.getByText(
      `CoverageDateList:${JSON.stringify([firstPackage.attributes.customCoverage])}`
    )).toBeInTheDocument();
    expect(screen.getByText(
      `CoverageDateList:${JSON.stringify([secondPackage.attributes.customCoverage])}`
    )).toBeInTheDocument();
  });

  it('should render package types', () => {
    renderProviderPackageList();

    expect(screen.getByText('Complete')).toBeInTheDocument();
    expect(screen.getByText('Partial')).toBeInTheDocument();
  });

  it('should render tags joined by comma', () => {
    renderProviderPackageList();

    expect(screen.getByText('tag-1, tag-2')).toBeInTheDocument();
    expect(screen.getByText('tag-3')).toBeInTheDocument();
  });

  it('should render hidden icon only for hidden packages', () => {
    renderProviderPackageList();

    expect(screen.getAllByTestId('eye-closed')).toHaveLength(1);
  });

  describe('when the list is loading', () => {
    it('should not render the multi-column list', () => {
      renderProviderPackageList({
        providerPackages: {
          data: testProviderPackagesList,
          page: 1,
          pageSize: 25,
          isLoading: true,
          totalResults: testProviderPackagesList.length,
          fetchNextPage: jest.fn(),
          fetchPreviousPage: jest.fn(),
        },
      });

      expect(document.getElementById('provider-package-list')).not.toBeInTheDocument();
    });

    it('should render the loading spinner', () => {
      renderProviderPackageList({
        providerPackages: {
          data: testProviderPackagesList,
          page: 1,
          pageSize: 25,
          isLoading: true,
          totalResults: testProviderPackagesList.length,
          fetchNextPage: jest.fn(),
          fetchPreviousPage: jest.fn(),
        },
      });

      expect(screen.getByTestId('spinner-ellipsis')).toBeInTheDocument();
    });
  });

  describe('when clicking next pagination', () => {
    it('should call fetchNextPage ', () => {
      const fetchNextPage = jest.fn();

      renderProviderPackageList({
        providerPackages: {
          data: testProviderPackagesList,
          page: 1,
          pageSize: 25,
          isLoading: false,
          totalResults: 100,
          fetchNextPage,
          fetchPreviousPage: jest.fn(),
        },
      });

      fireEvent.click(screen.getByRole('button', { name: /next/i }));

      expect(fetchNextPage).toHaveBeenCalled();
    });
  });

  describe('when clicking previous pagination', () => {
    it('should call fetchPreviousPage', () => {
      const fetchPreviousPage = jest.fn();

      renderProviderPackageList({
        providerPackages: {
          data: testProviderPackagesList,
          page: 2,
          pageSize: 25,
          isLoading: false,
          totalResults: 100,
          fetchNextPage: jest.fn(),
          fetchPreviousPage,
        },
      });

      fireEvent.click(screen.getByRole('button', { name: /previous/i }));

      expect(fetchPreviousPage).toHaveBeenCalled();
    });
  });
});
