import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import ReactRouterPropTypes from 'react-router-prop-types';

import { Icon } from '@folio/stripes/components';
import {
  TitleManager,
  useStripes,
} from '@folio/stripes/core';

import View from '../../components/settings/settings-access-status-types';
import { selectPropFromData } from '../../redux/selectors';
import {
  getAccessTypes as getAccessTypesAction,
  attachAccessType as attachAccessTypeAction,
  deleteAccessType as deleteAccessTypeAction,
  updateAccessType as updateAccessTypeAction,
  confirmDeleteAccessType as confirmDeleteAccessTypeAction,
} from '../../redux/actions';

const SettingsAccessStatusTypesRoute = ({
  accessTypes,
  getAccessTypes,
  attachAccessType,
  deleteAccessType,
  updateAccessType,
  confirmDelete,
  match: { params },
  history,
}) => {
  const stripes = useStripes();
  const intl = useIntl();
  const { items: { data } } = accessTypes;

  if (!stripes.hasPerm('ui-eholdings.settings.access-types.view')) {
    history.push('/settings/eholdings');
  }

  useEffect(() => {
    if (!data) {
      getAccessTypes(params.kbId);
    }
  }, [data, getAccessTypes, params.kbId]);

  useEffect(() => {
    getAccessTypes(params.kbId);
  }, [getAccessTypes, params.kbId]);

  const pageLabel = intl.formatMessage({ id: 'ui-eholdings.label.settings' });
  const recordLabel = intl.formatMessage({ id: 'ui-eholdings.settings.accessStatusTypes' });

  return (
    <TitleManager
      page={pageLabel}
      record={recordLabel}
    >
      {data ? (
        <View
          accessTypesData={{
            ...accessTypes,
            items: data,
          }}
          onCreate={attachAccessType}
          onDelete={deleteAccessType}
          onUpdate={updateAccessType}
          confirmDelete={confirmDelete}
          kbId={params.kbId}
        />
      ) : (
        <Icon
          icon='spinner-ellipsis'
          size='large'
        />
      )}
    </TitleManager>
  );
};

SettingsAccessStatusTypesRoute.propTypes = {
  accessTypes: PropTypes.shape({
    isDeleted: PropTypes.bool.isRequired,
    items: PropTypes.shape({
      data: PropTypes.array,
    }),
  }),
  attachAccessType: PropTypes.func.isRequired,
  confirmDelete: PropTypes.func.isRequired,
  deleteAccessType: PropTypes.func.isRequired,
  getAccessTypes: PropTypes.func.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      kbId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  updateAccessType: PropTypes.func.isRequired,
};

SettingsAccessStatusTypesRoute.defaultProps = {
  accessTypes: {
    items: { data: [] },
  }
};

export default connect(
  (store) => ({
    accessTypes: selectPropFromData(store, 'accessStatusTypes'),
  }), {
    getAccessTypes: getAccessTypesAction,
    attachAccessType: attachAccessTypeAction,
    deleteAccessType: deleteAccessTypeAction,
    updateAccessType: updateAccessTypeAction,
    confirmDelete: confirmDeleteAccessTypeAction,
  }
)(withRouter(SettingsAccessStatusTypesRoute));
