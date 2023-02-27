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
});
