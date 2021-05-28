import { Icon } from '@folio/stripes/components';

import AccessTypeField from '../access-type-field';
import { getAccessTypeIdsAndNames } from '../utilities';
import { accessTypesReduxStateShape } from '../../constants';

const propTypes = {
  accessStatusTypes: accessTypesReduxStateShape.isRequired,
};

const AccessStatusTypeEditSection = ({ accessStatusTypes }) => {
  if (!accessStatusTypes?.items?.data?.length) {
    return null;
  }

  const formattedAccessTypes = getAccessTypeIdsAndNames(accessStatusTypes.items.data);

  return accessStatusTypes.isLoading
    ? <Icon icon="spinner-ellipsis" />
    : <AccessTypeField accessStatusTypes={formattedAccessTypes} />;
};

AccessStatusTypeEditSection.propTypes = propTypes;

export default AccessStatusTypeEditSection;
