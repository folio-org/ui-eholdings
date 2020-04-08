import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, Form } from 'react-final-form';
import createFocusDecorator from 'final-form-focus';
import { FormattedMessage } from 'react-intl';
import {
  Headline,
  Icon,
  TextField,
  Select,
} from '@folio/stripes/components';

import SettingsForm from '../settings-form';
import { KbCredentials } from '../../../constants';

const focusOnErrors = createFocusDecorator();

export default class SettingsKnowledgeBase extends Component {
  static propTypes = {
    config: KbCredentials.CredentialShape,
    kbCredentials: KbCredentials.KbCredentialsReduxStateShape,
    onSubmit: PropTypes.func.isRequired,
  };

  static contextTypes = {
    router: PropTypes.shape({
      history: PropTypes.shape({
        push: PropTypes.func.isRequired
      }).isRequired
    }).isRequired
  };

  state = {
    toasts: [],
  }

  componentDidUpdate(prevProps) {
    const { config, kbCredentials } = this.props;
    const { router } = this.context;

    if (kbCredentials.hasUpdated) {
      router.history.push({
        pathname: `/settings/eholdings/knowledge-base/${config.id}`,
        state: { eholdings: true, isFreshlySaved: true }
      });

      // eslint-disable-next-line react/no-did-update-set-state
      this.setState(({ toasts }) => ({
        toasts: [...toasts, {
          id: `settings-kb-${config.id}`,
          message: <FormattedMessage id="ui-eholdings.settings.kb.updated" />,
          type: 'success'
        }],
      }));
    }

    if (prevProps.kbCredentials.errors !== kbCredentials.errors) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState(({ toasts }) => ({
        toasts: [...toasts, ...kbCredentials.errors.map(error => ({
          id: `settings-kb-${config.id}`,
          message: error.title,
          type: 'error'
        }))],
      }));
    }
  }

  getInitialValues() {
    const { config } = this.props;

    const initialValues = {
      rmapiBaseUrl: 'https://sandbox.ebsco.io',
    };

    if (!config) {
      return initialValues;
    }

    return Object.assign(initialValues, config.attributes);
  }

  render() {
    const {
      onSubmit,
      kbCredentials,
    } = this.props;

    return (
      <Form
        onSubmit={onSubmit}
        initialValues={this.getInitialValues()}
        decorators={[focusOnErrors]}
        render={(formState) => (
          <SettingsForm
            id="knowledge-base-form"
            data-test-eholdings-settings-kb
            formState={formState}
            updateIsPending={false}
            title={<FormattedMessage id="ui-eholdings.settings.kb" />}
            toasts={this.state.toasts}
          >
            <Headline size="xx-large" tag="h3">
              <FormattedMessage id="ui-eholdings.settings.kb.rmApiCreds" />
            </Headline>

            {kbCredentials.isLoading ? (
              <Icon icon="spinner-ellipsis" />
            ) : (
              <>
                <div data-test-eholdings-settings-kb-url>
                  <Field
                    name="rmapiBaseUrl"
                    component={Select}
                    label={<FormattedMessage id="ui-eholdings.settings.kb.rmapiBaseUrl" />}
                  >
                    <option value="https://sandbox.ebsco.io">Sandbox: https://sandbox.ebsco.io</option>
                    <option value="https://api.ebsco.io">Production: https://api.ebsco.io</option>
                  </Field>
                </div>

                <div data-test-eholdings-settings-customerid>
                  <Field
                    label={<FormattedMessage id="ui-eholdings.settings.kb.customerId" />}
                    name="customerId"
                    component={TextField}
                    type="text"
                    autoComplete="off"
                    validate={value => (
                      value ? undefined : <FormattedMessage id="ui-eholdings.validate.errors.settings.customerId" />
                    )}
                  />
                </div>

                <div data-test-eholdings-settings-apikey>
                  <Field
                    label={<FormattedMessage id="ui-eholdings.settings.kb.apiKey" />}
                    name="apiKey"
                    component={TextField}
                    type="password"
                    autoComplete="off"
                    validate={value => (
                      value ? undefined : <FormattedMessage id="ui-eholdings.validate.errors.settings.apiKey" />
                    )}
                  />
                </div>

                <p><FormattedMessage id="ui-eholdings.settings.kb.url.ebsco.customer.message" /></p>
              </>
            )}
          </SettingsForm>
        )}
      />
    );
  }
}
