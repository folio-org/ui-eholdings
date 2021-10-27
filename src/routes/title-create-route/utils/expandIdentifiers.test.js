import expandIdentifiers from './expandIdentifiers';

describe('utils', () => {
  describe('expandIdentifiers', () => {
    describe('when identifiers is not present', () => {
      it('should return empty array', () => {
        expect(expandIdentifiers()).toEqual([]);
      });
    });

    describe('when identifiers is present', () => {
      it('should return correct mapped array', () => {
        const identifiers = [{
          id: 'id1',
          flattenedType: 0,
        }, {
          id: 'id2',
          flattenedType: 2,
        }, {
          id: 'id3',
        }];
        const expectedIdentifiers = [{
          id: 'id1',
          type: 'ISSN',
          subtype: 'Online',
        }, {
          id: 'id2',
          type: 'ISBN',
          subtype: 'Online',
        }, {
          id: 'id3',
          type: 'ISSN',
          subtype: 'Online',
        }];

        expect(expandIdentifiers(identifiers)).toEqual(expectedIdentifiers);
      });
    });
  });
});
