import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, Form } from 'react-final-form';
import createFocusDecorator from 'final-form-focus';
import isEqual from 'lodash/isEqual';
import { FormattedMessage } from 'react-intl';
import {
  Headline,
  Icon,
  TextField,
  Select,
} from '@folio/stripes/components';

import SettingsForm from '../settings-form';
import { processErrors } from '../../utilities';

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
    const wasPending = prevProps.model.update.isPending && !this.props.model.update.isPending;
    const needsUpdate = !isEqual(prevProps.model, this.props.model);
    const isRejected = this.props.model.update.isRejected;

    const { router } = this.context;

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
    const {
      model,
      onSubmit,
    } = this.props;

    const { router } = this.context;

    const toasts = processErrors(model);

    if (
      router.history.action === 'PUSH' &&
      router.history.location.state &&
      router.history.location.state.isFreshlySaved &&
      model.update.isResolved
    ) {
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
        render={(formState) => (
          <SettingsForm
            id="knowledge-base-form"
            data-test-eholdings-settings-kb
            formState={formState}
            updateIsPending={model.update.isPending}
            title={<FormattedMessage id="ui-eholdings.settings.kb" />}
            toasts={toasts}
          >
            <Headline size="xx-large" tag="h3">
              <FormattedMessage id="ui-eholdings.settings.kb.rmApiCreds" />
            </Headline>

            {model.isLoading ? (
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
