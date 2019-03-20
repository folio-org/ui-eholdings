import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Icon } from '@folio/stripes-components';

import ManagedResourceEdit from './edit-managed-title';
import CustomResourceEdit from './edit-custom-title';

export default class ResourceEdit extends Component {
  static propTypes = {
    model: PropTypes.object.isRequired
  };

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
          icon="spinner-ellipsis"
          iconSize="small"
        />
      );
  }

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
        model={model}
        {...props}
      />
    );
  }

  render() {
    const {
      model: { isLoaded },
    } = this.props;

    return isLoaded
      ? this.renderView()
      : this.indicateModelIsNotLoaded();
  }
}
