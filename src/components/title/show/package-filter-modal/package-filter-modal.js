import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Modal,
  Button,
  ModalFooter,
  MultiSelection,
  Label,
} from '@folio/stripes/components';

import useModalToggle from './use-modal-toggle';
import usePackageFilterSelectOptions from './use-package-filter-select-options';
import SearchBadge from '../../../search-modal/search-badge';

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
  const {
    isOpen,
    toggleModal,
  } = useModalToggle();

  const {
    allOptions,
    selectedOptions,
    setSelectedOptions,
  } = usePackageFilterSelectOptions(allPackages, selectedPackages);

  const handleFilterChange = value => {
    setSelectedOptions(value);
  };

  const handleReset = () => {
    onSubmit([]);
    setSelectedOptions([]);
    toggleModal();
  };

  const handleSubmit = () => {
    const newSelectedPackages = allPackages.filter(({ id: packageId }) => selectedOptions.some((({ value: optionId }) => packageId === optionId)));

    onSubmit(newSelectedPackages);
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

    return (
      <Modal
        open
        closeOnBackgroundClick
        dismissible
        size="small"
        contentClass={css.content}
        label={<FormattedMessage id="ui-eholdings.filter.filterType.packages" />}
        footer={footer}
        onClose={toggleModal}
        id="package-filter-modal"
      >
        <Label id={labelId}>
          <FormattedMessage id="ui-eholdings.label.packages" />
        </Label>
        <MultiSelection
          dataOptions={allOptions}
          onChange={handleFilterChange}
          value={selectedOptions}
          data-test-package-filter-select
          id="packageFilterSelect"
          ariaLabelledBy={labelId}
          aria-label={<FormattedMessage id="ui-eholdings.label.packages" />}
        />
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
