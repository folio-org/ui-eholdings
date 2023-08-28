import {
  renderHook,
  act,
} from '@folio/jest-config-stripes/testing-library/react';

import useMultiColumnListSort from './useMultiColumnListSort';

import { sortOrders } from '../../constants';

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

  describe('when handle "onChange" action with the same name as currentColumn', () => {
    it('should return ascending sortOrder and selected sortedColumn', () => {
      const currentParameters = {
        sortOrder: {
          name: 'desc',
          fullName: 'descending',
        },
        sortedColumn: 'newName',
      };

      const { result, rerender } = renderHook(() => useMultiColumnListSort(currentParameters.sortOrder, currentParameters.sortedColumn));
      const onChange = result.current[1];

      act(() => {
        onChange('', { name: 'newName' });
      });

      rerender();

      expect(result.current[0].sortOrder).toEqual(sortOrders.asc);
      expect(result.current[0].sortedColumn).toBe('newName');
    });
  });

  describe('when handle "onChange" action with a different name as currentColumn', () => {
    it('should set ascending sortOrder by default and selected sortedColumn', () => {
      const currentParameters = {
        sortOrder: {
          name: 'desc',
          fullName: 'descending',
        },
        sortedColumn: 'newName',
      };

      const { result, rerender } = renderHook(() => useMultiColumnListSort(currentParameters.sortOrder, currentParameters.sortedColumn));
      const onChange = result.current[1];

      act(() => {
        onChange('', { name: 'otherName' });
      });

      rerender();

      expect(result.current[0].sortOrder).toEqual(sortOrders.asc);
      expect(result.current[0].sortedColumn).toBe('otherName');
    });
  });
});
