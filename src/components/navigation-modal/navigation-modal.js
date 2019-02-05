import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { withRouter } from 'react-router';
import {
  Modal,
  ModalFooter,
  Button,
} from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';
import { historyActions } from '../../constants';

class NavigationModal extends Component {
  static propTypes = {
    history: ReactRouterPropTypes.history.isRequired,
    historyActon: PropTypes.string,
    when: PropTypes.bool.isRequired
  };

  constructor(props) {
    super(props);
    this.state = { nextLocation: null, openModal: false };
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
    this.setState({ nextLocation: null, openModal: false });
  };

  onConfirm = () => {
    this.navigateToNextLocation();
  };

  navigateToNextLocation() {
    this.unblock();
    if ((this.props.historyActon && this.props.historyActon === historyActions.REPLACE)
      || this.props.history.action === historyActions.REPLACE) {
      this.props.history.replace(this.state.nextLocation);
    } else {
      this.props.history.push(this.state.nextLocation);
    }
  }

  render() {
    return (
      <Modal
        id="navigation-modal"
        size="small"
        open={this.state.openModal}
        label={<FormattedMessage id="ui-eholdings.navModal.modalLabel" />}
        wrappingElement="form"
        onClose={this.onCancel}
        onSubmit={this.submit}
        footer={(
          <ModalFooter>
            <Button
              data-test-navigation-modal-dismiss
              buttonStyle="primary"
              type="submit"
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
        <FormattedMessage id="ui-eholdings.navModal.unsavedChangesMsg" />
      </Modal>
    );
  }
}

export default withRouter(NavigationModal);
