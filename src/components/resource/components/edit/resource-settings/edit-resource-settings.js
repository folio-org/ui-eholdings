import PropTypes from 'prop-types';
import {
  FormattedMessage,
} from 'react-intl';
import hasIn from 'lodash/hasIn';

import {
  Accordion,
  Icon,
  Row,
  Col,
} from '@folio/stripes/components';

import VisibilityField from '../../../_fields/visibility';
import AccessTypeEditSection from '../../../../access-type-edit-section';
import ProxySelectField from '../../../../proxy-select';
import CustomUrlFields from '../../../../custom-url-fields';

const propTypes = {
  accessStatusTypes: PropTypes.object.isRequired,
  getSectionHeader: PropTypes.func.isRequired,
  handleSectionToggle: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  model: PropTypes.object.isRequired,
  proxyTypes: PropTypes.object.isRequired,
  resourceIsCustom: PropTypes.bool,
  resourceSelected: PropTypes.bool.isRequired,
};

const EditResourceSettings = ({
  isOpen,
  getSectionHeader,
  handleSectionToggle,
  proxyTypes,
  model,
  accessStatusTypes,
  resourceIsCustom = false,
  resourceSelected,
}) => {
  const renderFields = (resourceIsCustom && resourceSelected) || !resourceIsCustom;
  const hasInheritedProxy = hasIn(model, 'package.proxy.id');
  const visibilityMessage = model.package.visibilityData.isHidden
    ? <FormattedMessage id="ui-eholdings.resource.visibilityData.isHidden" />
    : model.visibilityData.reason && `(${model.visibilityData.reason})`;

  const getAccordionContent = () => {
    if (!proxyTypes.request.isResolved) {
      return <Icon icon="spinner-ellipsis" />;
    }

    return (
      <div data-test-eholdings-resource-proxy-select>
        <ProxySelectField
          proxyTypes={proxyTypes}
          inheritedProxyId={model.package.proxy.id}
        />
      </div>
    );
  };

  return (
    <Accordion
      label={getSectionHeader('ui-eholdings.resource.resourceSettings')}
      open={isOpen}
      id="resourceShowSettings"
      onToggle={handleSectionToggle}
    >
      {renderFields
        ? (
          <Row>
            <Col xs={3}>
              <VisibilityField disabled={visibilityMessage} />
            </Col>
            <Col xs={9}>
              <Row>
                {hasInheritedProxy && (
                  <Col xs={4}>
                    {getAccordionContent()}
                  </Col>
                )}
                {model.package.isCustom && (
                  <Col xs={4}>
                    <CustomUrlFields />
                  </Col>
                )}
                <Col xs={4}>
                  <AccessTypeEditSection accessStatusTypes={accessStatusTypes} />
                </Col>
              </Row>
            </Col>
          </Row>
        )
        : (
          <p data-test-eholdings-resource-edit-settings-message>
            <FormattedMessage id="ui-eholdings.resource.resourceSettings.notSelected" />
          </p>
        )
      }
    </Accordion>
  );
};

EditResourceSettings.propTypes = propTypes;

export default EditResourceSettings;
