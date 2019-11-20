import React from 'react';
import PropTypes from 'prop-types';
import { filter } from 'funcadelic';

import {
  Accordion,
  FilterAccordionHeader,
  RadioButton
} from '@folio/stripes/components';
import styles from './search-form.css';

export default function SearchFilters({
  searchType,
  activeFilters = {},
  availableFilters,
  onUpdate,
  disabled,
}) {
  return (
    <div className={styles['search-filters']} data-test-eholdings-search-filters={searchType}>
      {availableFilters.map(({ name, label, defaultValue, options }) => {
        const accordionLabelId = `filter-${searchType}-${name}-label`;

        return (
          <Accordion
            key={name}
            name={name}
            label={
              <span id={accordionLabelId}>
                {label}
              </span>
            }
            separator={false}
            closedByDefault
            header={FilterAccordionHeader}
            displayClearButton={!!activeFilters[name] && activeFilters[name] !== defaultValue}
            onClearFilter={() => onUpdate({ ...activeFilters, [name]: undefined })}
            id={`filter-${searchType}-${name}`}
          >
            <div
              role="radiogroup"
              aria-labelledby={accordionLabelId}
            >
              {options.map(({ label: radioBtnLabel, value }, i) => {
                const isChecked = value === (activeFilters[name] || defaultValue);

                return (
                  <RadioButton
                    role="radio"
                    aria-checked={isChecked}
                    tabIndex={isChecked ? 0 : -1}
                    key={i}
                    name={name}
                    id={`eholdings-search-filters-${searchType}-${name}-${value}`}
                    label={radioBtnLabel}
                    value={value}
                    checked={isChecked}
                    disabled={disabled}
                    onChange={() => {
                      const replaced = {
                        ...activeFilters,
                        // if this option is a default, clear the filter
                        [name]: value === defaultValue ? undefined : value
                      };
                      const withoutDefault = filter(item => item.value !== undefined, replaced);

                      return onUpdate(withoutDefault);
                    }}
                  />
                );
              })}
            </div>
          </Accordion>
        );
      })}
    </div>
  );
}

SearchFilters.propTypes = {
  activeFilters: PropTypes.object,
  availableFilters: PropTypes.arrayOf(PropTypes.shape({
    defaultValue: PropTypes.string,
    label: PropTypes.node.isRequired,
    name: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.node.isRequired,
      value: PropTypes.string.isRequired
    })).isRequired
  })).isRequired,
  disabled: PropTypes.bool.isRequired,
  onUpdate: PropTypes.func.isRequired,
  searchType: PropTypes.string.isRequired
};
