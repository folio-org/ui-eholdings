import {
  actionTypes,
  reducer,
} from './data';
import { tagPaths } from '../constants/tagPaths';

describe('data', () => {
  describe('reducer', () => {
    describe('when action type is RESOLVE', () => {
      describe('and requests resource is "tags"', () => {
        const prevState = { statuses: {} };
        const prevRequests = { 1677493534032: {} };

        describe('and request path is /eholdings/tags/summary', () => {
          it('should return data without duplicate tags and irrelevant tags', () => {
            const duplicateTag = {
              '3efd2d74-31dc-49ac-8374-ce9f88acef05': {
                'id': '3efd2d74-31dc-49ac-8374-ce9f88acef05',
                'isLoading': false,
                'isLoaded': true,
                'isSaving': false,
                'attributes': {
                  'value': 'important'
                },
                'relationships': {}
              }
            };

            const irrelevantTag = {
              '0ef62bdc-5ed3-41e1-887f-27784fbe67c3': {
                'id': '0ef62bdc-5ed3-41e1-887f-27784fbe67c3',
                'isLoading': false,
                'isLoaded': true,
                'isSaving': false,
                'attributes': {
                  'value': 'urgent'
                },
                'relationships': {}
              }
            };

            const state = {
              ...prevState,
              tags: {
                requests: {
                  ...prevRequests,
                  '1677489946003': {
                    'timestamp': 1677489946003,
                    'type': 'query',
                    'path': tagPaths.alreadyAddedToRecords,
                    'resource': 'tags',
                    'params': {},
                    'isPending': true,
                    'isResolved': false,
                    'isRejected': false,
                    'records': [],
                    'meta': {},
                    'errors': []
                  },
                },
                records: {
                  '0d1111ea-39d4-4937-bd58-7d6bd45c0bb2': {
                    'id': '0d1111ea-39d4-4937-bd58-7d6bd45c0bb2',
                    'isLoading': false,
                    'isLoaded': true,
                    'isSaving': false,
                    'attributes': {
                      'id': '0d1111ea-39d4-4937-bd58-7d6bd45c0bb2',
                      'label': 'important',
                      'metadata': {
                        'createdDate': '2023-02-26T13:53:54.276+00:00'
                      }
                    },
                    'relationships': {}
                  },
                  ...duplicateTag,
                  ...irrelevantTag,
                },
              },
            };

            const action = {
              type: actionTypes.RESOLVE,
              request: {
                resource: 'tags',
                path: tagPaths.alreadyAddedToRecords,
                timestamp: 1677489946003,
                records: ['0cba8d99-6942-4661-947e-395a9d748ce2'],
                meta: { 'totalResults': 1 },
                status: 200,
              },
              records: [{
                'id': '0cba8d99-6942-4661-947e-395a9d748ce2',
                'type': 'tags',
                'attributes': {
                  'value': 'important',
                },
              }],
            };

            expect(reducer(state, action)).toEqual({
              ...prevState,
              tags: {
                records: {
                  '0cba8d99-6942-4661-947e-395a9d748ce2': {
                    id: '0cba8d99-6942-4661-947e-395a9d748ce2',
                    attributes: {
                      value: 'important',
                    },
                    isLoaded: true,
                    isLoading: false,
                    isSaving: false,
                    relationships: {},
                  },
                  '0d1111ea-39d4-4937-bd58-7d6bd45c0bb2': {
                    ...state.tags.records['0d1111ea-39d4-4937-bd58-7d6bd45c0bb2'],
                    isLoaded: true,
                    isLoading: false,
                    isSaving: false,
                  },
                },
                requests: {
                  ...prevRequests,
                  '1677489946003': {
                    ...state.tags.requests[1677489946003],
                    isPending: false,
                    isResolved: true,
                    meta: { totalResults: 1 },
                    records: ['0cba8d99-6942-4661-947e-395a9d748ce2'],
                    status: 200,
                  },
                },
              }
            });
          });
        });

        describe('and request path is /tags', () => {
          it('should return data without duplicate tags', () => {
            const state = {
              ...prevState,
              tags: {
                requests: {
                  ...prevRequests,
                  '1677489946003': {
                    'timestamp': 1677489946003,
                    'type': 'query',
                    'path': tagPaths.allTags,
                    'resource': 'tags',
                    'params': {},
                    'isPending': true,
                    'isResolved': false,
                    'isRejected': false,
                    'records': [],
                    'meta': {},
                    'errors': []
                  },
                },
                records: {
                  '0d1111ea-39d4-4937-bd58-7d6bd45c0bb2': {
                    'id': '0d1111ea-39d4-4937-bd58-7d6bd45c0bb2',
                    'isLoading': false,
                    'isLoaded': true,
                    'isSaving': false,
                    'attributes': {
                      'id': '0d1111ea-39d4-4937-bd58-7d6bd45c0bb2',
                      'label': 'important',
                      'metadata': {
                        'createdDate': '2023-02-26T13:53:54.276+00:00'
                      }
                    },
                    'relationships': {}
                  },
                  '3efd2d74-31dc-49ac-8374-ce9f88acef05': {
                    'id': '3efd2d74-31dc-49ac-8374-ce9f88acef05',
                    'isLoading': false,
                    'isLoaded': true,
                    'isSaving': false,
                    'attributes': {
                      'value': 'important'
                    },
                    'relationships': {}
                  },
                },
              },
            };

            const action = {
              type: actionTypes.RESOLVE,
              request: {
                resource: 'tags',
                path: tagPaths.allTags,
                timestamp: 1677489946003,
                records: ['0d1111ea-39d4-4937-bd58-7d6bd45c0bb2'],
                meta: { 'totalResults': 1 },
                status: 200,
              },
              records: [{
                'id': '0d1111ea-39d4-4937-bd58-7d6bd45c0bb2',
                'type': 'tags',
                'attributes': {
                  id: '0d1111ea-39d4-4937-bd58-7d6bd45c0bb2',
                  label: 'important',
                  metadata: { 'createdDate': '2023-02-26T13:53:54.276+00:00' },
                },
              }],
            };

            expect(reducer(state, action)).toEqual({
              ...prevState,
              tags: {
                records: state.tags.records,
                requests: {
                  ...prevRequests,
                  '1677489946003': {
                    ...state.tags.requests[1677489946003],
                    isPending: false,
                    isResolved: true,
                    meta: { totalResults: 1 },
                    records: ['0d1111ea-39d4-4937-bd58-7d6bd45c0bb2'],
                    status: 200,
                  },
                },
              }
            });
          });
        });
      });
    });
  });
});
