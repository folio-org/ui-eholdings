import React from 'react';
import PropTypes from 'prop-types';

import {
  Badge,
  IconButton
} from '@folio/stripes-components';

import styles from './search-badge.css';

export default function SearchBadge({ filterCount = 0, onClick, ...rest }) {
  return (
    <div className={styles['search-filter-area']} {...rest}>
      {filterCount > 0 && (
        <span data-test-eholdings-search-filters="badge">
          <Badge className={styles['filter-count']}>{filterCount}</Badge>
        </span>
      )}
      <IconButton
        icon="search"
        onClick={onClick}
        data-test-eholdings-search-filters="icon"
      />
    </div>
  );
}

SearchBadge.propTypes = {
  onClick: PropTypes.func.isRequired,
  filterCount: PropTypes.number,
};
