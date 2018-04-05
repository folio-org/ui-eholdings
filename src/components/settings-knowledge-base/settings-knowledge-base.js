import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field } from 'redux-form';
import {
  Button,
  Icon,
  TextField
} from '@folio/stripes-components';
import SettingsDetailPane from '../settings-detail-pane';
import { processErrors } from '../utilities';
import Toaster from '../toaster';
import styles from './settings-knowledge-base.css';

class SettingsKnowledgeBase extends Component {
  static propTypes = {
    model: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func,
    pristine: PropTypes.bool,
    reset: PropTypes.func,
    invalid: PropTypes.bool
  };

  render() {
    let {
      model,
      handleSubmit,
      onSubmit,
      pristine,
      reset,
      invalid
    } = this.props;

    return (
      <SettingsDetailPane
        paneTitle="Knowledge base"
      >
        <Toaster toasts={processErrors(model)} position="bottom" />

        <h3>EBSCO RM API credentials</h3>

        {model.isLoading ? (
          <Icon icon="spinner-ellipsis" />
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            data-test-eholdings-settings
            className={styles['settings-kb-form']}
          >
            <div
              data-test-eholdings-settings-customerid
            >
              <Field
                id="eholdings-settings-kb-customerid"
                label="Customer ID"
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
                label="API key"
                name="apiKey"
                component={TextField}
                type="password"
                autoComplete="off"
              />
            </div>

            {(!pristine || (!model.customerId && !model.apiKey)) && (
              <div
                className={styles['settings-kb-form-actions']}
                data-test-eholdings-settings-kb-actions
              >
                <Button
                  disabled={model.update.isPending}
                  type="reset"
                  onClick={reset}
                >
                  Cancel
                </Button>
                <Button
                  disabled={model.update.isPending || invalid}
                  type="submit"
                  buttonStyle="primary"
                >
                  {model.update.isPending ? 'Saving' : 'Save'}
                </Button>
                {model.update.isPending && (
                  <Icon icon="spinner-ellipsis" />
                )}
              </div>
            )}
          </form>
        )}
      </SettingsDetailPane>
    );
  }
}

const validate = (values) => {
  let errors = {};

  if (values.customerId.length <= 0) {
    errors.customerId = 'Customer ID cannot be blank.';
  }

  if (values.apiKey.length <= 0) {
    errors.apiKey = 'API key cannot be blank.';
  }

  return errors;
};

export default reduxForm({
  validate,
  enableReinitialize: true,
  form: 'SettingsKnowledgeBase',
  destroyOnUnmount: false,
})(SettingsKnowledgeBase);
