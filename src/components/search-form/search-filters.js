import { useRef } from 'react';
import PropTypes from 'prop-types';
import { filter } from 'funcadelic';

import {
  Accordion,
  FilterAccordionHeader,
  Label,
  RadioButton,
  Select
} from '@folio/stripes/components';

import { ClearButton } from '../clear-button';

import styles from './search-form.css';
import { FILTER_TYPES } from '../../constants';

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
  hasAccordion: PropTypes.bool,
  onUpdate: PropTypes.func.isRequired,
  searchType: PropTypes.string.isRequired,
};

const SearchFilters = ({
  searchType,
  activeFilters = {},
  availableFilters,
  onUpdate,
  closedByDefault = true,
  disabled = false,
  hasAccordion = true,
}) => {
  const labelRef = useRef(null);

  const handleClearFilter = (name) => {
    onUpdate({
      ...activeFilters,
      [name]: undefined,
    });
  };

  const handleClearButtonClick = (labelId, name) => {
    handleClearFilter(name);

    // focus on the default option
    setTimeout(() => {
      document.querySelector(`[aria-labelledby="${labelId}"] input[tabindex="0"]`)?.focus();
    });
  };

  const renderSingleSelect = ({ name, options, accordionLabelId, defaultValue }) => {
    return (
      <div
        role="radiogroup"
        aria-labelledby={accordionLabelId}
      >
        <Select
          dataOptions={options}
          validationEnabled={false}
          value={activeFilters[name] || defaultValue}
          onChange={(e) => {
            const { value } = e.target;
            const replaced = {
              ...activeFilters,
              // if this option is a default, clear the filter
              [name]: value === defaultValue ? undefined : value
            };
            const withoutDefault = filter(item => item.value !== undefined, replaced);

            return onUpdate(withoutDefault);
          }}
        />
      </div>
    );
  };

  const renderRadioGroup = ({ name, options, accordionLabelId, defaultValue }) => {
    return (
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
    );
  };

  return (
    <div
      className={styles['search-filters']}
      role="tab"
      data-test-eholdings-search-filters={searchType}
      data-testid={`${searchType}-search-filters`}
    >
      {availableFilters.map(({ type, name, label, defaultValue, options }) => {
        const accordionLabelId = `filter-${searchType}-${name}-label`;

        const filterProps = {
          name,
          options,
          accordionLabelId,
          defaultValue,
          label,
        };

        if (!hasAccordion) {
          const hasSelectedOption = ![undefined, defaultValue].includes(activeFilters[name]);

          return (
            <div
              key={name}
              className={styles.groupContainer}
            >
              <div className={styles.groupTitle}>
                <Label
                  id={accordionLabelId}
                  ref={labelRef}
                >
                  {label}
                </Label>
                <ClearButton
                  show={hasSelectedOption}
                  label={label}
                  className={styles.clearButton}
                  onClick={() => handleClearButtonClick(accordionLabelId, name)}
                />
              </div>
              {type === FILTER_TYPES.SELECT
                ? renderSingleSelect(filterProps)
                : renderRadioGroup(filterProps)
              }
            </div>
          );
        }

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
            onClearFilter={() => handleClearFilter(name)}
            id={`filter-${searchType}-${name}`}
            className={styles['search-filter-accordion']}
          >
            {type === FILTER_TYPES.SELECT
              ? renderSingleSelect(filterProps)
              : renderRadioGroup(filterProps)
            }
          </Accordion>
        );
      })}
    </div>
  );
};

SearchFilters.propTypes = propTypes;

export default SearchFilters;
