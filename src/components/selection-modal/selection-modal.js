import PropTypes from 'prop-types';

import {
  Button,
  Modal,
  ModalFooter,
} from '@folio/stripes/components';

const propTypes = {
  cancelButtonLabel: PropTypes.oneOf([PropTypes.node, PropTypes.string]).isRequired,
  cancelSelectionToggle: PropTypes.func.isRequired,
  change: PropTypes.object.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  confirmButtonLabel: PropTypes.oneOf([PropTypes.node, PropTypes.string]).isRequired,
  handelDeleteConfirmation: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
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
  label,
  confirmButtonLabel,
  cancelButtonLabel,
}) => {
  return (
    <Modal
      open={showSelectionModal}
      size="small"
      label={label}
      id="eholdings-confirmation-modal"
      aria-label={label}
      footer={(
        <ModalFooter>
          <Button
            data-test-eholdings-deselection-confirmation-modal-yes
            data-testid="selection-modal-confirm-button"
            buttonStyle="primary"
            disabled={modelIsUpdating}
            onClick={handelDeleteConfirmation}
          >
            {confirmButtonLabel}
          </Button>
          <Button
            data-test-eholdings-deselection-confirmation-modal-no
            data-testid="selection-modal-cancel-button"
            onClick={() => cancelSelectionToggle(change)}
          >
            {cancelButtonLabel}
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
