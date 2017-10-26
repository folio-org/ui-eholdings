import {
  createRequestCreator,
  createRequestReducer,
  createRequestEpic
} from './request';

import { formatPublicationType } from './utilities';

// title action creators
export const getTitle = createRequestCreator('title');

// title reducer
export const titleReducer = createRequestReducer({
  name: 'title',
  initialContent: {}
});

// title epic
export const titleEpic = createRequestEpic({
  name: 'title',
  endpoint: ({ titleId }) => `eholdings/titles/${titleId}`,
  deserialize: (payload) => {
    if (payload.pubType) {
      payload.pubType = formatPublicationType(payload.pubType);
    }
    return payload;
  }
});
