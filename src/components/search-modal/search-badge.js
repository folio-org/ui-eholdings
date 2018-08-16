import React from 'react';
import PropTypes from 'prop-types';

import {
  IconButton
} from '@folio/stripes-components';

export default function SearchBadge({ filterCount = 0, onClick, ...rest }) {
  return (
    <div {...rest}>
      <IconButton
        icon="search"
        onClick={onClick}
        data-test-eholdings-search-filters="icon"
        {...filterCount > 0 ? { badgeCount: filterCount } : {}}
      />
    </div>
  );
}

SearchBadge.propTypes = {
  onClick: PropTypes.func.isRequired,
  filterCount: PropTypes.number,
};
