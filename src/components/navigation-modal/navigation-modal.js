import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { withRouter } from 'react-router';
import { Modal, ModalFooter } from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';

class NavigationModal extends Component {
  static propTypes = {
    history: ReactRouterPropTypes.history.isRequired,
    when: PropTypes.bool.isRequired
  };

  constructor(props) {
    super(props);
    this.state = { nextLocation: null, openModal: false };
    this.onCancel = this.onCancel.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
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
    debugger;
    this.unblock();
  }

  submit = (event) => {
    event.preventDefault();
    this.onCancel();
  }

  onCancel() {
    debugger;
    this.setState({ nextLocation: null, openModal: false });
  }

  onConfirm() {
    this.navigateToNextLocation();
  }

  navigateToNextLocation() {
    debugger;
    this.unblock();
    this.props.history.push(this.state.nextLocation.pathname);
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
          <ModalFooter
            primaryButton={{
              'label': <FormattedMessage id="ui-eholdings.navModal.dismissLabel" />,
              'type': 'submit',
              'data-test-navigation-modal-dismiss': true
            }}
            secondaryButton={{
              'label': <FormattedMessage id="ui-eholdings.navModal.continueLabel" />,
              'onClick': this.onConfirm,
              'data-test-navigation-modal-continue': true
            }}
          />
        )}
      >
        <FormattedMessage id="ui-eholdings.navModal.unsavedChangesMsg" />
      </Modal>
    );
  }
}

export default withRouter(NavigationModal);
