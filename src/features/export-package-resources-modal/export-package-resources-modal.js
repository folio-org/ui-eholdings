import {
  useMemo,
  useState,
} from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Button,
  Modal,
  ModalFooter,
} from '@folio/stripes/components';

import ExportFieldsSection from './export-fields-section';
import { useExportPackageTitle } from '../../hooks';
import { formatExportFieldsPayload } from './utils';
import {
  FIELDS_BY_RECORD_TYPE,
  RECORD_TYPES,
} from './constants';

const propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  recordId: PropTypes.string.isRequired,
  recordType: PropTypes.string.isRequired,
  titleSearchFilters: PropTypes.string,
};

const ExportPackageResourcesModal = ({
  open,
  onClose,
  recordId,
  recordType,
  titleSearchFilters,
}) => {
  const intl = useIntl();
  const [fieldSectionState, setFieldSectionState] = useState({
    [RECORD_TYPES.PACKAGE]: {
      allSelected: true,
      selectedFields: [],
    },
    [RECORD_TYPES.RESOURCE]: {
      allSelected: true,
      selectedFields: [],
    },
  });

  const { doExport } = useExportPackageTitle({
    onError: () => {},
    onSuccess: () => {},
  });

  const canExport = useMemo(() => {
    const selectedPackageFields = fieldSectionState[RECORD_TYPES.PACKAGE].allSelected
      || fieldSectionState[RECORD_TYPES.PACKAGE].selectedFields.length > 0;

    const selectedTitleFields = fieldSectionState[RECORD_TYPES.RESOURCE].allSelected
      || fieldSectionState[RECORD_TYPES.RESOURCE].selectedFields.length > 0;

    return selectedPackageFields || selectedTitleFields;
  }, [fieldSectionState]);

  const getFieldsForRecord = (_recordType) => {
    let fields = [];

    if (fieldSectionState[_recordType].allSelected) {
      fields = FIELDS_BY_RECORD_TYPE[_recordType];
    } else {
      fields = fieldSectionState[_recordType].selectedFields;
    }

    return fields.map(field => field.value);
  };

  const onExportConfirm = () => {
    doExport({
      recordId,
      recordType,
      packageFields: formatExportFieldsPayload(getFieldsForRecord(RECORD_TYPES.PACKAGE), RECORD_TYPES.PACKAGE),
      titleFields: formatExportFieldsPayload(getFieldsForRecord(RECORD_TYPES.RESOURCE), RECORD_TYPES.RESOURCE),
      titleSearchFilters,
    });
    onClose();
  };

  const getChangeHandler = (name) => (sectionState) => {
    setFieldSectionState(state => ({
      ...state,
      [name]: sectionState,
    }));
  };

  return (
    <Modal
      open={open}
      size="medium"
      label={intl.formatMessage({ id: 'ui-eholdings.exportPackageResources.label' })}
      id="eholdings-export-modal"
      data-testid="eholdings-export-modal"
      aria-label={intl.formatMessage({ id: 'ui-eholdings.exportPackageResources.label' })}
      footer={(
        <ModalFooter>
          <Button
            buttonStyle="primary"
            disabled={!canExport}
            onClick={onExportConfirm}
            data-testid="export-button"
          >
            {intl.formatMessage({ id: 'ui-eholdings.exportPackageResources.button.export' })}
          </Button>
          <Button
            onClick={onClose}
          >
            {intl.formatMessage({ id: 'ui-eholdings.exportPackageResources.button.cancel' })}
          </Button>
        </ModalFooter>
    )}
    >
      <p>{intl.formatMessage({ id: 'ui-eholdings.exportPackageResources.subtitle' })}</p>
      <ExportFieldsSection
        id="package-fields"
        title={intl.formatMessage({ id: 'ui-eholdings.exportPackageResources.fields.package' })}
        options={FIELDS_BY_RECORD_TYPE[RECORD_TYPES.PACKAGE]}
        name="packageFields"
        onChange={getChangeHandler(RECORD_TYPES.PACKAGE)}
        sectionState={fieldSectionState[RECORD_TYPES.PACKAGE]}
      />
      <ExportFieldsSection
        id="title-fields"
        title={intl.formatMessage({ id: 'ui-eholdings.exportPackageResources.fields.title' })}
        options={FIELDS_BY_RECORD_TYPE[RECORD_TYPES.RESOURCE]}
        name="titleFields"
        onChange={getChangeHandler(RECORD_TYPES.RESOURCE)}
        sectionState={fieldSectionState[RECORD_TYPES.RESOURCE]}
      />
    </Modal>
  );
};

ExportPackageResourcesModal.propTypes = propTypes;

export default ExportPackageResourcesModal;

