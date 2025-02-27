import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  Icon,
} from '@folio/stripes/components';

import { TagsFilter } from '../../../tags-filter';
import { getTagsList } from '../../../utilities';

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

const TagsFilterAccordion = ({
  tagsModel,
  searchByTagsEnabled,
  searchFilter = {},
  onStandaloneFilterChange,
  onStandaloneFilterToggle,
  isOpen = false,
  onToggle,
  header,
  handleStandaloneFilterChange,
  dataOptions,
}) => {
  const {
    tags = '',
  } = searchFilter;

  const tagsList = getTagsList(tags, dataOptions);

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
          <TagsFilter
            isLoading={tagsModel.isLoading}
            selectedValues={tagsList}
            searchByTagsEnabled={searchByTagsEnabled}
            onStandaloneFilterChange={onStandaloneFilterChange}
            onStandaloneFilterToggle={onStandaloneFilterToggle}
            handleStandaloneFilterChange={handleStandaloneFilterChange}
            dataOptions={dataOptions}
          />
        </Accordion>
      </div>
    );
};

TagsFilterAccordion.propTypes = propTypes;

export default TagsFilterAccordion;
