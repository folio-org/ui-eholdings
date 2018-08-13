import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field } from 'redux-form';
import { intlShape, injectIntl, FormattedMessage } from 'react-intl';
import {
  Icon,
  TextField
} from '@folio/stripes-components';
import SettingsDetailPane from '../settings-detail-pane';
import { processErrors } from '../utilities';
import Toaster from '../toaster';
import PaneHeaderButton from '../pane-header-button';
import styles from './settings-knowledge-base.css';

class SettingsKnowledgeBase extends Component {
  static propTypes = {
    model: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func,
    pristine: PropTypes.bool,
    reset: PropTypes.func,
    intl: intlShape.isRequired,
    invalid: PropTypes.bool
  };

  render() {
    let {
      model,
      handleSubmit,
      onSubmit,
      pristine,
      reset,
      intl,
      invalid
    } = this.props;

    let actionMenuItems = [
      {
        'label': intl.formatMessage({ id: 'ui-eholdings.actionMenu.cancelEditing' }),
        'state': { eholdings: true },
        'onClick': reset,
        'disabled': model.update.isPending || invalid || pristine,
        'data-test-eholdings-settings-kb-cancel-action': true
      }
    ];

    return (
      <form
        onSubmit={handleSubmit(onSubmit)}
        data-test-eholdings-settings
        className={styles['settings-kb-form']}
      >
        <SettingsDetailPane
          paneTitle={intl.formatMessage({ id: 'ui-eholdings.settings.kb' })}
          actionMenuItems={actionMenuItems}
          lastMenu={(
            <Fragment>
              {model.update.isPending && (
                <Icon icon="spinner-ellipsis" />
              )}
              <PaneHeaderButton
                disabled={model.update.isPending || invalid || pristine}
                type="submit"
                buttonStyle="primary"
                data-test-eholdings-settings-kb-save-button
              >
                {model.update.isPending ?
                  (<FormattedMessage id="ui-eholdings.saving" />)
                    :
                  (<FormattedMessage id="ui-eholdings.save" />)}
              </PaneHeaderButton>
            </Fragment>
          )}
        >
          <Toaster toasts={processErrors(model)} position="bottom" />

          <h3><FormattedMessage id="ui-eholdings.settings.kb.rmApiCreds" /></h3>

          {model.isLoading ? (
            <Icon icon="spinner-ellipsis" />
          ) : (
            <Fragment>
              <div
                data-test-eholdings-settings-customerid
              >
                <Field
                  id="eholdings-settings-kb-customerid"
                  label={intl.formatMessage({ id: 'ui-eholdings.settings.kb.customerId' })}
                  name="customerId"
                  component={TextField}
                  type="text"
                  autoComplete="off"
                />
              </div>

              <div
                data-test-eholdings-settings-apikey
              >
                <Field
                  id="eholdings-settings-kb-apikey"
                  label={intl.formatMessage({ id: 'ui-eholdings.settings.kb.apiKey' })}
                  name="apiKey"
                  component={TextField}
                  type="password"
                  autoComplete="off"
                />
              </div>
            </Fragment>
          )}
        </SettingsDetailPane>
      </form>
    );
  }
}

const validate = (values, props) => {
  let errors = {};

  if (values.customerId.length <= 0) {
    errors.customerId = props.intl.formatMessage({ id: 'ui-eholdings.validate.errors.settings.customerId' });
  }

  if (values.apiKey.length <= 0) {
    errors.apiKey = props.intl.formatMessage({ id: 'ui-eholdings.validate.errors.settings.apiKey' });
  }

  return errors;
};

export default injectIntl(reduxForm({
  validate,
  enableReinitialize: true,
  form: 'SettingsKnowledgeBase',
  destroyOnUnmount: false,
})(SettingsKnowledgeBase));
