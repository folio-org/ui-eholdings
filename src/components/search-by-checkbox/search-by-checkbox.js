import { forwardRef } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import camelCase from 'lodash/camelCase';
import upperFirst from 'lodash/upperFirst';

import { Checkbox } from '@folio/stripes/components';

import styles from './search-by-checkbox.css';

const propTypes = {
  filterType: PropTypes.string.isRequired,
  isEnabled: PropTypes.bool,
  onStandaloneFilterToggle: PropTypes.func.isRequired,
};

const SearchByCheckbox = forwardRef(({
  filterType,
  isEnabled = false,
  onStandaloneFilterToggle,
}, ref) => {
  const upperFilterType = upperFirst(camelCase(filterType));

  return (
    <Checkbox
      inputRef={ref}
      checked={isEnabled}
      label={(
        <span className={styles['search-warning']}>
          <FormattedMessage id={`ui-eholdings.search.searchBy${upperFilterType}Only`} />
        </span>
      )}
      onClick={onStandaloneFilterToggle(filterType)}
      data-test-search-by={filterType}
    />
  );
});

SearchByCheckbox.propTypes = propTypes;

export { SearchByCheckbox };
