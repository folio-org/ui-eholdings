import get from 'lodash/get';
import entityTagsActionTypes from '../constants/entityTagsActionTypes';

export default function updateEntityTagsSuccess(request, body, payload) {
  const meta = get(body, 'meta', {});
  const records = [get(body, 'data', payload.data)];
  const id = [request.params.id];

  return {
    type: entityTagsActionTypes.UPDATE_TAG_ON_ENTITY_SUCCESS,
    data: { type: request.resource, id },
    request: { ...request, records: id, meta },
    records
  };
}
