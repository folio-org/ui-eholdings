import React from 'react';
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
} from '@folio/stripes/components';
import { EditableList } from '@folio/stripes/smart-components';

const SettingsAccessStatusTypes = ({
  accessTypesData,
  onCreate,
  onDelete,
  onUpdate,
}) => {
  const onCreateItem = ({ attributes }) => onCreate({
    type: 'accessTypes',
    attributes,
  });

  const formatter = {
    name: ({ attributes }) => (attributes?.name ?? '-'),
    description: ({ attributes }) => (attributes?.description ?? '-'),
    lastUpdated: (data) => {
      const user = data.updater ?? data.creator;

      return (
        <FormattedMessage
          id="ui-eholdings.settings.accessStatusTypes.lastUpdated.data"
          values={{
            date: <FormattedDate value={data.metadata?.updatedDate} />,
            name: `${user?.lastName} ${user?.firstName}`,
          }}
        />
      );
    },
    records: () => <NoValue />
  };

  // eslint-disable-next-line react/prop-types
  const renderField = ({ fieldIndex, rowIndex, name }, validate) => {
    const dataAttr = { [`data-test-settings-access-type-${name}-field`]: true };

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
          autoFocus={name === 'name'}
        />
      </div>
    );
  };

  const nameValidation = value => {
    if (!value) {
      return <FormattedMessage id="ui-eholdings.settings.accessStatusTypes.type.validation" />;
    } else if (value && value.length > 75) {
      return <FormattedMessage
        id="ui-eholdings.settings.accessStatusTypes.validation"
        values={{ limit: 75 }}
      />;
    } else {
      return null;
    }
  };

  const descriptionValidation = value => {
    if (value && value.length > 150) {
      return <FormattedMessage
        id="ui-eholdings.settings.accessStatusTypes.validation"
        values={{ limit: 150 }}
      />;
    } else {
      return null;
    }
  };

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
            actionProps={accessTypesData && accessTypesData.length >= 15 ? { create: () => ({ disabled: true }) } : {}}
            columnMapping={{
              name: intl.formatMessage({ id: 'ui-eholdings.settings.accessStatusTypes.type' }),
              description: intl.formatMessage({ id: 'ui-eholdings.settings.accessStatusTypes.description' }),
              lastUpdated: intl.formatMessage({ id: 'ui-eholdings.settings.accessStatusTypes.lastUpdated' }),
              records: intl.formatMessage({ id: 'ui-eholdings.settings.accessStatusTypes.records' }),
            }}
            contentData={accessTypesData}
            createButtonLabel={intl.formatMessage({ id: 'ui-eholdings.new' })}
            fieldComponents={{
              name: item => renderField(item, nameValidation),
              description: item => renderField(item, descriptionValidation),
            }}
            formatter={formatter}
            label={intl.formatMessage({ id: 'ui-eholdings.settings.accessStatusTypes' })}
            onCreate={onCreateItem}
            onDelete={onDelete}
            onUpdate={onUpdate}
            readOnlyFields={['lastUpdated', 'records']}
            visibleFields={['name', 'description', 'lastUpdated', 'records']}
          />
        )}
      </IntlConsumer>
    </Pane>
  );
};

SettingsAccessStatusTypes.propTypes = {
  accessTypesData: PropTypes.arrayOf(PropTypes.shape({
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
  onCreate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default SettingsAccessStatusTypes;
