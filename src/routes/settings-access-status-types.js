import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import { Icon } from '@folio/stripes/components';
import { TitleManager } from '@folio/stripes/core';

import View from '../components/settings/settings-access-status-types';
import selectPropFromData from '../redux/selectors/select-prop-from-data';
import {
  getAccessTypes as getAccessTypesAction,
  attachAccessType as attachAccessTypeAction,
  deleteAccessType as deleteAccessTypeAction,
  updateAccessType as updateAccessTypeAction,
} from '../redux/actions';

const SettingsAccessStatusTypesRoute = ({
  accessTypes,
  getAccessTypes,
  attachAccessType,
  deleteAccessType,
  updateAccessType,
}) => {
  const { items: { data } } = accessTypes;

  useEffect(() => {
    if (!data) {
      getAccessTypes();
    }
  }, [data, getAccessTypes]);

  return (
    <FormattedMessage id="ui-eholdings.label.settings">
      {pageLabel => (
        <FormattedMessage id="ui-eholdings.settings.accessStatusTypes">
          {recordLabel => (
            <TitleManager
              page={pageLabel}
              record={recordLabel}
            >
              {data ? (
                <View
                  accessTypesData={data}
                  onCreate={attachAccessType}
                  onDelete={deleteAccessType}
                  onUpdate={updateAccessType}
                />
              ) : (
                <Icon
                  icon='spinner-ellipsis'
                  size='large'
                />
              )}
            </TitleManager>
          )}
        </FormattedMessage>
      )}
    </FormattedMessage>
  );
};

SettingsAccessStatusTypesRoute.propTypes = {
  accessTypes: PropTypes.shape({
    items: PropTypes.shape({
      data: PropTypes.array,
    }),
  }),
  attachAccessType: PropTypes.func.isRequired,
  deleteAccessType: PropTypes.func.isRequired,
  getAccessTypes: PropTypes.func.isRequired,
  updateAccessType: PropTypes.func.isRequired,
};

SettingsAccessStatusTypesRoute.defaultProps = {
  accessTypes: {
    items: { data: [] },
  }
};

export default connect(
  (store) => ({
    accessTypes: selectPropFromData(store, 'accessTypes'),
  }), {
    getAccessTypes: getAccessTypesAction,
    attachAccessType: attachAccessTypeAction,
    deleteAccessType: deleteAccessTypeAction,
    updateAccessType: updateAccessTypeAction,
  }
)(SettingsAccessStatusTypesRoute);