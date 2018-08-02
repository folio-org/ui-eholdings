import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalFooter } from '@folio/stripes-components';
import { FormattedMessage } from 'react-intl';

export default class NavigationModal extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.node
    ]),
    continueLabel: PropTypes.string.isRequired,
    dismissLabel: PropTypes.string.isRequired,
    modalLabel: PropTypes.string.isRequired,
    when: PropTypes.bool.isRequired
  };

  static contextTypes = {
    router: PropTypes.shape({
      history: PropTypes.shape({
        block: PropTypes.func.isRequired,
        push: PropTypes.func.isRequired
      }).isRequired
    }).isRequired
  };

  constructor(props) {
    super(props);

    if (props.when) {
      this.enable();
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

    this.unblock = this.context.router.history.block((nextLocation) => {
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
      this.context.router.history.push(this.state.nextLocation);
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
