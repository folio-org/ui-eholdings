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
  PackageDisplayName,
} from './fields';
import { getAccessTypeId } from '../../../../utilities';
import { accessTypesReduxStateShape } from '../../../../../constants';
import { useProvider } from '../../../../../hooks';

const propTypes = {
  accessStatusTypes: accessTypesReduxStateShape.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isOpen: PropTypes.bool.isRequired,
  model: PropTypes.object.isRequired,
  onToggle: PropTypes.func.isRequired,
  packageAllowedToAddTitles: PropTypes.bool.isRequired,
  packageSelected: PropTypes.bool.isRequired,
  proxyTypes: PropTypes.object.isRequired,
};

const PackageSettings = ({
  isOpen,
  onToggle,
  model,
  isLoading,
  proxyTypes,
  accessStatusTypes,
  packageAllowedToAddTitles,
  packageSelected,
}) => {
  const { data: provider, isLoading: isProviderLoading } = useProvider({ providerId: model.providerId });

  const renderPackageSettings = () => {
    const hasProxy = hasIn('proxy.id', model);
    const hasProviderToken = hasIn('providerToken.prompt', provider);
    const hasPackageToken = hasIn('packageToken.prompt', model);
    const isProxyAvailable = hasProxy && proxyTypes.request.isResolved && !isLoading && !isProviderLoading;
    const haveAccessTypesLoaded = !accessStatusTypes?.isLoading && !model.isLoading;
    const isAccessStatusTypes = accessStatusTypes?.items?.data?.length > 0;

    return (
      <>
        <Row>
          <Col xs={3}>
            <VisibilityView visibility={model.visibility} />
          </Col>
          <Col xs={3}>
            {!model.isCustom && (
              <AutomaticallySelectTitles packageAllowedToAddTitles={packageAllowedToAddTitles} />
            )}
          </Col>
          <Col xs={3}>
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
            <Col xs={3}>
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
          <Col xs={3}>
            <PackageDisplayName packageDisplayName={model.customDisplayName} />
          </Col>
          <Col xs={3}>
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
