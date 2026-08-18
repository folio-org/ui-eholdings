import {
  renderHook,
  act,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';

import { useBackendResponseErrors } from './use-backend-response-errors';

describe('useBackendResponseErrors', () => {
  describe('when onError is called', () => {
    it('should should parse response and set errors', async () => {
      const beErrors = [{ title: 'test error' }];
      const error = {
        response: {
          json: jest.fn().mockResolvedValue({
            errors: beErrors,
          }),
        },
      };

      const { result, rerender } = renderHook(() => useBackendResponseErrors());

      act(() => {
        result.current.onError(error);
      });

      rerender();

      await waitFor(() => expect(result.current.errors).toEqual(beErrors));
    });
  });
});
