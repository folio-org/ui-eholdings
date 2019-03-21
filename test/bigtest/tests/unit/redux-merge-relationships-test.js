/* global describe, beforeEach, it */
import { expect } from 'chai';
import { mergeRelationships } from '../../../../src/redux/helpers';

describe('mergeRelationships', () => {
  let existing;
  let incoming;

  const lazy = {
    get merged() { return mergeRelationships; }
  };

  beforeEach(() => {
    existing = {
      providers: { data: 'data' }
    };
  });

  describe('merging existing data with incomplete incoming data', () => {
    beforeEach(() => {
      incoming = {
        providers: { meta: false }
      };
    });

    it('does not overwrite populated keys with empty incoming data', () => {
      const result = lazy.merged(existing, incoming);
      expect(result.providers.data).to.equal('data');
    });
  });

  describe('merging existing data with incoming data', () => {
    beforeEach(() => {
      incoming = {
        providers: { data: 'no, this data' }
      };
    });

    it('replaces existing data with incoming data', () => {
      const result = lazy.merged(existing, incoming);
      expect(result.providers.data).to.equal('no, this data');
    });
  });
});
