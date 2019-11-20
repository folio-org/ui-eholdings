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
    const reducedRequests = reduceData(request.resource, state, store => ({
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

    return records.reduce((reducedData, record) => {
      return reduceData(data.type, reducedData, (store) => {
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
    }, reducedRequests);
  },
};

export default entityTagsReducers;
