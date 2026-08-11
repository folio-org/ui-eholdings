import { useRef } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { filter } from 'funcadelic';
import noop from 'lodash/noop';

import {
  Accordion,
  FilterAccordionHeader,
  Label,
  RadioButton,
  Select,
  Selection,
} from '@folio/stripes/components';
import { ColumnManagerMenu } from '@folio/stripes/smart-components';

import { ClearButton } from '../clear-button';
import { FILTER_TYPES } from '../../constants';
import {
  COLUMN_MAPPING_BY_LIST_TYPE,
  EXCLUDE_COLUMNS_FROM_ACTION_MENU,
} from '../../constants/list-columns';

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
  hasAccordion: PropTypes.bool,
  hasColumnManager: PropTypes.bool,
  onUpdate: PropTypes.func.isRequired,
  searchType: PropTypes.string.isRequired,
  toggleColumn: PropTypes.func,
  visibleColumns: PropTypes.arrayOf(PropTypes.string),
};

const SearchFilters = ({
  searchType,
  activeFilters = {},
  availableFilters,
  onUpdate,
  closedByDefault = true,
  disabled = false,
  hasAccordion = true,
  visibleColumns = [],
  toggleColumn = noop,
  hasColumnManager = false,
}) => {
  const { formatMessage } = useIntl();
  const labelRef = useRef(null);
  const columnManagerPrefix = `eholdings-${searchType}`;

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

  const typeRenderer = (type, filterProps) => {
    switch(type) {
      case FILTER_TYPES.SELECT:
        return renderSingleSelect(filterProps);
      case FILTER_TYPES.SELECTION:
        return renderSingleSelection(filterProps);
      case FILTER_TYPES.CHECKBOX:
      default:
        return renderRadioGroup(filterProps);
    }
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

  const renderSingleSelection= ({ name, options, accordionLabelId, defaultValue }) => {
    return (
      <div
        role="radiogroup"
        aria-labelledby={accordionLabelId}
      >
        <Selection
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

  const renderFilters = () => {
    return (
      <>
        {availableFilters.map(({ type, name, label, defaultValue, options }) => {
          const accordionLabelId = `filter-${searchType}-${name}-label`;

          const labelledOptions = options?.map((o) => ({
            ...o,
            label: formatMessage({ id: o.labelId }),
          }));

          const filterProps = {
            name,
            options: labelledOptions,
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
                {typeRenderer(type, filterProps)}
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
              {typeRenderer(type, filterProps)}
            </Accordion>
          );
        })}
      </>
    );
  };

  const renderColumnManager = () => {
    return (
      <ColumnManagerMenu
        prefix={columnManagerPrefix}
        columnMapping={COLUMN_MAPPING_BY_LIST_TYPE[searchType] || {}}
        visibleColumns={visibleColumns}
        excludeColumns={EXCLUDE_COLUMNS_FROM_ACTION_MENU[searchType]}
        toggleColumn={toggleColumn}
      />
    );
  };

  return (
    <div
      className={styles['search-filters']}
      role="tab"
      data-test-eholdings-search-filters={searchType}
      data-testid={`${searchType}-search-filters`}
    >
      {renderFilters()}
      {hasColumnManager && renderColumnManager()}
    </div>
  );
};

SearchFilters.propTypes = propTypes;

export default SearchFilters;
