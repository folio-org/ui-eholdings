import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { useIntl } from 'react-intl';

import { TitleManager } from '@folio/stripes/core';

import View from '../../components/settings';
import ApplicationRoute from '../application-route';
import { KbCredentials } from '../../constants';

const SettingsRoute = ({
  children,
  kbCredentials,
  location,
}) => {
  const intl = useIntl();

  const sortKbCredentials = () => {
    const kbCredentialsItems = kbCredentials.items;

    return kbCredentialsItems.sort((a, b) => a.attributes.name.localeCompare(b.attributes.name));
  };

  return (
    <ApplicationRoute showSettings>
      <TitleManager page={intl.formatMessage({ id: 'ui-eholdings.label.settings' })}>
        <View
          location={location}
          kbCredentials={sortKbCredentials()}
        >
          {children}
        </View>
      </TitleManager>
    </ApplicationRoute>
  );
};

SettingsRoute.propTypes = {
  children: PropTypes.node.isRequired,
  kbCredentials: KbCredentials.KbCredentialsReduxStateShape,
  location: ReactRouterPropTypes.location.isRequired,
};

export default SettingsRoute;
