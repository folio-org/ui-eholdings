import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  Headline,
  KeyValue,
  Icon,
  Row,
  Col,
} from '@folio/stripes/components';

import AccessTypeDisplay from '../../../access-type-display';
import ProxyDisplay from '../../../proxy-display';
import ExternalLink from '../../../external-link/external-link';

import {
  accessTypesReduxStateShape,
  MAX_COLUMN_WIDTH,
  ONE_THIRD_OF_COLUMN_WIDTH,
  QUARTER_OF_COLUMN_WIDTH,
} from '../../../../constants';

import { getAccessTypeId } from '../../../utilities';

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
  const isAccessStatusTypes = accessStatusTypes?.items?.data?.length > 0;

  const resourceSettingsColumnWidth = isAccessStatusTypes
    ? MAX_COLUMN_WIDTH
    : ONE_THIRD_OF_COLUMN_WIDTH;

  const proxyAndAccessStatusTypeColumnWidth = isAccessStatusTypes
    ? QUARTER_OF_COLUMN_WIDTH
    : MAX_COLUMN_WIDTH;

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
      <Row>
        <Col xs>
          <Row>
            <Col xs={6}>
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
            </Col>
            {model.url && (
              <Col xs={6}>
                <KeyValue label={model.package.isCustom
                  ? <FormattedMessage id="ui-eholdings.custom" />
                  : <FormattedMessage id="ui-eholdings.managed" />}
                >
                  <div data-test-eholdings-resource-show-url>
                    <ExternalLink
                      href={model.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  </div>
                </KeyValue>
              </Col>
            )}
          </Row>
        </Col>
        <Col xs={resourceSettingsColumnWidth}>
          <Row>
            {hasInheritedProxy && (
              <Col xs={proxyAndAccessStatusTypeColumnWidth}>
                {!proxyTypes.request.isResolved || model.isLoading
                  ? <Icon icon="spinner-ellipsis" />
                  : (
                    <ProxyDisplay
                      proxy={model.proxy}
                      proxyTypesRecords={proxyTypes.resolver.state.proxyTypes.records}
                      inheritedProxyId={model.package.proxy.id}
                    />
                  )}
              </Col>
            )}
            {isAccessStatusTypes && (
              <Col xsOffset={3} xs={proxyAndAccessStatusTypeColumnWidth}>
                <div data-test-eholdings-access-type>
                  {haveAccessTypesLoaded
                    ? (
                      <AccessTypeDisplay
                        accessTypeId={getAccessTypeId(model)}
                        accessStatusTypes={accessStatusTypes}
                      />
                    )
                    : <Icon icon="spinner-ellipsis" />
                  }
                </div>
              </Col>
            )}
          </Row>
        </Col>
      </Row>
    </Accordion>
  );
};

ResourceSettings.propTypes = propTypes;

export default ResourceSettings;
