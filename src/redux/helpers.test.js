import * as helpers from './helpers';
import { tagPaths } from '../constants/tagPaths';

describe('helpers', () => {
  describe('formatTagsData', () => {
    describe('when request is to get tags already added to records', () => {
      const request = {
        path: tagPaths.alreadyAddedToRecords,
        resource: 'tags',
      };

      const body = {
        data: [
          {
            id: 'fakeId',
            type: 'tags',
            attributes: {
              value: 'tagName',
            },
          },
        ],
        meta: {
          totalResults: 1,
        },
      };

      it('should return the formatted data', () => {
        expect(helpers.formatTagsData(request, body)).toEqual({
          data: [{
            id: 'fakeId',
            type: 'tags',
            attributes: {
              value: 'tagName',
            },
          }],
          totalRecords: 1,
        });
      });
    });

    describe('when request is to get all tags', () => {
      const request = {
        path: tagPaths.allTags,
        resource: 'tags',
      };

      describe('when body.tags exists', () => {
        it('should return formatted data', () => {
          const body = {
            tags: [
              {
                id: 'fakeId',
                label: 'tagName',
              },
            ],
            totalRecords: 1,
          };

          expect(helpers.formatTagsData(request, body)).toEqual({
            data: [{
              id: 'fakeId',
              type: 'tags',
              attributes: {
                id: 'fakeId',
                label: 'tagName',
              },
            }],
            totalRecords: 1,
          });
        });
      });

      describe('when body.tags doesnt exist', () => {
        it('should return the formatted data', () => {
          const body = {
            id: 'fakeId',
            totalRecords: 1,
          };

          expect(helpers.formatTagsData(request, body)).toEqual({
            data: {
              attributes: body,
              id: 'fakeId',
              type: 'tags',
            },
            totalRecords: 1,
          });
        });
      });
    });
  });

  describe('mergeAttributes', () => {
    describe('when an existing attribute has a new incoming value', () => {
      it('should overwrite existing with incoming', () => {
        const existing = { name: 'Old Name' };
        const incoming = { name: 'New Name' };

        expect(helpers.mergeAttributes(existing, incoming)).toEqual({ name: 'New Name' });
      });
    });

    describe('when an existing attribute is absent from incoming data', () => {
      it('should carry forward the existing attribute', () => {
        const existing = { name: 'Old Name', contentType: 'E-Book' };
        const incoming = { name: 'Old Name' };

        expect(helpers.mergeAttributes(existing, incoming)).toEqual({
          name: 'Old Name',
          contentType: 'E-Book',
        });
      });
    });

    describe('when customDisplayName is absent in incoming data', () => {
      it('should not carry forward customDisplayName', () => {
        const existing = { name: 'Package Name', customDisplayName: 'Old Custom Name' };
        const incoming = { name: 'Package Name' };

        expect(helpers.mergeAttributes(existing, incoming)).toEqual({
          name: 'Package Name',
        });
      });
    });

    describe('when an incoming customDisplayName has an updated value', () => {
      it('should use the incoming value', () => {
        const existing = { customDisplayName: 'Old Custom Name' };
        const incoming = { customDisplayName: 'New Custom Name' };

        expect(helpers.mergeAttributes(existing, incoming)).toEqual({
          customDisplayName: 'New Custom Name',
        });
      });
    });

    describe('when a user defined field is absent in incoming data', () => {
      it('should not carry forward the user defined field', () => {
        const existing = { name: 'Package Name', userDefinedField1: 'Old Label' };
        const incoming = { name: 'Package Name' };

        expect(helpers.mergeAttributes(existing, incoming)).toEqual({
          name: 'Package Name',
        });
      });
    });
  });
});
