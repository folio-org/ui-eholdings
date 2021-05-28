import PropTypes from 'prop-types';
import {
  FormattedMessage,
} from 'react-intl';

import {
  Accordion,
  KeyValue,
} from '@folio/stripes/components';

import NameField from '../../../_fields/name';
import ContentTypeField from '../../../_fields/content-type';
import AccessTypeEditSection from '../../../../access-type-edit-section';

const propTypes = {
  accessStatusTypes: PropTypes.object.isRequired,
  getSectionHeader: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  model: PropTypes.object.isRequired,
  onToggle: PropTypes.func.isRequired,
  packageSelected: PropTypes.bool.isRequired,
};

const EditPackageInformation = ({
  isOpen,
  getSectionHeader,
  onToggle,
  packageSelected,
  model,
  accessStatusTypes,
}) => {
  return (
    <Accordion
      label={getSectionHeader('ui-eholdings.label.packageInformation')}
      open={isOpen}
      id="packageInfo"
      onToggle={onToggle}
    >
      {packageSelected
        ? <NameField />
        : (
          <KeyValue label={<FormattedMessage id="ui-eholdings.package.name" />}>
            <div data-test-eholdings-package-readonly-name-field>
              {model.name}
            </div>
          </KeyValue>
        )}

      {packageSelected
        ? <ContentTypeField />
        : (
          <KeyValue label={<FormattedMessage id="ui-eholdings.package.contentType" />}>
            <div data-test-eholdings-package-details-readonly-content-type>
              {model.contentType}
            </div>
          </KeyValue>
        )}
      <AccessTypeEditSection accessStatusTypes={accessStatusTypes} />
    </Accordion>
  );
};

EditPackageInformation.propTypes = propTypes;

export default EditPackageInformation;
