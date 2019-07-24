import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import tagActions from '../actions';
import actionTypes from '../constants/actionTypes';

import {
  getHeaders,
  parseResponseBody,
} from './common';

export default function updateEntityTags(action$, store) {
  const {
    getState,
  } = store;

  return action$
    .ofType(actionTypes.UPDATE_ENTITY_TAGS)
    .mergeMap((action) => {
      const {
        payload: model,
      } = action;

      const state = getState();

      // const url = `${state.okapi.url}/${tag.entityName}/${tag.entityId}/tags`;
      const url = `${state.okapi.url}/eholdings/packages/865-6858/tags`;
      const method = 'PUT';
      const payload = {
        data: {
          type: 'tags',
          attributes: {
            name: model.name,
            contentType: model.contentType,
            tags: {
              tagList: model.tags.tagList
            }
          }
        }
      };
      const requestOptions = {
        headers: getHeaders(method, state, url),
        method,
        body: JSON.stringify(payload),
      };

      const promise = fetch(url, requestOptions)
        .then(response => Promise.all([response.ok, parseResponseBody(response)]))
        .then(([ok, body]) => (ok ? body : Promise.reject(body)));

      return Observable.from(promise)
        .map((tags) => {
          console.log('tags response', tags);
          // tagActions.updateEntityTagsSuccess();
          return {
            type: '@@ui-eholdings/db/UPDATE_TAG_ON_ENTITY',
            data: {
              id: model.id,
              resourceType: 'packages',
              tags: tags.data.attributes.tags.tagList
            }
          };
        })
        .catch(error => Observable.of(tagActions.updateEntityTagsFailure({ error })));
    });
}
