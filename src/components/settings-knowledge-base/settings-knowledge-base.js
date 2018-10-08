import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field } from 'redux-form';
import isEqual from 'lodash/isEqual';
import { intlShape, injectIntl, FormattedMessage } from 'react-intl';
import {
  Headline,
  Icon,
  TextField,
  Select
} from '@folio/stripes/components';
import SettingsDetailPane from '../settings-detail-pane';
import { processErrors } from '../utilities';
import Toaster from '../toaster';
import PaneHeaderButton from '../pane-header-button';
import styles from './settings-knowledge-base.css';

class SettingsKnowledgeBase extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func,
    intl: intlShape.isRequired,
    invalid: PropTypes.bool,
    model: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
    pristine: PropTypes.bool,
    reset: PropTypes.func
  };

  static contextTypes = {
    router: PropTypes.shape({
      history: PropTypes.shape({
        push: PropTypes.func.isRequired
      }).isRequired
    }).isRequired
  };

  componentDidUpdate(prevProps) {
    let wasPending = prevProps.model.update.isPending && !this.props.model.update.isPending;
    let needsUpdate = !isEqual(prevProps.model, this.props.model);
    let isRejected = this.props.model.update.isRejected;

    let { router } = this.context;

    if (wasPending && needsUpdate && !isRejected) {
      router.history.push({
        pathname: '/settings/eholdings/knowledge-base',
        state: { eholdings: true, isFreshlySaved: true }
      });
    }
  }

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

    let { router } = this.context;

    let toasts = processErrors(model);

    if (router.history.action === 'PUSH' &&
        router.history.location.state &&
        router.history.location.state.isFreshlySaved &&
        model.update.isResolved) {
      toasts.push({
        id: `settings-kb-${model.update.timestamp}`,
        message: <FormattedMessage id="ui-eholdings.settings.kb.updated" />,
        type: 'success'
      });
    }

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
          <Toaster toasts={toasts} position="bottom" />

          <Headline size="xx-large" tag="h3">
            <FormattedMessage id="ui-eholdings.settings.kb.rmApiCreds" />
          </Headline>

          {model.isLoading ? (
            <Icon icon="spinner-ellipsis" />
          ) : (
            <Fragment>
              <div
                data-test-eholdings-settings-kb-url
              >
                <Field
                  name="rmapiBaseUrl"
                  component={Select}
                  label={intl.formatMessage({ id: 'ui-eholdings.settings.kb.rmapiBaseUrl' })}
                  dataOptions={[
                    { value: 'https://sandbox.ebsco.io', label: 'Sandbox: https://sandbox.ebsco.io' },
                    { value: 'https://api.ebsco.io', label: 'Production: https://api.ebsco.io' }
                  ]}
                />
              </div>

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

              <p><FormattedMessage id="ui-eholdings.settings.kb.url.ebsco.customer.message" /></p>
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
