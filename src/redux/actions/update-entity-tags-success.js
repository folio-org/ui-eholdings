import get from 'lodash/get';
import entityTagsActionTypes from '../constants/entityTagsActionTypes';

export default function updateEntityTagsSuccess(request, body, payload) {
  let records = [];
  let id = [];
  let meta = {};
  const data = get(body, 'data', payload.data);
  meta = get(body, 'meta', {});
  records = [data];
  id = [request.params.id];


  return {
    type: entityTagsActionTypes.UPDATE_TAG_ON_ENTITY_SUCCESS,
    data: { type: request.resource, id },
    request: { ...request, records: id, meta },
    records
  };
}
