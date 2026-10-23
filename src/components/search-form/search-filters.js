import { useRef } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import omit from 'lodash/omit';
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

const optionShape = PropTypes.shape({
  filters: PropTypes.objectOf(PropTypes.string).isRequired,
  isDefault: PropTypes.bool,
  labelId: PropTypes.string.isRequired,
});

const optionGroupShape = PropTypes.shape({
  labelId: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(optionShape).isRequired,
});

const propTypes = {
  activeFilters: PropTypes.object, // { filterName: filterValue }
  availableFilters: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.node.isRequired,
    name: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.oneOfType([optionShape, optionGroupShape])).isRequired,
    type: PropTypes.oneOf(Object.values(FILTER_TYPES)),
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

const toDataOptions = (options, formatMessage) => options.map(({ labelId, options: groupOptions, ...option }) => {
  const label = formatMessage({ id: labelId });

  // Use the labelID as a unique, stable control identifier
  return groupOptions
    ? { label, options: toDataOptions(groupOptions, formatMessage) }
    : { ...option, label, value: labelId };
});

const flattenOptions = (dataOptions) => dataOptions.flatMap(option => option.options ?? [option]);

const isCurrentOption = (option, ownedKeys, activeFilters) => {
  return ownedKeys.every(key => option.filters[key] === activeFilters[key]);
};

const filterOptionsByContains = (filterValue, dataOptions = []) => {
  const needle = filterValue.toLowerCase();
  const matches = ({ label }) => label.toLowerCase().includes(needle);

  return dataOptions.reduce((result, option) => {
    if (!option.options) {
      return matches(option) ? [...result, option] : result;
    }

    const options = option.options.filter(matches);

    return options.length ? [...result, { ...option, options }] : result;
  }, []);
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

  const handleClearButtonClick = (labelId, onClear) => {
    onClear();

    // focus on the default option
    setTimeout(() => {
      document.querySelector(`[aria-labelledby="${labelId}"] input[tabindex="0"]`)?.focus();
    });
  };

  const renderSingleSelection = ({ options, current, accordionLabelId, onSelect }) => {
    return (
      <div
        role="radiogroup"
        aria-labelledby={accordionLabelId}
      >
        <Selection
          dataOptions={options}
          value={current.value}
          onChange={onSelect}
          onFilter={filterOptionsByContains}
        />
      </div>
    );
  };

  const renderSingleSelect = ({ options, current, accordionLabelId, onSelect }) => {
    return (
      <div
        role="radiogroup"
        aria-labelledby={accordionLabelId}
      >
        <Select
          dataOptions={options}
          validationEnabled={false}
          value={current.value}
          onChange={(e) => onSelect(e.target.value)}
        />
      </div>
    );
  };

  const renderRadioGroup = ({ name, options, current, accordionLabelId, onSelect }) => {
    return (
      <div
        role="radiogroup"
        aria-labelledby={accordionLabelId}
      >
        {options.map(({ label: radioBtnLabel, value }, i) => {
          const isChecked = value === current.value;

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
              onChange={() => onSelect(value)}
            />
          );
        })}
      </div>
    );
  };

  const typeRenderer = (type, filterProps) => {
    switch (type) {
      case FILTER_TYPES.SELECT:
        return renderSingleSelect(filterProps);
      case FILTER_TYPES.SELECTION:
        return renderSingleSelection(filterProps);
      case FILTER_TYPES.CHECKBOX:
      default:
        return renderRadioGroup(filterProps);
    }
  };

  const renderFilters = () => {
    return (
      <>
        {availableFilters.map(({ type, name, label, options }) => {
          const accordionLabelId = `filter-${searchType}-${name}-label`;

          const dataOptions = toDataOptions(options, formatMessage);
          const leaves = flattenOptions(dataOptions);
          // every filter this control can set; they're all reset whenever the selection changes
          const ownedKeys = [...new Set(leaves.flatMap(({ filters }) => Object.keys(filters)))];
          const current = leaves.find(option => isCurrentOption(option, ownedKeys, activeFilters))
            ?? leaves.find(({ isDefault }) => isDefault);

          const handleClear = () => onUpdate(omit(activeFilters, ownedKeys));

          const handleSelect = (value) => {
            const selected = leaves.find(option => option.value === value);

            onUpdate({
              ...omit(activeFilters, ownedKeys),
              // if this option is a default, clear the filters
              ...(selected.isDefault ? {} : selected.filters),
            });
          };

          const filterProps = {
            name,
            options: dataOptions,
            current,
            accordionLabelId,
            onSelect: handleSelect,
            label,
          };

          const hasSelectedOption = !current.isDefault;

          if (!hasAccordion) {
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
                    onClick={() => handleClearButtonClick(accordionLabelId, handleClear)}
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
              displayClearButton={hasSelectedOption}
              onClearFilter={handleClear}
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
