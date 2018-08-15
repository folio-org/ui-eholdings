import React from 'react';
import PropTypes from 'prop-types';

import {
  Badge,
  IconButton
} from '@folio/stripes-components';

import styles from './search-badge.css';

export default function SearchBadge({ filterCount = 0, onClick }) {
  return (
    <div className={styles['search-filter-area']} data-test-eholdings-details-view-filters>
      {filterCount > 0 && (
        <span data-test-eholdings-details-view-filters-badge>
          <Badge className={styles['filter-count']}>{filterCount}</Badge>
        </span>
      )}
      <IconButton
        icon="search"
        onClick={onClick}
        data-test-eholdings-details-view-search
      />
    </div>
  );
}

SearchBadge.propTypes = {
  onClick: PropTypes.func.isRequired,
  filterCount: PropTypes.number,
};
