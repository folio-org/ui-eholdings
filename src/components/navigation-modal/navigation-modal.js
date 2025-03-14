import {
  useEffect,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import noop from 'lodash/noop';

import {
  Modal,
  ModalFooter,
  Button,
} from '@folio/stripes/components';

import historyActions from '../../constants/historyActions';

const INITIAL_MODAL_STATE = {
  location: null,
  open: false,
};

const propTypes = {
  ariaLabel: PropTypes.string,
  historyAction: PropTypes.string,
  label: PropTypes.node,
  message: PropTypes.node,
  when: PropTypes.bool.isRequired,
};

const NavigationModal = ({
  ariaLabel,
  historyAction = '',
  label = <FormattedMessage id="ui-eholdings.navModal.modalLabel" />,
  message = <FormattedMessage id="ui-eholdings.navModal.unsavedChangesMsg" />,
  when,
}) => {
  const intl = useIntl();
  const history = useHistory();
  const [modalState, setModalState] = useState(INITIAL_MODAL_STATE);

  useEffect(() => {
    const unblock = history.block(location => {
      if (when) {
        setModalState({
          open: true,
          location,
        });
      }

      return !when;
    });

    return () => {
      unblock();
    };
  }, [history, when]);

  const onCancel = () => {
    setModalState(INITIAL_MODAL_STATE);
  };

  const onSubmit = event => {
    event.preventDefault();
    onCancel();
  };

  const navigateToNextLocation = () => {
    history.block(noop);

    if ((historyAction === historyActions.REPLACE)
      || history.action === historyActions.REPLACE) {
      history.replace(modalState.location);
    } else {
      history.push(modalState.location);
    }
  };

  return (
    <Modal
      id="navigation-modal"
      data-testid="navigation-modal"
      size="small"
      open={modalState.open}
      label={label}
      aria-label={ariaLabel || intl.formatMessage({ id: 'ui-eholdings.navModal.modalLabel' })}
      wrappingElement="form"
      onClose={onCancel}
      role="dialog"
      footer={(
        <ModalFooter>
          <Button
            data-test-navigation-modal-dismiss
            buttonStyle="primary"
            onClick={onSubmit}
          >
            <FormattedMessage id="ui-eholdings.navModal.dismissLabel" />
          </Button>
          <Button
            data-test-navigation-modal-continue
            onClick={navigateToNextLocation}
          >
            <FormattedMessage id="ui-eholdings.navModal.continueLabel" />
          </Button>
        </ModalFooter>
      )}
    >
      {message}
    </Modal>
  );
};

NavigationModal.propTypes = propTypes;

export default NavigationModal;
