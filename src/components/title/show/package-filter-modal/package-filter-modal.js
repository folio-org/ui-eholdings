import PropTypes from 'prop-types';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import {
  size,
} from 'lodash';

import {
  Accordion,
  FilterAccordionHeader,
  Modal,
  Button,
  ModalFooter,
  MultiSelection,
} from '@folio/stripes/components';

import useModalToggle from './use-modal-toggle';
import usePackageFilterSelectOptions from './use-package-filter-select-options';
import SearchBadge from '../../../search-modal/search-badge';
import SearchFilters from '../../../search-form/search-filters';
import {
  searchTypes,
  selectionStatusFilterConfig,
  selectionStatusFilterOptions,
  EBSCO_PROVIDER_ID,
} from '../../../../constants';

import css from './package-filter-modal.css';

const propTypes = {
  allPackages: PropTypes.array.isRequired,
  filterCount: PropTypes.number.isRequired,
  onSubmit: PropTypes.func.isRequired,
  selectedPackages: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })).isRequired,
};

const PackageFilterModal = ({
  allPackages,
  selectedPackages,
  onSubmit,
  filterCount,
}) => {
  const intl = useIntl();

  const {
    isOpen,
    toggleModal,
  } = useModalToggle();

  const {
    allOptions,
    selectedOptions,
    setSelectedOptions,
    searchFilters,
    setSearchFilters,
  } = usePackageFilterSelectOptions(allPackages, selectedPackages);

  const handleFilterChange = (value) => {
    setSelectedOptions(value);
  };

  const handleReset = () => {
    onSubmit([]);
    setSelectedOptions([]);
    setSearchFilters({});
    toggleModal();
  };

  const handleSubmit = () => {
    const filterBySelectedStatus = ({ isSelected, providerId }) => {
      if (!searchFilters.selected) {
        return true;
      }

      return searchFilters.selected === selectionStatusFilterOptions.EBSCO
        ? isSelected && providerId === EBSCO_PROVIDER_ID
        : searchFilters.selected === isSelected.toString();
    };

    const newSelectedPackages = allPackages
      .filter(({ id: packageId }) => {
        return !selectedOptions.length || selectedOptions.some((({ value: optionId }) => packageId === optionId));
      })
      .filter(filterBySelectedStatus);

    const countOfAppliedPackagesFilters = !!selectedOptions.length + size(searchFilters);

    onSubmit(newSelectedPackages, countOfAppliedPackagesFilters);
    toggleModal();
  };

  const renderModal = () => {
    const footer = (
      <ModalFooter>
        <Button
          buttonStyle="primary"
          data-test-package-selection-modal-submit
          onClick={handleSubmit}
        >
          <FormattedMessage id="ui-eholdings.filter.search" />
        </Button>
        <Button
          onClick={handleReset}
          data-test-package-selection-modal-reset-all
        >
          <FormattedMessage id="ui-eholdings.filter.resetAll" />
        </Button>
      </ModalFooter>
    );

    const labelId = 'package-filter-modal-multiselection-label';

    const clearSelectedOptions = () => setSelectedOptions([]);

    return (
      <Modal
        open
        closeOnBackgroundClick
        dismissible
        size="small"
        contentClass={css.content}
        label={<FormattedMessage id="ui-eholdings.filter.filterType.packages" />}
        aria-label={intl.formatMessage({ id: 'ui-eholdings.filter.filterType.packages' })}
        footer={footer}
        onClose={toggleModal}
        id="package-filter-modal"
      >
        <div role="tablist">
          <Accordion
            id={labelId}
            name={labelId}
            label={<FormattedMessage id="ui-eholdings.label.packages" />}
            separator={false}
            closedByDefault={false}
            header={FilterAccordionHeader}
            displayClearButton={!!selectedOptions?.length}
            onClearFilter={clearSelectedOptions}
            headerProps={{
              headingLevel: 2,
              role: 'tab',
            }}
          >
            <MultiSelection
              autoFocus
              dataOptions={allOptions}
              onChange={handleFilterChange}
              value={selectedOptions}
              data-test-package-filter-select
              id="packageFilterSelect"
              ariaLabelledBy={labelId}
              aria-label={<FormattedMessage id="ui-eholdings.label.packages" />}
              tether={{
                constraints: [
                  {
                    to: 'window',
                    attachment: 'together',
                  },
                ],
              }}
            />
          </Accordion>
          <SearchFilters
            searchType={searchTypes.PACKAGES}
            activeFilters={searchFilters}
            availableFilters={[selectionStatusFilterConfig]}
            closedByDefault={false}
            onUpdate={setSearchFilters}
          />
        </div>
      </Modal>
    );
  };

  return (
    <>
      <SearchBadge
        onClick={toggleModal}
        filterCount={filterCount}
      />
      {isOpen && renderModal()}
    </>
  );
};

PackageFilterModal.propTypes = propTypes;

export default PackageFilterModal;
