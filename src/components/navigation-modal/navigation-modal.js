import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { withRouter } from 'react-router';
import {
  Button,
  Modal,
  ModalFooter,
} from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';

class NavigationModal extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.node
    ]),
    history: ReactRouterPropTypes.history.isRequired,
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
    let { when, children } = this.props;
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
          label={<FormattedMessage id="ui-eholdings.navModal.modalLabel" />}
          onClose={this.dismiss}
          wrappingElement="form"
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
                onClick={this.continue}
              >
                <FormattedMessage id="ui-eholdings.navModal.continueLabel" />
              </Button>
            </ModalFooter>
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
