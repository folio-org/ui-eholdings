import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Icon } from '@folio/stripes-components';

import ManagedResourceEdit from './edit-managed-title';
import CustomResourceEdit from './edit-custom-title';

export default class ResourceEdit extends Component {
  static propTypes = {
    model: PropTypes.object.isRequired
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
      : (
        <Icon
          icon="spinner-ellipsis"
          iconSize="small"
        />
      );
  }
}
