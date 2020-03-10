import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Form } from 'react-final-form';
import {
  isEqual,
  pickBy,
} from 'lodash';

import SafeHTMLMessage from '@folio/react-intl-safe-html';
import {
  Col,
  ConfirmationModal,
  KeyValue,
  Row,
} from '@folio/stripes/components';

import CustomLabelField from './custom-label-field';
import SettingsForm from '../settings-form';
import NavigationModal from '../../navigation-modal';
import { formatCustomLabelsValues } from '../../utilities';

export default class SettingsCustomLabels extends Component {
  static propTypes = {
    confirmUpdate: PropTypes.func.isRequired,
    customLabels: PropTypes.shape({
      errors: PropTypes.array,
      isUpdated: PropTypes.bool,
      items: PropTypes.shape({
        data: PropTypes.arrayOf(PropTypes.shape({
          displayLabel: PropTypes.string,
          displayOnFullTextFinder: PropTypes.bool,
          displayOnPublicationFinder: PropTypes.bool,
          id: PropTypes.number,
        })),
      }),
    }).isRequired,
    updateCustomLabels: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false,
      removingLabels: '',
    };
  }

  componentDidUpdate() {
    const {
      confirmUpdate,
      customLabels: { isUpdated },
    } = this.props;

    if (isUpdated) {
      confirmUpdate();
    }
  }

  prepareInitialValues = () => {
    const { customLabels: { items: { data } } } = this.props;

    return data ? data.reduce((acc, { attributes }) => {
      const {
        id,
        displayLabel,
        displayOnFullTextFinder,
        displayOnPublicationFinder,
      } = attributes;

      return {
        ...acc,
        [`customLabel${id}`]: {
          displayLabel,
          displayOnFullTextFinder,
          displayOnPublicationFinder,
        }
      };
    }, {}) : {};
  };

  removeCustomLabels = ({ values }) => {
    const { updateCustomLabels } = this.props;
    const formattedFormValues = formatCustomLabelsValues(values);

    updateCustomLabels(formattedFormValues);
    this.closeModal();
  }

  getRemovingCustomLabels = (formValues, initialValues) => {
    const fieldsToDelete = pickBy(initialValues, (value, key) => (formValues[key].displayLabel === undefined));
    const removingLabels = Object.values(fieldsToDelete).map(value => value.displayLabel);

    return removingLabels.join(', ');
  }

  onSubmit = (formValues, { getState }) => {
    const { updateCustomLabels } = this.props;
    const { initialValues } = getState();

    const removingLabels = this.getRemovingCustomLabels(formValues, initialValues);

    if (removingLabels.length !== 0) {
      this.setState({
        modalIsOpen: true,
        removingLabels,
      });
    } else {
      const formattedFormValues = formatCustomLabelsValues(formValues);

      updateCustomLabels(formattedFormValues);
    }
  }

  getToastLabels() {
    const {
      customLabels: {
        errors,
        isUpdated,
      },
    } = this.props;

    if (isUpdated) {
      return [{
        message: <FormattedMessage id='ui-eholdings.settings.customLabels.toast' />,
        type: 'success',
        id: `update-custom-labels-success-${Date.now()}`
      }];
    } else {
      return errors.map((error) => ({
        message: error.title,
        type: 'error',
      }));
    }
  }

  closeModal = () => this.setState({ modalIsOpen: false });

  render() {
    const {
      modalIsOpen,
      removingLabels,
    } = this.state;

    const initialValues = this.prepareInitialValues();

    return <Form
      onSubmit={this.onSubmit}
      initialValues={initialValues}
      initialValuesEqual={isEqual}
      render={(formState) => (
        <SettingsForm
          data-test-eholdings-settings-custom-labels
          id="custom-labels-form"
          formState={formState}
          title={<FormattedMessage id="ui-eholdings.resource.customLabels" />}
          toasts={this.getToastLabels()}
        >
          <Row>
            <Col xs={4}>
              <KeyValue label={<FormattedMessage id="ui-eholdings.settings.customLabels.displayLabel" />} />
            </Col>
            <Col xs={4}>
              <KeyValue label={<FormattedMessage id="ui-eholdings.settings.customLabels.publicationFinder" />} />
            </Col>
            <Col xs={4}>
              <KeyValue label={<FormattedMessage id="ui-eholdings.settings.customLabels.textFinder" />} />
            </Col>
          </Row>

          <CustomLabelField name='customLabel1' />
          <CustomLabelField name='customLabel2' />
          <CustomLabelField name='customLabel3' />
          <CustomLabelField name='customLabel4' />
          <CustomLabelField name='customLabel5' />

          <NavigationModal
            label={<FormattedMessage id="ui-eholdings.navModal.areYouSure" />}
            message={<FormattedMessage id="ui-eholdings.navModal.unsavedChanges" />}
            when={!formState.pristine && !isEqual(formState.values, initialValues)}
          />

          <ConfirmationModal
            confirmLabel={<FormattedMessage id="ui-eholdings.settings.customLabels.remove" />}
            id="confirmation-modal"
            heading={<FormattedMessage id="ui-eholdings.settings.customLabels.remove" />}
            message={
              <>
                <SafeHTMLMessage
                  id="ui-eholdings.settings.customLabels.remove.description"
                  values={{ label: removingLabels }}
                />
                <br />
                <SafeHTMLMessage id="ui-eholdings.settings.customLabels.remove.note" />
              </>
            }
            onCancel={this.closeModal}
            onConfirm={() => this.removeCustomLabels(formState)}
            open={modalIsOpen}
          />
        </SettingsForm>
      )}
    />;
  }
}
