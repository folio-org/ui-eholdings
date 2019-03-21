/* global describe, beforeEach, it */
import { expect } from 'chai';
import { mergeAttributes } from '../../../../src/redux/helpers';

describe('mergeAttributes', () => {
  let existing;
  let incoming;

  beforeEach(() => {
    existing = {
      description: 'description'
    };
  });

  describe('merging existing data with incomplete incoming data', () => {
    beforeEach(() => {
      incoming = {
        isSelected: false
      };
    });

    it('does not overwrite populated keys with empty incoming data', () => {
      const result = mergeAttributes(existing, incoming);
      expect(result.description).to.equal('description');
      expect(result.isSelected).to.be.false;
    });
  });

  describe('merging existing data with incoming data', () => {
    beforeEach(() => {
      incoming = {
        description: 'no, this description',
        isSelected: true
      };
    });

    it('replaces existing data with incoming data', () => {
      const result = mergeAttributes(existing, incoming);
      expect(result.description).to.equal('no, this description');
      expect(result.isSelected).to.be.true;
    });
  });
});
