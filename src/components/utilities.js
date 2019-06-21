import moment from 'moment';
import queryString from 'qs';
import get from 'lodash/get';
import { searchTypes } from '../constants';

export function isBookPublicationType(publicationType) {
  const publicationTypeIsBook = {
    'All': false,
    'Audiobook': true,
    'Book': true,
    'Book Series': true,
    'Database': false,
    'Journal': false,
    'Newsletter': false,
    'Newspaper': false,
    'Proceedings': false,
    'Report': false,
    'Streaming Audio': true,
    'Streaming Video': true,
    'Thesis & Dissertation': false,
    'Website': false,
    'Unspecified': false
  };

  return !!publicationTypeIsBook[publicationType];
}

export function isValidCoverage(coverageObj) {
  if (coverageObj.beginCoverage) {
    if (!moment.utc(coverageObj.beginCoverage, 'YYYY-MM-DD').isValid()) { return false; }
  }
  if (coverageObj.endCoverage) {
    if (!moment.utc(coverageObj.endCoverage, 'YYYY-MM-DD').isValid()) { return false; }
  }
  return true;
}

export function isValidCoverageList(coverageArray) {
  return coverageArray
    .every(coverageArrayObj => (isValidCoverage(coverageArrayObj)));
}

// We use these functions quite a bit with these options, so this just
// allows us to preload them with defaults so we don't have to repeat
// the same options every time.
export const qs = {
  parse: path => queryString.parse(path, { ignoreQueryPrefix: true }),
  stringify: params => queryString.stringify(params, { encodeValuesOnly: true })
};

export const processErrors = ({ request, update, destroy }) => {
  const processErrorsSet = ({ errors, timestamp }) => errors.map((error, index) => ({
    message: error.title,
    type: 'error',
    id: `error-${timestamp}-${index}`
  }));

  const hasErrors = update.isRejected || request.isRejected || destroy.isRejected;
  const putErrors = hasErrors ? processErrorsSet(update) : [];
  const getErrors = hasErrors ? processErrorsSet(request) : [];
  const destroyErrors = hasErrors ? processErrorsSet(destroy) : [];

  return [...putErrors, ...getErrors, ...destroyErrors];
};

/**
 * Transforms UI params into search params
 *
 * @param {Object} parms - query param object
 */
export function transformQueryParams(searchType, params) {
  if (searchType === 'titles') {
    const {
      q,
      filter = {},
      ...searchParams
    } = params;

    let { searchfield = 'name' } = params;

    if (searchfield === 'title') {
      searchfield = 'name';
    }

    const searchfilter = {
      ...filter,
      [searchfield]: q
    };

    return {
      ...searchParams,
      filter: searchfilter
    };
  }
  return params;
}

/**
 *  Getter helper for the entity tags
 * @param {Object} entityModel - entity model that has tags attibute as tags:{taglist:[]}
 */
export const getEntityTags = (entityModel) => {
  return get(entityModel, ['tags', 'tagList'], []);
};

/**
 *
 * @param {Object} entityModel - entity model that has tags attibute as tags:{taglist:[]}
 */
export const getTagLabelsArr = (tagsModel) => {
  const tagRecords = get(tagsModel, ['resolver', 'state', 'tags', 'records'], {});
  return Object.values(tagRecords).map((tag) => tag.attributes);
};

export function formatNoteReferrerEntityData(data) {
  if (data) {
    const {
      entityName: name,
      entityType: type,
      entityId: id,
    } = data;

    return {
      name,
      type,
      id,
    };
  }

  return false;
}

export function getResultsNotFoundTranslationKey(searchType, hasQuery) {
  let TranslationKey = '';
  if (searchType === searchTypes.PROVIDERS) {
    TranslationKey = hasQuery ? 'ui-eholdings.provider.resultsNotFoundForQuery' : 'ui-eholdings.provider.resultsNotFound';
  } else if (searchType === searchTypes.PACKAGES) {
    TranslationKey = hasQuery ? 'ui-eholdings.package.resultsNotFoundForQuery' : 'ui-eholdings.package.resultsNotFound';
  } else {
    TranslationKey = hasQuery ? 'ui-eholdings.title.resultsNotFoundForQuery' : 'ui-eholdings.title.resultsNotFound';
  }
  return TranslationKey;
}
