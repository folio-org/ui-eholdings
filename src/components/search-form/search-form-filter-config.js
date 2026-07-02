import {
  FILTER_TYPES,
  publicationTypeTitlesListFilterConfig,
} from '../../constants';

// Same options as the titles list publication type filter, but rendered as a
// checkbox group instead of a single-select dropdown in this search form.
export const publicationTypeFilterConfig = {
  ...publicationTypeTitlesListFilterConfig,
  type: FILTER_TYPES.CHECKBOX,
};
