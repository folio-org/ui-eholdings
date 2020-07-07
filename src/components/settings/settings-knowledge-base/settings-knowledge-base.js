import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, Form } from 'react-final-form';
import createFocusDecorator from 'final-form-focus';
import {
  FormattedMessage,
  injectIntl,
} from 'react-intl';
import { withRouter } from 'react-router';
import ReactRouterPropTypes from 'react-router-prop-types';

import {
  Headline,
  Icon,
  TextField,
  Select,
} from '@folio/stripes/components';

import SettingsForm from '../settings-form';
import { KbCredentials } from '../../../constants';
import NavigationModal from '../../navigation-modal';

const focusOnErrors = createFocusDecorator();
class SettingsKnowledgeBase extends Component {
  static propTypes = {
    config: KbCredentials.CredentialShape,
    history: ReactRouterPropTypes.history.isRequired,
    intl: PropTypes.object.isRequired,
    isCreateMode: PropTypes.bool,
    kbCredentials: KbCredentials.KbCredentialsReduxStateShape,
    onSubmit: PropTypes.func.isRequired,
  };

  state = {
    toasts: [],
  }

  componentDidUpdate(prevProps) {
    const {
      config,
      kbCredentials,
      history,
    } = this.props;

    if (kbCredentials.hasUpdated) {
      history.push({
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

    if (kbCredentials.hasSaved) {
      history.push({
        pathname: `/settings/eholdings/knowledge-base/${config.id}`,
        state: { eholdings: true, isFreshlySaved: true }
      });

      // eslint-disable-next-line react/no-did-update-set-state
      this.setState(({ toasts }) => ({
        toasts: [...toasts, {
          id: `settings-kb-${config.id}-${Date.now()}`,
          message: <FormattedMessage id="ui-eholdings.settings.kb.saved" values={{ name: config.attributes.name }} />,
          type: 'success'
        }],
      }));
    }

    if (prevProps.kbCredentials.errors !== kbCredentials.errors) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState(({ toasts }) => ({
        toasts: [...toasts, ...kbCredentials.errors.map(error => ({
          id: `settings-kb-${config.id}-${Date.now()}`,
          message: error.title,
          type: 'error'
        }))],
      }));
    }
  }

  validateNameField = value => {
    if (!value) {
      return <FormattedMessage id="ui-eholdings.validate.errors.settings.kb.name" />;
    }

    if (value.length > 255) {
      return <FormattedMessage id="ui-eholdings.validate.errors.settings.kb.name.length" />;
    }

    return null;
  }

  getInitialValues() {
    const { config, isCreateMode } = this.props;

    const initialValues = {
      url: 'https://sandbox.ebsco.io',
      name: isCreateMode ? this.getKbCredentialsName() : null,
    };

    if (!config) {
      return initialValues;
    }

    return Object.assign(initialValues, config.attributes);
  }

  getKbCredentialsName() {
    const { intl, kbCredentials } = this.props;

    const defaultName = intl.formatMessage({ id: 'ui-eholdings.settings.kb' });

    const kbCredentialsNames = kbCredentials.items.map(({ attributes: { name } }) => name);
    const defaultNameIsPresent = kbCredentialsNames.some(name => name === defaultName);

    if (!defaultNameIsPresent) {
      return defaultName;
    } else {
      const reg = new RegExp(`${defaultName} \\(\\d*\\)`);
      const filteredNames = kbCredentialsNames.reduce((acc, name) => {
        if (name.match(reg)) {
          const red1 = new RegExp(`${defaultName} \\(`);
          const numberInName = parseInt(name.replace(red1, ''), 10);

          return [...acc, numberInName];
        }

        return [...acc];
      }, []);

      let number = 1;

      while (filteredNames.indexOf(number) !== -1) {
        number++;
      }

      return intl.formatMessage(
        { id: 'ui-eholdings.settings.kb.defaultName' },
        { number }
      );
    }
  }

  render() {
    const {
      onSubmit,
      kbCredentials,
      isCreateMode,
      config,
    } = this.props;

    if (!config) {
      return null;
    }

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
            updateIsPending={kbCredentials.isUpdating}
            title={<FormattedMessage id={isCreateMode ? 'ui-eholdings.settings.kb.new' : 'ui-eholdings.settings.kb.edit'} />}
            toasts={this.state.toasts}
          >
            {!isCreateMode && (
              <Headline size="xx-large" tag="h3">
                <FormattedMessage id="ui-eholdings.settings.kb.rmApiCreds" />
              </Headline>
            )}

            {kbCredentials.isLoading ? (
              <Icon icon="spinner-ellipsis" />
            ) : (
              <>
                <div data-test-eholdings-settings-kb-name>
                  <FormattedMessage id="ui-eholdings.name">
                    {label => (
                      <Field
                        name="name"
                        component={TextField}
                        label={label}
                        aria-label={label}
                        required
                        validate={this.validateNameField}
                      />
                    )}
                  </FormattedMessage>
                </div>
                <div data-test-eholdings-settings-kb-url>
                  <Field
                    name="url"
                    component={Select}
                    label={<FormattedMessage id="ui-eholdings.settings.kb.rmapiBaseUrl" />}
                  >
                    <option value="https://sandbox.ebsco.io">Sandbox: https://sandbox.ebsco.io</option>
                    <option value="https://api.ebsco.io">Production: https://api.ebsco.io</option>
                  </Field>
                </div>

                <div data-test-eholdings-settings-customerid>
                  <FormattedMessage id="ui-eholdings.settings.kb.customerId">
                    {label => (
                      <Field
                        label={label}
                        name="customerId"
                        component={TextField}
                        type="text"
                        autoComplete="off"
                        validate={value => (
                          value ? undefined : <FormattedMessage id="ui-eholdings.validate.errors.settings.customerId" />
                        )}
                        required
                        aria-label={label}
                      />

                    )}
                  </FormattedMessage>
                </div>

                <div data-test-eholdings-settings-apikey>
                  <FormattedMessage id="ui-eholdings.settings.kb.apiKey">
                    {label => (
                      <Field
                        label={label}
                        name="apiKey"
                        component={TextField}
                        type="password"
                        autoComplete="off"
                        validate={value => (
                          value ? undefined : <FormattedMessage id="ui-eholdings.validate.errors.settings.apiKey" />
                        )}
                        required
                        aria-label={label}
                      />

                    )}
                  </FormattedMessage>
                </div>

                <p><FormattedMessage id="ui-eholdings.settings.kb.url.ebsco.customer.message" /></p>
              </>
            )}

            {isCreateMode && (
              <NavigationModal
                label={<FormattedMessage id="ui-eholdings.navModal.areYouSure" />}
                message={<FormattedMessage id="ui-eholdings.navModal.unsavedChanges" />}
                when={!formState.pristine}
              />
            )}
          </SettingsForm>
        )}
      />
    );
  }
}

export default injectIntl(withRouter(SettingsKnowledgeBase));
