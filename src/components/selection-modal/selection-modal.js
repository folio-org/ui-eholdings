import PropTypes from 'prop-types';
import noop from 'lodash/noop';

import {
  Button,
  Modal,
  ModalFooter,
} from '@folio/stripes/components';

const propTypes = {
  cancelButtonLabel: PropTypes.oneOfType([PropTypes.node, PropTypes.string]).isRequired,
  cancelSelectionToggle: PropTypes.func.isRequired,
  change: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  confirmButtonLabel: PropTypes.oneOfType([PropTypes.node, PropTypes.string]).isRequired,
  handleDeleteConfirmation: PropTypes.func.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  modelIsUpdating: PropTypes.bool,
  showSelectionModal: PropTypes.bool.isRequired,
};

const defaultProps = {
  modelIsUpdating: false,
  change: noop,
};

const SelectionModal = ({
  showSelectionModal,
  modelIsUpdating,
  handleDeleteConfirmation,
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
      data-testid="eholdings-confirmation-modal"
      aria-label={label}
      footer={(
        <ModalFooter>
          <Button
            data-test-eholdings-deselection-confirmation-modal-yes
            data-testid="selection-modal-confirm-button"
            buttonStyle="primary"
            disabled={modelIsUpdating}
            onClick={handleDeleteConfirmation}
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
SelectionModal.defaultProps = defaultProps;

export default SelectionModal;
