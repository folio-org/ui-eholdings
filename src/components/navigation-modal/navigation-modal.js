import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Modal from '@folio/stripes-components/lib/Modal';
import Button from '@folio/stripes-components/lib/Button';
import styles from './navigation-modal.css';

export default class NavigationModal extends Component {
  static propTypes = {
    when: PropTypes.bool.isRequired,
    modalLabel: PropTypes.string,
    continueLabel: PropTypes.string,
    dismissLabel: PropTypes.string,
    children: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.node
    ])
  };

  static defaultProps = {
    modalLabel: 'There are unsaved changes',
    continueLabel: 'Close without saving',
    dismissLabel: 'Keep editing'
  };

  static contextTypes = {
    router: PropTypes.shape({
      history: PropTypes.shape({
        block: PropTypes.func.isRequired,
        push: PropTypes.func.isRequired
      }).isRequired
    }).isRequired
  };

  state = {
    showModal: false,
    nextLocation: null
  };

  componentWillMount() {
    if (this.props.when) {
      this.enable();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.when && !this.props.when) {
      this.enable();
    } else if (!nextProps.when) {
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
          dismissible
        >
          {children || (
            <div className={styles['navigation-modal-buttons']}>
              <Button
                fullWidth
                onClick={this.continue}
                data-test-navigation-modal-continue
              >
                {continueLabel}
              </Button>

              <Button
                fullWidth
                onClick={this.dismiss}
                buttonStyle="primary"
                data-test-navigation-modal-dismiss
              >
                {dismissLabel}
              </Button>
            </div>
          )}
        </Modal>
      );
    } else {
      return null;
    }
  }
}
