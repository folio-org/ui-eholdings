import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Field, Form } from 'react-final-form';
import createFocusDecorator from 'final-form-focus';
import isEqual from 'lodash/isEqual';
import { FormattedMessage } from 'react-intl';
import {
  Button,
  Headline,
  Icon,
  TextField,
  Select
} from '@folio/stripes/components';
import SettingsDetailPane from '../settings-detail-pane';
import { processErrors } from '../utilities';
import Toaster from '../toaster';
import PaneHeaderButton from '../pane-header-button';

const focusOnErrors = createFocusDecorator();

export default class SettingsKnowledgeBase extends Component {
  static propTypes = {
    model: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
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

  getInitialValues() {
    const { attributes } = this.props.model.data;
    const initialValues = {
      rmapiBaseUrl: 'https://sandbox.ebsco.io',
    };

    return Object.assign(initialValues, attributes);
  }

  render() {
    let {
      model,
      onSubmit
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

    return (
      <Form
        onSubmit={onSubmit}
        initialValues={this.getInitialValues()}
        decorators={[focusOnErrors]}
        render={({ form: { reset }, handleSubmit, invalid, pristine }) => (
          <SettingsDetailPane
            data-test-eholdings-settings
            onSubmit={handleSubmit}
            tagName="form"
            paneTitle={<FormattedMessage id="ui-eholdings.settings.kb" />}
            actionMenu={() => (
              <Button
                data-test-eholdings-settings-kb-cancel-action
                buttonStyle="dropdownItem fullWidth"
                disabled={model.update.isPending || pristine}
                onClick={reset}
              >
                <FormattedMessage id="ui-eholdings.actionMenu.cancelEditing" />
              </Button>
            )}
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
              </Fragment>
            )}
          </SettingsDetailPane>
        )}
      />
    );
  }
}
