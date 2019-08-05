import entityTagsActionTypes from '../constants/entityTagsActionTypes';
import {
  getChangedAttributes,
  reduceData,
  getRecord,
  makeRequest,
} from '../helpers';

const entityTagsReducers = {
  [entityTagsActionTypes.UPDATE_ENTITY_TAGS]: (state, { data, payload }) => {
    return reduceData(data.type, state, (store) => {
      const record = getRecord(store, data.params.id);
      return {
        requests: {
          ...store.requests,
          ...makeRequest('update', {
            ...data,
            changedAttributes: getChangedAttributes(record.attributes, payload.data.attributes)
          })
        },
        records: {
          ...store.records,
          [data.params.id]: {
            ...record,
            isSaving: true
          }
        }
      };
    });
  },

  [entityTagsActionTypes.UPDATE_TAG_ON_ENTITY_SUCCESS]: (state, action) => {
    const { request, records, data } = action;
    let next = reduceData(request.resource, state, store => ({
      requests: {
        ...store.requests,
        [request.timestamp]: {
          ...store.requests[request.timestamp],
          records: request.records,
          meta: request.meta,
          isPending: false,
          isResolved: true
        }
      }
    }));
    next = records.reduce((next, record) => { // eslint-disable-line no-shadow
      return reduceData(data.type, next, (store) => {
        const recordState = getRecord(store, data.id);

        return {
          records: {
            ...store.records,
            [data.id]: {
              ...recordState,
              attributes: {
                ...recordState.attributes,
                tags: {
                  tagList: [...record.attributes.tags.tagList],
                },
              },
              isSaving: false,
              isLoading: false,
              isLoaded: true
            }
          }
        };
      });
    }, next);

    return next;
  },
};

export default entityTagsReducers;
