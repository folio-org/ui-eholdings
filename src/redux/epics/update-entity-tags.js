import { of, from } from 'rxjs';
import {
  mergeMap,
  map,
  catchError,
} from 'rxjs/operators';
import { ofType } from 'redux-observable';

import { updateEntityTagsSuccess, updateEntityTagsFailure } from '../actions';
import entityTagsActionTypes from '../constants/entityTagsActionTypes';

import {
  getHeaders,
  parseResponseBody,
} from '../../api/common';

export default function updateEntityTags(action$, state$) {
  return action$
    .pipe(
      ofType(entityTagsActionTypes.UPDATE_ENTITY_TAGS),
      mergeMap(({ data, payload }) => {
        const url = `${state$.value.okapi.url}/eholdings/${data.path}/tags`;
        const method = 'PUT';

        // the request object created from this action
        const request = state$.value.eholdings.data[data.type].requests[data.timestamp];

        const requestOptions = {
          headers: getHeaders(method, state$.value.okapi, url),
          method,
          body: JSON.stringify(payload),
          credentials: 'include',
        };

        const promise = fetch(url, requestOptions)
          .then(response => Promise.all([response.ok, parseResponseBody(response)]))
          .then(([ok, body]) => (ok ? body : Promise.reject(body)));

        return from(promise)
          .pipe(
            map((response) => {
              return updateEntityTagsSuccess(request, response, payload);
            }),
            catchError(errors => of(updateEntityTagsFailure(request, errors, data)))
          );
      }),
    );
}
