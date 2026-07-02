import {
  FILTER_TYPES,
  contentTypeFilterConfig as basePackageContentTypeFilterConfig,
} from '../../constants';

// Same options as the base package content type filter, but rendered as a
// single-select dropdown instead of a checkbox group in this accordion.
export const contentTypeFilterConfig = {
  ...basePackageContentTypeFilterConfig,
  type: FILTER_TYPES.SELECT,
};
