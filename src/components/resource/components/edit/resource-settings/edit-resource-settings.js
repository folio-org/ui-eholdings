import PropTypes from 'prop-types';
import {
  FormattedMessage,
} from 'react-intl';
import hasIn from 'lodash/hasIn';

import {
  Accordion,
  Icon,
} from '@folio/stripes/components';

import VisibilityField from '../../../_fields/visibility';
import AccessTypeEditSection from '../../../../access-type-edit-section';
import ProxySelectField from '../../../../proxy-select';
import CustomUrlFields from '../../../_fields/custom-url';

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
  resourceIsCustom,
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
          <>
            <VisibilityField disabled={visibilityMessage} />
            <div>
              {hasInheritedProxy && getAccordionContent()}
              {resourceIsCustom && <CustomUrlFields />}
              <AccessTypeEditSection accessStatusTypes={accessStatusTypes} />
            </div>
          </>
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

EditResourceSettings.defaultProps = {
  resourceIsCustom: false,
};

export default EditResourceSettings;
