import { renderHook } from '@testing-library/react-hooks';
import usePackageFilterSelectOptions from './use-package-filter-select-options';

describe('usePackageFilterSelectOptions hook', () => {
  it('should automatically set selectedOptions once', () => {
    const selectedPackages = [{
      id: '19-3579444-1186755',
      packageName: 'fakeName1',
    }];

    const newSelectedPackages = [{
      id: '19-1234-1186755',
      packageName: 'fakeName2',
    }];

    const initialSelectedOptions = [{
      label: 'fakeName1',
      value: '19-3579444-1186755',
    }];

    const { result, rerender } = renderHook(() => usePackageFilterSelectOptions([], selectedPackages));

    expect(result.current.selectedOptions).toEqual(initialSelectedOptions);
    rerender([], newSelectedPackages);
    expect(result.current.selectedOptions).toEqual(initialSelectedOptions);
  });
});
