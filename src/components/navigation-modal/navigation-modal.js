import { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { withRouter } from 'react-router';
import {
  Modal,
  ModalFooter,
  Button,
} from '@folio/stripes/components';
import {
  FormattedMessage,
  injectIntl,
} from 'react-intl';
import historyActions from '../../constants/historyActions';

const INITIAL_MODAL_STATE = {
  nextLocation: null,
  openModal: false,
};

class NavigationModal extends Component {
  static propTypes = {
    ariaLabel: PropTypes.string,
    history: ReactRouterPropTypes.history.isRequired,
    historyAction: PropTypes.string,
    intl: PropTypes.shape({
      formatMessage: PropTypes.func.isRequired,
    }).isRequired,
    label: PropTypes.node,
    message: PropTypes.node,
    when: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    label: <FormattedMessage id="ui-eholdings.navModal.modalLabel" />,
    message: <FormattedMessage id="ui-eholdings.navModal.unsavedChangesMsg" />,
  }

  constructor(props) {
    super(props);
    this.state = INITIAL_MODAL_STATE;
  }

  componentDidMount() {
    this.unblock = this.props.history.block((nextLocation) => {
      if (this.props.when) {
        this.setState({
          openModal: true,
          nextLocation
        });
      }
      return !this.props.when;
    });
  }

  componentWillUnmount() {
    this.unblock();
  }

  submit = (event) => {
    event.preventDefault();
    this.onCancel();
  };

  onCancel = () => {
    this.setState(INITIAL_MODAL_STATE);
  };

  onConfirm = () => {
    this.navigateToNextLocation();
  };

  navigateToNextLocation() {
    this.unblock();
    if ((this.props.historyAction && this.props.historyAction === historyActions.REPLACE)
      || this.props.history.action === historyActions.REPLACE) {
      this.props.history.replace(this.state.nextLocation);
    } else {
      this.props.history.push(this.state.nextLocation);
    }
  }

  render() {
    const {
      label,
      message,
      intl,
      ariaLabel,
    } = this.props;

    return (
      <Modal
        id="navigation-modal"
        size="small"
        open={this.state.openModal}
        label={label}
        aria-label={ariaLabel || intl.formatMessage({ id: 'ui-eholdings.navModal.modalLabel' })}
        wrappingElement="form"
        onClose={this.onCancel}
        role="dialog"
        footer={(
          <ModalFooter>
            <Button
              data-test-navigation-modal-dismiss
              buttonStyle="primary"
              onClick={this.submit}
            >
              <FormattedMessage id="ui-eholdings.navModal.dismissLabel" />
            </Button>
            <Button
              data-test-navigation-modal-continue
              onClick={this.onConfirm}
            >
              <FormattedMessage id="ui-eholdings.navModal.continueLabel" />
            </Button>
          </ModalFooter>
        )}
      >
        {message}
      </Modal>
    );
  }
}

export default withRouter(injectIntl(NavigationModal));
