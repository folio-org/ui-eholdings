import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Pane,
  PaneCloseLink,
  PaneFooter,
  Button,
} from '@folio/stripes/components';
import Toaster from '../../toaster';

export default class SettingsForm extends Component {
  static propTypes = {
    children: PropTypes.node,
    formState: PropTypes.shape({
      form: PropTypes.object,
      handleSubmit: PropTypes.func.isRequired,
      invalid: PropTypes.bool,
      pristine: PropTypes.bool,
    }).isRequired,
    title: PropTypes.node,
    toasts: PropTypes.array.isRequired,
    updateIsPending: PropTypes.bool,
  };

  renderFooter() {
    const {
      formState: {
        form: { reset },
        invalid,
        pristine,
      },
      updateIsPending,
    } = this.props;

    const cancelButton = (
      <Button
        data-test-eholdings-settings-form-cancel-button
        buttonStyle="default mega"
        disabled={updateIsPending || pristine}
        onClick={reset}
        marginBottom0
      >
        <FormattedMessage id="stripes-components.cancel" />
      </Button>
    );

    const saveButton = (
      <Button
        buttonStyle="primary mega"
        data-test-eholdings-settings-form-save-button
        disabled={updateIsPending || invalid || pristine}
        marginBottom0
        type="submit"
      >
        <FormattedMessage id="stripes-components.saveAndClose" />
      </Button>
    );

    return (
      <PaneFooter
        renderStart={cancelButton}
        renderEnd={saveButton}
      />
    );
  }

  render() {
    const {
      children,
      title,
      formState,
      toasts,
      ...formProps
    } = this.props;

    return (
      <form onSubmit={formState.handleSubmit} {...formProps}>
        <Pane
          paneTitle={title}
          defaultWidth="fill"
          firstMenu={(
            <FormattedMessage id="ui-eholdings.settings.goBackToEholdings">
              {ariaLabel => (
                <PaneCloseLink
                  ariaLabel={ariaLabel}
                  to="/settings/eholdings"
                />
              )}
            </FormattedMessage>
          )}
          footer={this.renderFooter()}
        >
          <Toaster
            position='bottom'
            toasts={toasts}
          />

          {children}
        </Pane>
      </form>
    );
  }
}
