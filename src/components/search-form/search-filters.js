import PropTypes from 'prop-types';
import { filter } from 'funcadelic';

import {
  Accordion,
  FilterAccordionHeader,
  RadioButton
} from '@folio/stripes/components';

import styles from './search-form.css';

const propTypes = {
  activeFilters: PropTypes.object, // { filterName: filterValue }
  availableFilters: PropTypes.arrayOf(PropTypes.shape({
    defaultValue: PropTypes.string,
    label: PropTypes.node.isRequired,
    name: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.node.isRequired,
      value: PropTypes.string.isRequired,
    })).isRequired,
  })).isRequired,
  closedByDefault: PropTypes.bool,
  disabled: PropTypes.bool,
  onUpdate: PropTypes.func.isRequired,
  searchType: PropTypes.string.isRequired,
};

const defaultProps = {
  activeFilters: {},
  closedByDefault: true,
  disabled: false,
};

const SearchFilters = ({
  searchType,
  activeFilters,
  availableFilters,
  onUpdate,
  closedByDefault,
  disabled,
}) => {
  return (
    <div
      className={styles['search-filters']}
      role="tab"
      data-test-eholdings-search-filters={searchType}
      data-testid={`${searchType}-search-filters`}
    >
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
            closedByDefault={closedByDefault}
            header={FilterAccordionHeader}
            displayClearButton={!!activeFilters[name] && activeFilters[name] !== defaultValue}
            onClearFilter={() => onUpdate({ ...activeFilters, [name]: undefined })}
            id={`filter-${searchType}-${name}`}
            className={styles['search-filter-accordion']}
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
                    aria-label={radioBtnLabel}
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
};

SearchFilters.propTypes = propTypes;
SearchFilters.defaultProps = defaultProps;

export default SearchFilters;
