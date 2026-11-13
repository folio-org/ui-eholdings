import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { Select } from '@folio/stripes/components';

import {
  DEFAULT_SEARCH_MODE,
  packageSearchableIndexes,
  packageSearchModes,
  searchTypes,
  titleSearchableIndexes,
  titleSearchModes,
} from '../../constants';

const SEARCH_OPTIONS = {
  [searchTypes.TITLES]: {
    fields: titleSearchableIndexes,
    fieldLabelPrefix: 'ui-eholdings.label',
    defaultField: titleSearchableIndexes.TITLE,
    modes: titleSearchModes,
  },
  [searchTypes.PACKAGES]: {
    fields: packageSearchableIndexes,
    fieldLabelPrefix: 'ui-eholdings.label.packageIndex',
    defaultField: packageSearchableIndexes.NAME,
    modes: packageSearchModes,
  },
};

const SEARCH_MODE_LABEL_PREFIX = 'ui-eholdings.label.searchModes';

export const SearchModifiers = ({
  hideSearchMode = false,
  searchType,
  searchField,
  searchMode,
  onFieldChange,
  onModeChange,
}) => {
  const intl = useIntl();
  const options = SEARCH_OPTIONS[searchType];

  if (!options) {
    return null;
  }

  const renderOptions = (values, labelPrefix) => Object.values(values).map(value => (
    <option
      key={value}
      value={value}
    >
      {intl.formatMessage({ id: `${labelPrefix}.${value}` })}
    </option>
  ));

  return (
    <>
      <Select
        marginBottom0
        onChange={onFieldChange}
        value={searchField || options.defaultField}
        aria-label={intl.formatMessage({ id: 'ui-eholdings.search.selectFieldToSearch' })}
        data-testid="field-to-search-select"
      >
        {renderOptions(options.fields, options.fieldLabelPrefix)}
      </Select>
      {!hideSearchMode && (
        <Select
          marginBottom0
          onChange={onModeChange}
          value={searchMode || DEFAULT_SEARCH_MODE}
          aria-label={intl.formatMessage({ id: 'ui-eholdings.search.selectSearchMode' })}
          data-testid="search-mode-select"
        >
          {renderOptions(options.modes, SEARCH_MODE_LABEL_PREFIX)}
        </Select>
      )}
    </>
  );
};

SearchModifiers.propTypes = {
  hideSearchMode: PropTypes.bool,
  onFieldChange: PropTypes.func.isRequired,
  onModeChange: PropTypes.func.isRequired,
  searchField: PropTypes.string,
  searchMode: PropTypes.string,
  searchType: PropTypes.string.isRequired,
};
