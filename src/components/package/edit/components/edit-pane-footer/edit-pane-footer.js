import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  PaneFooter,
} from '@folio/stripes/components';

const propTypes = {
  disabled: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
};

const EditPaneFooter = ({
  disabled,
  onCancel,
}) => {
  const cancelButton = (
    <Button
      data-test-eholdings-package-edit-cancel-button
      buttonStyle="default mega"
      disabled={disabled}
      onClick={onCancel}
      marginBottom0
    >
      <FormattedMessage id="stripes-components.cancel" />
    </Button>
  );

  const saveButton = (
    <Button
      buttonStyle="primary mega"
      data-test-eholdings-package-save-button
      disabled={disabled}
      marginBottom0
      type="submit"
    >
      <FormattedMessage id="stripes-components.saveAndClose" />
    </Button>
  );

  return (
    <PaneFooter
      renderStart={cancelButton}
      renderEnd={saveButton}
    />
  );
};

EditPaneFooter.propTypes = propTypes;

export default EditPaneFooter;
