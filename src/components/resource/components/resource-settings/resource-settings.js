import React from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
} from 'react-intl';

import {
  Accordion,
  Headline,
  KeyValue,
  Icon,
} from '@folio/stripes/components';

import AccessTypeDisplay from '../../../access-type-display';
import ProxyDisplay from '../../../proxy-display';
import ExternalLink from '../../../external-link/external-link';
import {
  accessTypesReduxStateShape,
} from '../../../../constants';
import {
  getAccessTypeId,
} from '../../../utilities';

const propTypes = {
  accessStatusTypes: accessTypesReduxStateShape.isRequired,
  isOpen: PropTypes.bool.isRequired,
  model: PropTypes.object.isRequired,
  onToggle: PropTypes.func.isRequired,
  proxyTypes: PropTypes.object.isRequired,
  resourceSelected: PropTypes.bool.isRequired,
};

const ResourceSettings = ({
  isOpen,
  onToggle,
  model,
  resourceSelected,
  accessStatusTypes,
  proxyTypes,
}) => {
  const visibilityMessage = model.package.visibilityData.isHidden
    ? <FormattedMessage id="ui-eholdings.resource.visibilityData.isHidden" />
    : model.visibilityData.reason && `(${model.visibilityData.reason})`;

  const hasInheritedProxy = !!model.package?.proxy?.id;

  const haveAccessTypesLoaded = !accessStatusTypes?.isLoading && !model.isLoading;

  return (
    <Accordion
      label={(
        <Headline size="large" tag="h3">
          <FormattedMessage id="ui-eholdings.resource.resourceSettings" />
        </Headline>
      )}
      open={isOpen}
      id="resourceShowSettings"
      onToggle={onToggle}
    >
      <KeyValue label={<FormattedMessage id="ui-eholdings.label.showToPatrons" />}>
        <div
          data-test-eholdings-resource-show-visibility
          data-testid="resource-show-visibility"
        >
          {(model.visibilityData.isHidden || !resourceSelected)
            ? (
              <FormattedMessage
                id="ui-eholdings.package.visibility.no"
                values={{ visibilityMessage }}
              />
            )
            : <FormattedMessage id="ui-eholdings.yes" />
          }
        </div>
      </KeyValue>

      {
        hasInheritedProxy && (
          !proxyTypes.request.isResolved || model.isLoading
            ? (
              <Icon icon="spinner-ellipsis" />
            )
            : (
              <ProxyDisplay
                proxy={model.proxy}
                proxyTypes={proxyTypes}
                inheritedProxyId={model.package.proxy.id}
              />
            )
        )
      }

      {model.url && (
        <KeyValue label={model.title.isTitleCustom ?
          <FormattedMessage id="ui-eholdings.custom" />
          :
          <FormattedMessage id="ui-eholdings.managed" />}
        >
          <div data-test-eholdings-resource-show-url>
            <ExternalLink
              href={model.url}
              target="_blank"
              rel="noopener noreferrer"
            />
          </div>
        </KeyValue>
      )}

      {
        <div data-test-eholdings-access-type>
          {haveAccessTypesLoaded
            ? (
              <AccessTypeDisplay
                accessTypeId={getAccessTypeId(model)}
                accessStatusTypes={accessStatusTypes}
              />
            )
            : (
              <Icon icon="spinner-ellipsis" />
            )}
        </div>
      }
    </Accordion>
  );
};

ResourceSettings.propTypes = propTypes;

export default ResourceSettings;
