import React from 'react';
import PropTypes from 'prop-types';

import { Icon } from '@folio/stripes-components';

import ManagedPackageEdit from './edit-managed';
import CustomPackageEdit from './edit-custom';

export default class PackageEdit extends React.Component {
  static propTypes = {
    model: PropTypes.object.isRequired,
    provider: PropTypes.object.isRequired
  };

  renderRequestErrorMessage() {
    const { model } = this.props;

    return (
      <p data-test-eholdings-package-edit-error>
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
      provider,
      ...props
    } = this.props;

    const View = model.isCustom
      ? CustomPackageEdit
      : ManagedPackageEdit;

    return (
      <View
        model={model}
        provider={provider}
        {...props}
      />
    );
  }

  render() {
    const { model } = this.props;

    return model.isLoaded
      ? this.renderView()
      : this.indicateModelIsNotLoaded();
  }
}
