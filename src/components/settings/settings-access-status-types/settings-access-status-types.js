import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import {
  FormattedMessage,
  FormattedDate,
} from 'react-intl';

import { IntlConsumer } from '@folio/stripes/core';
import {
  Pane,
  PaneCloseLink,
  NoValue,
  TextField,
  ConfirmationModal,
} from '@folio/stripes/components';
import { EditableList } from '@folio/stripes/smart-components';

import Toaster from '../../toaster';

const SettingsAccessStatusTypes = ({
  accessTypesData,
  onCreate,
  onDelete,
  onUpdate,
  confirmDelete,
}) => {
  const [isConfirmDialogShown, setShowConfirmDialog] = useState(false);
  const [selectedStatusType, setSelectedStatusType] = useState(null);
  const [toasts, setToasts] = useState([]);

  const onCreateItem = ({ attributes }) => onCreate({
    type: 'accessTypes',
    attributes,
  });

  const formatter = {
    name: ({ attributes }) => (attributes?.name ?? <NoValue />),
    description: ({ attributes }) => (attributes?.description ?? <NoValue />),
    lastUpdated: (data) => {
      const user = data.updater ?? data.creator;

      return data.metadata ? (
        <FormattedMessage
          id="ui-eholdings.settings.accessStatusTypes.lastUpdated.data"
          values={{
            date: <FormattedDate value={data.metadata.updatedDate} />,
            name: `${user?.lastName} ${user?.firstName}`,
          }}
        />
      ) : <NoValue />;
    },
    // records will be done after MODKBEKBJ-378
    records: () => <NoValue />
  };

  // eslint-disable-next-line react/prop-types
  const renderField = ({ fieldIndex, rowIndex, name }, validate) => {
    const dataAttr = { [`data-test-settings-access-type-${name}-field`]: true };
    const fieldForName = name === 'name';

    return (
      <div
        {...dataAttr}
        key={fieldIndex}
      >
        <Field
          component={TextField}
          name={`items[${rowIndex}].attributes.${name}`}
          validate={validate}
          marginBottom0
          fullWidth
          autoFocus={fieldForName}
        />
      </div>
    );
  };

  const showConfirmDialog = (id) => {
    const accessTypeToDelete = accessTypesData.items.find(type => type.id === id);

    if (!accessTypeToDelete) {
      return Promise.reject();
    }

    setSelectedStatusType(accessTypeToDelete);
    setShowConfirmDialog(true);

    return new Promise(() => {});
  };

  const hideConfirmDialog = () => {
    setSelectedStatusType(null);
    setShowConfirmDialog(false);
  };

  const deleteStatusType = () => {
    onDelete(selectedStatusType.id);
  };

  const nameValidation = value => {
    if (!value) {
      return <FormattedMessage id="ui-eholdings.settings.accessStatusTypes.type.validation" />;
    }

    if (value && value.length > 75) {
      return <FormattedMessage
        id="ui-eholdings.settings.accessStatusTypes.validation"
        values={{ limit: 75 }}
      />;
    }

    return null;
  };

  const descriptionValidation = value => {
    if (value && value.length > 150) {
      return <FormattedMessage
        id="ui-eholdings.settings.accessStatusTypes.validation"
        values={{ limit: 150 }}
      />;
    }

    return null;
  };

  if (accessTypesData.isDeleted && !!selectedStatusType) {
    // access status type delete successful
    confirmDelete();
    setSelectedStatusType(null);
    setShowConfirmDialog(false);

    setToasts([
      ...toasts,
      {
        id: `success-access-type-deleted-${selectedStatusType.id}`,
        message: <FormattedMessage id="ui-eholdings.settings.accessStatusTypes.delete.toast" values={{ name: selectedStatusType.attributes.name }} />,
        type: 'success'
      }
    ]);
  }

  return (
    <Pane
      paneTitle={<FormattedMessage id="ui-eholdings.settings.accessStatusTypes" />}
      data-test-settings-access-status-types
      defaultWidth="fill"
      firstMenu={(
        <FormattedMessage id="ui-eholdings.settings.goBackToEholdings">
          {ariaLabel => (
            <PaneCloseLink
              ariaLabel={ariaLabel}
              to="/settings/eholdings"
            />
          )}
        </FormattedMessage>
      )}
    >
      <IntlConsumer>
        {intl => (
          <EditableList
            actionProps={accessTypesData?.items?.length >= 15 ? { create: () => ({ disabled: true }) } : {}}
            columnMapping={{
              name: intl.formatMessage({ id: 'ui-eholdings.settings.accessStatusTypes.type' }),
              description: intl.formatMessage({ id: 'ui-eholdings.settings.accessStatusTypes.description' }),
              lastUpdated: intl.formatMessage({ id: 'ui-eholdings.settings.accessStatusTypes.lastUpdated' }),
              records: intl.formatMessage({ id: 'ui-eholdings.settings.accessStatusTypes.records' }),
            }}
            contentData={accessTypesData?.items || []}
            createButtonLabel={intl.formatMessage({ id: 'ui-eholdings.new' })}
            fieldComponents={{
              name: item => renderField(item, nameValidation),
              description: item => renderField(item, descriptionValidation),
            }}
            formatter={formatter}
            label={intl.formatMessage({ id: 'ui-eholdings.settings.accessStatusTypes' })}
            onCreate={onCreateItem}
            onDelete={showConfirmDialog}
            onUpdate={onUpdate}
            readOnlyFields={['lastUpdated', 'records']}
            visibleFields={['name', 'description', 'lastUpdated', 'records']}
          />
        )}
      </IntlConsumer>
      <ConfirmationModal
        id="delete-access-status-type-confirmation-modal"
        heading={<FormattedMessage id="ui-eholdings.settings.accessStatusTypes.delete" />}
        message={
          <FormattedMessage
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
    isDeleted: PropTypes.bool.isRequired,
    items: PropTypes.arrayOf(PropTypes.shape({
      attributes: PropTypes.shape({
        description: PropTypes.string,
        name: PropTypes.string.isRequired,
      }).isRequired,
      creator: PropTypes.objectOf(PropTypes.string),
      id: PropTypes.string.isRequired,
      metadata: PropTypes.shape({
        createdByUserId: PropTypes.string.isRequired,
        createdByUsername: PropTypes.string.isRequired,
        createdDate: PropTypes.string.isRequired,
        updatedByUserId: PropTypes.string,
        updatedDate: PropTypes.string,
      }),
      type: PropTypes.string.isRequired,
      updater: PropTypes.objectOf(PropTypes.string),
    })),
  }),
  confirmDelete: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default SettingsAccessStatusTypes;
