import {
  useEffect,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-final-form';
import createFocusDecorator from 'final-form-focus';
import { Icon } from '@folio/stripes/components';
import { useStripes } from '@folio/stripes/core';
import { FormattedMessage } from 'react-intl';

import SettingsForm from '../settings-form';
import RootProxySelectField from './_fields/root-proxy-select';
import { rootProxy as rootProxyShapes } from '../../../constants';

const focusOnErrors = createFocusDecorator();

const SettingsRootProxy = ({
  onSubmit,
  proxyTypes,
  rootProxy,
}) => {
  const stripes = useStripes();
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    if (rootProxy.isUpdated) {
      setToasts(prevToasts => {
        return [
          ...prevToasts,
          {
            id: `root-proxy-${rootProxy.id}`,
            message: <FormattedMessage id="ui-eholdings.settings.rootProxy.updated" />,
            type: 'success',
          },
        ];
      });
    }
  }, [rootProxy]);

  useEffect(() => {
    if (rootProxy.errors.length > 0) {
      setToasts(prevToasts => {
        return [
          ...prevToasts,
          ...rootProxy.errors.map(error => ({
            id: `root-proxy-${rootProxy.id}`,
            message: error.title,
            type: 'error',
          })),
        ];
      });
    }
  }, [rootProxy]);

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={{
        rootProxyServer: rootProxy.data?.attributes?.proxyTypeId,
      }}
      decorators={[focusOnErrors]}
      render={(formState) => (
        <SettingsForm
          data-test-eholdings-settings-root-proxy
          data-testid="settings-root-proxy-form"
          id="root-proxy-form"
          formState={formState}
          updateIsPending={rootProxy.isLoading}
          title={<FormattedMessage id="ui-eholdings.settings.rootProxy" />}
          toasts={toasts}
          hasFooter={stripes.hasPerm('ui-eholdings.settings.root-proxy')}
        >
          {proxyTypes.isLoading
            ? (
              <Icon icon="spinner-ellipsis" />
            )
            : (
              <div data-test-eholdings-settings-root-proxy-select>
                <RootProxySelectField
                  proxyTypes={proxyTypes}
                  value={formState.values.rootProxyServer}
                />
              </div>
            )
          }

          <p><FormattedMessage id="ui-eholdings.settings.rootProxy.ebsco.customer.message" /></p>

          <p><FormattedMessage id="ui-eholdings.settings.rootProxy.warning" /></p>
        </SettingsForm>
      )}
    />
  );
};

SettingsRootProxy.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  proxyTypes: PropTypes.shape({
    errors: PropTypes.array.isRequired,
    isFailed: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    items: PropTypes.arrayOf(PropTypes.shape({
      attributes: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
      }).isRequired,
      id: PropTypes.string.isRequired,
    })),
  }).isRequired,
  rootProxy: rootProxyShapes.RootProxyReduxStateShape.isRequired,
};

export default SettingsRootProxy;
