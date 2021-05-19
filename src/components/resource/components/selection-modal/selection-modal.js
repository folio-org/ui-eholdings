import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import PropTypes from 'prop-types';

import {
  Button,
  Modal,
  ModalFooter,
} from '@folio/stripes/components';

const propTypes = {
  cancelSelectionToggle: PropTypes.func.isRequired,
  change: PropTypes.object.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  handelDeleteConfirmation: PropTypes.func.isRequired,
  modelIsUpdating: PropTypes.bool.isRequired,
  showSelectionModal: PropTypes.bool.isRequired,
};

const SelectionModal = ({
  showSelectionModal,
  modelIsUpdating,
  handelDeleteConfirmation,
  cancelSelectionToggle,
  change,
  children,
}) => {
  const intl = useIntl();

  return (
    <Modal
      open={showSelectionModal}
      size="small"
      label={<FormattedMessage id="ui-eholdings.resource.modal.header" />}
      id="eholdings-resource-confirmation-modal"
      aria-label={intl.formatMessage({ id: 'ui-eholdings.resource.modal.header' })}
      footer={(
        <ModalFooter>
          <Button
            data-test-eholdings-deselection-confirmation-modal-yes
            buttonStyle="primary"
            disabled={modelIsUpdating}
            onClick={handelDeleteConfirmation}
          >
            {(modelIsUpdating ?
              <FormattedMessage id="ui-eholdings.resource.modal.buttonWorking" /> :
              <FormattedMessage id="ui-eholdings.resource.modal.buttonConfirm" />)}
          </Button>
          <Button
            data-test-eholdings-deselection-confirmation-modal-no
            onClick={() => cancelSelectionToggle(change)}
          >
            <FormattedMessage id="ui-eholdings.resource.modal.buttonCancel" />
          </Button>
        </ModalFooter>
    )}
    >
      {children}
    </Modal>
  );
};

SelectionModal.propTypes = propTypes;

export default SelectionModal;
