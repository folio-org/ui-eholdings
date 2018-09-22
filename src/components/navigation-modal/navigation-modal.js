import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { Modal, ModalFooter } from '@folio/stripes-components';
import { FormattedMessage } from 'react-intl';

class NavigationModal extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.node
    ]),
    continueLabel: PropTypes.string.isRequired,
    dismissLabel: PropTypes.string.isRequired,
    modalLabel: PropTypes.string.isRequired,
    when: PropTypes.bool.isRequired,
    history: PropTypes.object.isRequired
  };

  constructor(props, context) {
    super(props);

    if (props.when) {
      this.enable(context);
    }
  }

  state = {
    showModal: false,
    nextLocation: null
  };

  componentDidUpdate({ when }) {
    if (this.props.when && !when) {
      this.enable();
    } else if (!this.props.when) {
      this.disable();
    }
  }

  componentWillUnmount() {
    this.disable();
  }

  enable() {
    if (this.unblock) {
      this.unblock();
    }

    this.unblock = this.props.history.block((nextLocation) => {
      this.setState({
        showModal: true,
        nextLocation
      });

      return false;
    });
  }

  disable() {
    if (this.unblock) {
      this.unblock();
      this.unblock = null;
    }
  }

  dismiss = () => {
    this.setState({
      showModal: false
    });
  };

  continue = () => {
    this.disable();

    if (this.state.nextLocation) {
      this.props.history.push(this.state.nextLocation);
    }
  };

  render() {
    let { when, modalLabel, continueLabel, dismissLabel, children } = this.props;
    let { showModal } = this.state;

    if (typeof children === 'function') {
      children = children(this.continue, this.dismiss);
    }

    if (when) {
      return (
        <Modal
          id="navigation-modal"
          size="small"
          open={showModal}
          label={modalLabel}
          onClose={this.dismiss}
          footer={(
            <ModalFooter
              primaryButton={{
                'label': dismissLabel,
                'onClick': this.dismiss,
                'data-test-navigation-modal-dismiss': true
              }}
              secondaryButton={{
                'label': continueLabel,
                'onClick': this.continue,
                'data-test-navigation-modal-continue': true
              }}
            />
          )}
        >
          <FormattedMessage id="ui-eholdings.navModal.unsavedChangesMsg" />
        </Modal>
      );
    } else {
      return null;
    }
  }
}

export default withRouter(NavigationModal);
