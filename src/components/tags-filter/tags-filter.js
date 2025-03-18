import { useRef } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { MultiSelectionFilter } from '@folio/stripes/smart-components';

import { ClearButton } from '../clear-button';
import { SearchByCheckbox } from '../search-by-checkbox';

import styles from './tags-filter.css';

const propTypes = {
  dataOptions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })).isRequired,
  handleStandaloneFilterChange: PropTypes.func.isRequired,
  isLoading: PropTypes.object.isRequired,
  onStandaloneFilterChange: PropTypes.func.isRequired,
  onStandaloneFilterToggle: PropTypes.func.isRequired,
  searchByTagsEnabled: PropTypes.bool.isRequired,
  selectedValues: PropTypes.object.isRequired,
  showClearButton: PropTypes.bool,
};

const TagsFilter = ({
  isLoading,
  selectedValues,
  searchByTagsEnabled,
  onStandaloneFilterChange,
  onStandaloneFilterToggle,
  handleStandaloneFilterChange,
  dataOptions,
  showClearButton = false,
}) => {
  const intl = useIntl();
  const labelRef = useRef(null);

  const tagsFilterLabel = intl.formatMessage({ id: 'ui-eholdings.tags.filter' });

  const handleClearButtonClick = () => {
    onStandaloneFilterChange({ tags: undefined });
    labelRef.current?.focus();
  };

  return (
    <>
      <div className={styles.headline}>
        <span
          className="sr-only"
          id="selectTagFilter-label"
        >
          {intl.formatMessage({ id: 'ui-eholdings.tags' })}
        </span>
        <SearchByCheckbox
          ref={labelRef}
          filterType="tags"
          isEnabled={searchByTagsEnabled}
          onStandaloneFilterToggle={onStandaloneFilterToggle}
        />
        {showClearButton && (
          <ClearButton
            show={selectedValues.length > 0}
            label={tagsFilterLabel}
            onClick={handleClearButtonClick}
          />
        )}
      </div>
      <div data-testid="search-form-tag-filter">
        <MultiSelectionFilter
          id="selectTagFilter"
          ariaLabel={tagsFilterLabel}
          dataOptions={dataOptions}
          name="tags"
          onChange={handleStandaloneFilterChange}
          selectedValues={selectedValues}
          disabled={!searchByTagsEnabled}
          aria-labelledby="selectTagFilter-label"
          showLoading={isLoading}
        />
      </div>
    </>
  );
};

TagsFilter.propTypes = propTypes;

export { TagsFilter };
