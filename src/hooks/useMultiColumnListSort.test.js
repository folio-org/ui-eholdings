import {
  renderHook,
  act,
} from '@testing-library/react-hooks';

import useMultiColumnListSort from './useMultiColumnListSort';

import { sortOrders } from '../constants';

describe('Given useMultiColumnListSort', () => {
  it('should return default values', () => {
    const currentParameters = {
      sortOrder: '',
      sortedColumn: '',
    };
    const { result } = renderHook(() => useMultiColumnListSort(currentParameters.sortOrder, currentParameters.sortedColumn));
    const [sortParameters] = result.current;

    expect(sortParameters.sortOrder).toBe('');
    expect(sortParameters.sortedColumn).toBe('');
  });

  describe('when handle "onChange" action', () => {
    it('should return ascending sortOrder and selected sortedColumn', () => {
      const currentParameters = {
        sortOrder: {
          name: 'asc',
          fullName: 'ascending',
        },
        sortedColumn: 'newName',
      };
      const { result } = renderHook(() => useMultiColumnListSort(currentParameters.sortOrder, currentParameters.sortedColumn));
      const [sortParameters, onChange] = result.current;

      act(() => {
        onChange('', { name: 'newName' });
      });

      expect(sortParameters.sortOrder).toEqual(sortOrders.asc);
      expect(sortParameters.sortedColumn).toBe('newName');
    });

    it('should return descending sortOrder and selected sortedColumn', () => {
      const currentParameters = {
        sortOrder: {
          name: 'desc',
          fullName: 'descending',
        },
        sortedColumn: 'newName',
      };
      const { result } = renderHook(() => useMultiColumnListSort(currentParameters.sortOrder, currentParameters.sortedColumn));
      const [sortParameters, onChange] = result.current;

      act(() => {
        onChange('', { name: 'newName' });
      });

      expect(sortParameters.sortOrder).toEqual(sortOrders.desc);
      expect(sortParameters.sortedColumn).toBe('newName');
    });
  });
});
