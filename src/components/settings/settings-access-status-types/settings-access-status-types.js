/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import { sortBy, noop } from 'lodash';

import SafeHTMLMessage from '@folio/react-intl-safe-html';
import { useStripes } from '@folio/stripes/core';
import {
  Pane,
  PaneCloseLink,
  NoValue,
  TextField,
  ConfirmationModal,
  FormattedDate,
} from '@folio/stripes/components';
import { EditableList } from '@folio/stripes/smart-components';

import Toaster from '../../toaster';

import { accessStatusTypeDataShape } from '../../../constants/accessTypesReduxStateShape';
import {
  SETTINGS_ACCESS_STATUS_TYPES_NAME_MAX_LENGTH,
  SETTINGS_ACCESS_STATUS_TYPES_DESCRIPTION_MAX_LENGTH,
} from '../../../constants';

const SettingsAccessStatusTypes = ({
  accessTypesData,
  onCreate,
  onDelete,
  onUpdate,
  confirmDelete,
  kbId,
}) => {
  const stripes = useStripes();
  const intl = useIntl();

  const MAX_ACCESS_STATUS_TYPES_COUNT = 15;

  const [isConfirmDialogShown, setShowConfirmDialog] = useState(false);
  const [selectedStatusType, setSelectedStatusType] = useState(null);
  const [toasts, setToasts] = useState([]);

  const onCreateItem = ({ attributes }) => {
    onCreate({
      type: 'accessTypes',
      attributes,
    }, kbId);
  };

  const onUpdateItem = accessType => onUpdate(accessType, kbId);

  useEffect(() => {
    const errorsLength = accessTypesData.errors.length;

    if (errorsLength) {
      const lastErrorTitle = accessTypesData.errors[errorsLength - 1].title;

      if (lastErrorTitle.endsWith('not found')) {
        setToasts(currentToasts => [
          ...currentToasts,
          {
            id: `access-type-delete-failure-${Date.now()}`,
            message: <FormattedMessage id="ui-eholdings.settings.accessStatusTypes.delete.error" />,
            type: 'error',
          },
        ]);

        setSelectedStatusType(null);
        setShowConfirmDialog(false);
      }
    }
  }, [accessTypesData.errors]);

  const formatter = {
    name: ({ attributes }) => (attributes?.name ?? <NoValue />),
    description: ({ attributes }) => (attributes?.description ?? <NoValue />),
    lastUpdated: (data) => {
      const user = data.updater ?? data.creator;

      return data.metadata
        ? (
          <FormattedMessage
            id="ui-eholdings.settings.accessStatusTypes.lastUpdated.data"
            values={{
              date: <FormattedDate value={data.metadata.updatedDate} />,
              name: `${user?.lastName} ${user?.firstName}`,
            }}
          />
        )
        : <NoValue />;
    },
    // records will be done after MODKBEKBJ-378
    records: ({ usageNumber }) => usageNumber || <NoValue />,
  };

  // eslint-disable-next-line react/prop-types
  const renderField = ({ fieldIndex, rowIndex, name }, validate) => {
    const dataAttr = { [`data-test-settings-access-type-${name}-field`]: true };
    const isNameField = name === 'name';
    const labelTranslationId = isNameField
      ? 'ui-eholdings.settings.accessStatusTypes.type'
      : 'ui-eholdings.settings.accessStatusTypes.description';

    return (
      <div
        {...dataAttr}
        key={fieldIndex}
      >
        <FormattedMessage id={labelTranslationId}>
          {label => (
            <Field
              component={TextField}
              name={`items[${rowIndex}].attributes.${name}`}
              validate={validate}
              marginBottom0
              fullWidth
              autoFocus={isNameField}
              aria-label={label}
            />
          )}
        </FormattedMessage>
      </div>
    );
  };

  const showConfirmDialog = (id) => {
    const accessTypeToDelete = accessTypesData.items.find(type => type.id === id);

    if (!accessTypeToDelete) {
      return;
    }

    setSelectedStatusType(accessTypeToDelete);
    setShowConfirmDialog(true);
  };

  const hideConfirmDialog = () => {
    setSelectedStatusType(null);
    setShowConfirmDialog(false);
  };

  const deleteStatusType = () => {
    onDelete(selectedStatusType, kbId);
  };

  const nameValidation = (value) => {
    if (!value) {
      return <FormattedMessage id="ui-eholdings.settings.accessStatusTypes.type.validation" />;
    }

    if (value && value.length > SETTINGS_ACCESS_STATUS_TYPES_NAME_MAX_LENGTH) {
      return <FormattedMessage
        id="ui-eholdings.settings.accessStatusTypes.validation"
        values={{ limit: SETTINGS_ACCESS_STATUS_TYPES_NAME_MAX_LENGTH }}
      />;
    }

    if (value && accessTypesData.items.find(accessType => accessType.attributes.name === value)) {
      return <FormattedMessage id="ui-eholdings.settings.accessStatusTypes.validation.duplicate" />;
    }

    return null;
  };

  const descriptionValidation = (value) => {
    if (value && value.length > SETTINGS_ACCESS_STATUS_TYPES_DESCRIPTION_MAX_LENGTH) {
      return <FormattedMessage
        id="ui-eholdings.settings.accessStatusTypes.validation"
        values={{ limit: SETTINGS_ACCESS_STATUS_TYPES_DESCRIPTION_MAX_LENGTH }}
      />;
    }

    return null;
  };

  const sortedItems = sortBy(accessTypesData?.items || [], [(item) => item.attributes.name.toLowerCase()]);

  if (accessTypesData.isDeleted && !!selectedStatusType) {
    // access status type delete successful
    confirmDelete();
    setSelectedStatusType(null);
    setShowConfirmDialog(false);

    setToasts([
      ...toasts,
      {
        id: `success-access-type-deleted-${selectedStatusType.id}`,
        message: (
          <FormattedMessage
            id="ui-eholdings.settings.accessStatusTypes.delete.toast"
            values={{ name: selectedStatusType.attributes.name }}
          />
        ),
        type: 'success',
      },
    ]);
  }

  const canDelete = stripes.hasPerm('ui-eholdings.settings.access-types.all');
  const canCreateAndEdit = stripes.hasPerm('ui-eholdings.settings.access-types.create-edit');

  const isMaxAccessTypesNumberReached = accessTypesData?.items?.length >= MAX_ACCESS_STATUS_TYPES_COUNT;
  const isCreateButtonDisabled = isMaxAccessTypesNumberReached || !canCreateAndEdit;
  const isListEditable = canDelete || canCreateAndEdit;

  const actionProps = {
    create: isCreateButtonDisabled ? () => ({ disabled: true }) : {},
    delete: item => ({ onClick: () => showConfirmDialog(item.id) }),
  };

  return (
    <Pane
      id="settings-access-status-types-paneset"
      paneTitle={<FormattedMessage id="ui-eholdings.settings.accessStatusTypes" />}
      data-test-settings-access-status-types
      data-testid="settings-access-status-types"
      firstMenu={(
        <FormattedMessage id="ui-eholdings.settings.goBackToEholdings">
          {([ariaLabel]) => (
            <PaneCloseLink
              ariaLabel={ariaLabel}
              to="/settings/eholdings"
            />
          )}
        </FormattedMessage>
      )}
    >
      <EditableList
        formType="final-form"
        editable={isListEditable}
        actionProps={actionProps}
        columnMapping={{
          name: intl.formatMessage({ id: 'ui-eholdings.settings.accessStatusTypes.type' }),
          description: intl.formatMessage({ id: 'ui-eholdings.settings.accessStatusTypes.description' }),
          lastUpdated: intl.formatMessage({ id: 'ui-eholdings.settings.accessStatusTypes.lastUpdated' }),
          records: intl.formatMessage({ id: 'ui-eholdings.settings.accessStatusTypes.records' }),
        }}
        contentData={sortedItems}
        createButtonLabel={intl.formatMessage({ id: 'ui-eholdings.new' })}
        fieldComponents={{
          name: item => renderField(item, nameValidation),
          description: item => renderField(item, descriptionValidation),
        }}
        formatter={formatter}
        label={intl.formatMessage({ id: 'ui-eholdings.settings.accessStatusTypes' })}
        onCreate={onCreateItem}
        onDelete={showConfirmDialog}
        onSubmit={noop}
        onUpdate={onUpdateItem}
        readOnlyFields={['lastUpdated', 'records']}
        visibleFields={['name', 'description', 'lastUpdated', 'records']}
        actionSuppression={{
          delete: accessType => accessType.usageNumber || !canDelete,
          edit: () => !canCreateAndEdit,
        }}
      />
      <ConfirmationModal
        id="delete-access-status-type-confirmation-modal"
        heading={<FormattedMessage id="ui-eholdings.settings.accessStatusTypes.delete" />}
        ariaLabel={intl.formatMessage({ id: 'ui-eholdings.settings.accessStatusTypes.delete' })}
        message={
          <SafeHTMLMessage
            id="ui-eholdings.settings.accessStatusTypes.delete.description"
            values={{ name: selectedStatusType?.attributes?.name || '' }}
          />
        }
        confirmLabel={<FormattedMessage id="ui-eholdings.settings.accessStatusTypes.delete.confirm" />}
        cancelLabel={<FormattedMessage id="ui-eholdings.settings.accessStatusTypes.delete.cancel" />}
        onConfirm={deleteStatusType}
        onCancel={hideConfirmDialog}
        open={isConfirmDialogShown}
      />
      <Toaster
        toasts={toasts}
        position="bottom"
      />
    </Pane>
  );
};

SettingsAccessStatusTypes.propTypes = {
  accessTypesData: PropTypes.shape({
    errors: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired,
    isDeleted: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    items: PropTypes.arrayOf(accessStatusTypeDataShape),
  }),
  confirmDelete: PropTypes.func.isRequired,
  kbId: PropTypes.string.isRequired,
  onCreate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default SettingsAccessStatusTypes;
