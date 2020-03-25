import React from 'react';
import PropTypes from 'prop-types';

import { Icon } from '@folio/stripes-components';

import ManagedPackageEdit from './edit-managed';
import CustomPackageEdit from './edit-custom';

import { accessTypesReduxStateShape } from '../../constants';

export default class PackageEdit extends React.Component {
  static propTypes = {
    accessStatusTypes: accessTypesReduxStateShape.isRequired,
    model: PropTypes.object.isRequired,
    provider: PropTypes.object.isRequired,
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
      accessStatusTypes,
      ...props
    } = this.props;

    const View = model.isCustom
      ? CustomPackageEdit
      : ManagedPackageEdit;

    return (
      <View
        model={model}
        provider={provider}
        accessStatusTypes={accessStatusTypes}
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
