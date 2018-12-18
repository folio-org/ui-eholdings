import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { withRouter } from 'react-router';
import { Modal, ModalFooter } from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';

class NavigationModal extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.node
    ]),
    continueLabel: PropTypes.node.isRequired,
    dismissLabel: PropTypes.node.isRequired,
    history: ReactRouterPropTypes.history.isRequired,
    modalLabel: PropTypes.node.isRequired,
    when: PropTypes.bool.isRequired
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
    const { history } = this.props;

    if (this.unblock) {
      this.unblock();
    }

    this.unblock = history.block((nextLocation) => {
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

  submit = (event) => {
    event.preventDefault();
    this.dismiss();
  }

  continue = () => {
    const { history } = this.props;
    const { nextLocation } = this.state;

    this.disable();

    if (nextLocation) {
      history.push(nextLocation);
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
          wrappingElement="form"
          onSubmit={this.submit}
          footer={(
            <ModalFooter
              primaryButton={{
                'label': dismissLabel,
                'type': 'submit',
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
