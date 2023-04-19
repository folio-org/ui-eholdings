import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  Icon,
} from '@folio/stripes/components';
import { MultiSelectionFilter } from '@folio/stripes/smart-components';

import SearchByCheckbox from '../search-by-checkbox';

import styles from './tags-filter-accordion.css';

const propTypes = {
  dataOptions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })).isRequired,
  handleStandaloneFilterChange: PropTypes.func.isRequired,
  header: PropTypes.oneOfType([PropTypes.node, PropTypes.func, PropTypes.string]).isRequired,
  isOpen: PropTypes.bool,
  onStandaloneFilterChange: PropTypes.func.isRequired,
  onStandaloneFilterToggle: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
  searchByTagsEnabled: PropTypes.bool.isRequired,
  searchFilter: PropTypes.object,
  tagsModel: PropTypes.object.isRequired,
};

const defaultProps = {
  isOpen: false,
  searchFilter: {},
};

const TagsFilterAccordion = ({
  tagsModel,
  searchByTagsEnabled,
  searchFilter,
  onStandaloneFilterChange,
  onStandaloneFilterToggle,
  isOpen,
  onToggle,
  header,
  handleStandaloneFilterChange,
  dataOptions,
}) => {
  const {
    tags = '',
  } = searchFilter;

  let tagsList = [];

  if (tags && dataOptions.length) {
    tagsList = Array.isArray(tags)
      ? tags
      : tags.split(',');
  }

  tagsList = tagsList
    .filter(tag => dataOptions.some(option => option.value === tag))
    .map(tag => tag.toLowerCase())
    .sort();

  return tagsModel.isLoading
    ? <Icon icon="spinner-ellipsis" />
    : (
      <div
        data-test-eholdings-tag-filter
        role="tab"
      >
        <Accordion
          label={<FormattedMessage id="ui-eholdings.tags" />}
          id="accordionTagFilter"
          separator={false}
          open={isOpen}
          closedByDefault
          header={header}
          displayClearButton={tagsList.length > 0}
          onClearFilter={() => onStandaloneFilterChange({ tags: undefined })}
          onToggle={onToggle}
          className={styles['search-filter-accordion']}
        >
          <span
            className="sr-only"
            id="selectTagFilter-label"
          >
            <FormattedMessage id="ui-eholdings.tags" />
          </span>
          <SearchByCheckbox
            filterType="tags"
            isEnabled={searchByTagsEnabled}
            onStandaloneFilterToggle={onStandaloneFilterToggle}
          />
          <FormattedMessage id="ui-eholdings.tags.filter">
            {
              ([label]) => (
                <div data-testid="search-form-tag-filter">
                  <MultiSelectionFilter
                    id="selectTagFilter"
                    ariaLabel={label}
                    dataOptions={dataOptions}
                    name="tags"
                    onChange={handleStandaloneFilterChange}
                    selectedValues={tagsList}
                    disabled={!searchByTagsEnabled}
                    aria-labelledby="selectTagFilter-label"
                  />
                </div>
              )
            }
          </FormattedMessage>
        </Accordion>
      </div>
    );
};

TagsFilterAccordion.propTypes = propTypes;
TagsFilterAccordion.defaultProps = defaultProps;

export default TagsFilterAccordion;
