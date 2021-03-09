import React from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
} from 'react-intl';
import hasIn from 'lodash/fp/hasIn';

import {
  Accordion,
  Headline,
  Icon,
  KeyValue,
} from '@folio/stripes/components';

import ProxyDisplay from '../../../../proxy-display';
import TokenDisplay from '../../../../token-display';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  model: PropTypes.object.isRequired,
  onToggle: PropTypes.func.isRequired,
  proxyTypes: PropTypes.object.isRequired,
  rootProxy: PropTypes.object.isRequired,
};

const ProviderSettings = ({
  isOpen,
  onToggle,
  proxyTypes,
  rootProxy,
  model,
}) => {
  const hasProxy = hasIn('proxy.id', model);
  const hasToken = hasIn('providerToken.prompt', model);
  const hasProviderSettings = hasProxy || hasToken;

  if (!hasProviderSettings) {
    return null;
  }

  const renderProxy = () => {
    const proxyIsLoading = !proxyTypes.request.isResolved || !rootProxy.request.isResolved || model.isLoading;

    return proxyIsLoading
      ? (
        <Icon
          icon="spinner-ellipsis"
          data-testid="proxy-spinner"
        />
      )
      : (
        <ProxyDisplay
          proxy={model.proxy}
          proxyTypes={proxyTypes}
          inheritedProxyId={rootProxy.data.attributes.proxyTypeId}
        />
      );
  };

  const renderToken = () => {
    return model.isLoading
      ? (
        <Icon
          icon="spinner-ellipsis"
          data-testid="token-spinner"
        />
      )
      : (
        <KeyValue label={<FormattedMessage id="ui-eholdings.provider.token" />}>
          <TokenDisplay
            token={model.providerToken}
            type="provider"
          />
        </KeyValue>
      );
  };

  return (
    <Accordion
      label={(
        <Headline
          size="large"
          tag="h3"
        >
          <FormattedMessage id="ui-eholdings.provider.providerSettings" />
        </Headline>
      )}
      open={isOpen}
      id="providerShowProviderSettings"
      onToggle={onToggle}
    >
      {hasProxy && renderProxy()}
      {hasToken && renderToken()}
    </Accordion>
  );
};

ProviderSettings.propTypes = propTypes;

export default ProviderSettings;
