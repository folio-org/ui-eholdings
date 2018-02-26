import React from 'react';
import PropTypes from 'prop-types';

import { Accordion, FilterAccordionHeader } from '@folio/stripes-components/lib/Accordion';
import RadioButton from '@folio/stripes-components/lib/RadioButton';

import styles from './search-form.css';

export default function SearchFilters({
  searchType,
  activeFilters = {},
  availableFilters,
  onUpdate
}) {
  return (
    <div className={styles['search-filters']} data-test-eholdings-search-filters={searchType}>
      {availableFilters.map(({ name, label, defaultValue, options }) => (
        <Accordion
          key={name}
          name={name}
          label={label}
          separator={false}
          closedByDefault={false}
          header={FilterAccordionHeader}
          displayClearButton={!!activeFilters[name] && activeFilters[name] !== defaultValue}
          onClearFilter={() => onUpdate({ ...activeFilters, [name]: undefined })}
        >
          {options.map(({ label, value }, i) => ( // eslint-disable-line no-shadow
            <RadioButton
              key={i}
              name={name}
              id={`eholdings-search-filters-${searchType}-${name}-${value}`}
              label={label}
              value={value}
              checked={value === (activeFilters[name] || defaultValue)}
              onChange={() => onUpdate({
                ...activeFilters,
                // if this option is a default, clear the filter
                [name]: value === defaultValue ? undefined : value
              })}
            />
          ))}
        </Accordion>
      ))}
    </div>
  );
}

SearchFilters.propTypes = {
  searchType: PropTypes.string.isRequired,
  activeFilters: PropTypes.object,
  availableFilters: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    defaultValue: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    })).isRequired
  })).isRequired,
  onUpdate: PropTypes.func.isRequired
};
