import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import hasIn from 'lodash/fp/hasIn';

import {
  Accordion,
  Headline,
  Icon,
  Row,
  Col,
} from '@folio/stripes/components';

import ProxyDisplay from '../../../../proxy-display';
import AccessTypeDisplay from '../../../../access-type-display';
import {
  AutomaticallySelectTitles,
  ProviderToken,
  PackageToken,
  CustomAlternateNames,
  VisibilityView,
} from './fields';

import { getAccessTypeId } from '../../../../utilities';

import {
  accessTypesReduxStateShape,
  MAX_COLUMN_WIDTH,
  ONE_THIRD_OF_COLUMN_WIDTH,
  QUARTER_OF_COLUMN_WIDTH,
} from '../../../../../constants';

const propTypes = {
  accessStatusTypes: accessTypesReduxStateShape.isRequired,
  isOpen: PropTypes.bool.isRequired,
  model: PropTypes.object.isRequired,
  onToggle: PropTypes.func.isRequired,
  packageAllowedToAddTitles: PropTypes.bool.isRequired,
  packageSelected: PropTypes.bool.isRequired,
  provider: PropTypes.object.isRequired,
  proxyTypes: PropTypes.object.isRequired,
};

const PackageSettings = ({
  isOpen,
  onToggle,
  model,
  proxyTypes,
  provider,
  accessStatusTypes,
  packageAllowedToAddTitles,
  packageSelected,
}) => {
  const renderPackageSettings = () => {
    const hasProxy = hasIn('proxy.id', model);
    const hasProviderToken = hasIn('providerToken.prompt', provider);
    const hasPackageToken = hasIn('packageToken.prompt', model);
    const isProxyAvailable = hasProxy && proxyTypes.request.isResolved && model.isLoaded && provider.isLoaded;
    const haveAccessTypesLoaded = !accessStatusTypes?.isLoading && !model.isLoading;
    const isAccessStatusTypes = accessStatusTypes?.items?.data?.length > 0;

    const packageSettingsColumnWidth = isAccessStatusTypes
      ? MAX_COLUMN_WIDTH
      : ONE_THIRD_OF_COLUMN_WIDTH;

    const proxyAndAccessStatusTypeColumnWidth = isAccessStatusTypes
      ? QUARTER_OF_COLUMN_WIDTH
      : MAX_COLUMN_WIDTH;

    return (
      <>
        <Row>
          <Col xs>
            <Row>
              <Col xs={6}>
                <VisibilityView visibility={model.visibility} />
              </Col>
              {!model.isCustom && (
                <Col xs={6}>
                  <AutomaticallySelectTitles packageAllowedToAddTitles={packageAllowedToAddTitles} />
                </Col>
              )}
            </Row>
          </Col>
          <Col xs={packageSettingsColumnWidth}>
            <Row>
              <Col xs={proxyAndAccessStatusTypeColumnWidth}>
                {isProxyAvailable
                  ? (
                    <ProxyDisplay
                      proxy={model.proxy}
                      proxyTypesRecords={proxyTypes.resolver.state.proxyTypes.records}
                      inheritedProxyId={provider?.proxy?.id || ''}
                    />
                  )
                  : <Icon icon="spinner-ellipsis" />
                }
              </Col>
              {isAccessStatusTypes && (
                <Col xsOffset={3} xs={proxyAndAccessStatusTypeColumnWidth}>
                  {haveAccessTypesLoaded
                    ? (
                      <AccessTypeDisplay
                        accessTypeId={getAccessTypeId(model)}
                        accessStatusTypes={accessStatusTypes}
                      />
                    )
                    : <Icon icon="spinner-ellipsis" />
                  }
                </Col>
              )}
            </Row>
          </Col>
        </Row>
        <Row>
          <Col xs>
            <CustomAlternateNames customAltNames={model.customAltNames} />
          </Col>
        </Row>
        {hasProviderToken && (
          <ProviderToken provider={provider} />
        )}
        {hasPackageToken && (
          <PackageToken packageLoading={model.isLoading} packageToken={model.packageToken} />
        )}
      </>
    );
  };

  return (
    <Accordion
      label={(
        <Headline
          size="large"
          tag="h3"
        >
          <FormattedMessage id="ui-eholdings.package.packageSettings" />
        </Headline>
      )}
      open={isOpen}
      id="packageShowSettings"
      onToggle={onToggle}
    >
      {packageSelected
        ? renderPackageSettings()
        : <p><FormattedMessage id="ui-eholdings.package.visibility.notSelected" /></p>
      }
    </Accordion>
  );
};

PackageSettings.propTypes = propTypes;

export default PackageSettings;
