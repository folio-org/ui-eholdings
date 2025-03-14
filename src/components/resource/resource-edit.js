import { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Icon,
  Headline,
  Button,
  PaneFooter,
} from '@folio/stripes/components';

import ManagedResourceEdit from './edit-managed-title';
import CustomResourceEdit from './edit-custom-title';

import { accessTypesReduxStateShape } from '../../constants';

export default class ResourceEdit extends Component {
  static propTypes = {
    accessStatusTypes: accessTypesReduxStateShape.isRequired,
    model: PropTypes.object.isRequired,
    onCancel: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    proxyTypes: PropTypes.object.isRequired,
  };

  state = {
    allowFormToSubmit: false,
    showSelectionModal: false,
    formValues: {},
  };

  static getDerivedStateFromProps(nextProps) {
    const stateUpdates = {};

    if (nextProps.model.destroy.errors.length) {
      stateUpdates.showSelectionModal = false;
    }

    return stateUpdates;
  }

  renderRequestErrorMessage() {
    const { model } = this.props;

    return (
      <p data-test-eholdings-resource-edit-error>
        {model.request.errors[0].title}
      </p>
    );
  }

  indicateModelIsNotLoaded() {
    const { model } = this.props;

    return model.request.isRejected
      ? this.renderRequestErrorMessage()
      : (
        <Icon
          data-testid="spinner"
          icon="spinner-ellipsis"
          iconSize="small"
        />
      );
  }

  handleDeleteConfirmation = () => {
    this.commitSelectionToggle(this.state.formValues);
  };

  renderView() {
    const {
      model,
      ...props
    } = this.props;

    const View = model.isTitleCustom
      ? CustomResourceEdit
      : ManagedResourceEdit;

    return (
      <View
        closeSelectionModal={this.closeSelectionModal}
        handleDeleteConfirmation={this.handleDeleteConfirmation}
        showSelectionModal={this.state.showSelectionModal}
        commitSelectionToggle={this.commitSelectionToggle}
        getSectionHeader={this.getSectionHeader}
        handleOnSubmit={this.handleOnSubmit}
        getFooter={this.getFooter}
        model={model}
        {...props}
      />
    );
  }

  getSectionHeader = (translationKey) => {
    return (
      <Headline
        size="large"
        tag="h3"
      >
        <FormattedMessage id={translationKey} />
      </Headline>);
  };

  commitSelectionToggle = formValues => {
    this.setState({
      allowFormToSubmit: true
    }, () => { this.handleOnSubmit(formValues); });
  };

  handleOnSubmit = values => {
    if (this.state.allowFormToSubmit === false && values.isSelected === false) {
      this.setState({
        showSelectionModal: true,
        formValues: values
      });
    } else {
      this.setState({
        allowFormToSubmit: false,
        formValues: {}
      }, () => {
        this.props.onSubmit(values);
      });
    }
  };

  closeSelectionModal = () => {
    this.setState({
      showSelectionModal: false,
    });
  };

  getFooter = (pristine) => {
    const {
      model,
      onCancel,
    } = this.props;

    const cancelButton = (
      <Button
        data-test-eholdings-provider-edit-cancel-button
        buttonStyle="default mega"
        disabled={model.update.isPending || model.destroy.isPending || pristine}
        onClick={onCancel}
        marginBottom0
      >
        <FormattedMessage id="stripes-components.cancel" />
      </Button>
    );
    const saveButton = (
      <Button
        buttonStyle="primary mega"
        data-test-eholdings-resource-save-button
        disabled={pristine || model.update.isPending || model.destroy.isPending}
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
  };

  render() {
    const {
      model: { isLoaded },
    } = this.props;

    return isLoaded
      ? this.renderView()
      : this.indicateModelIsNotLoaded();
  }
}
