import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { createResolver } from '../redux';
import CustomerResource from '../redux/customer-resource';
import View from '../components/customer-resource-show';

class CustomerResourceShowRoute extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string.isRequired
      }).isRequired
    }).isRequired,
    model: PropTypes.object.isRequired,
    getCustomerResource: PropTypes.func.isRequired,
    updateResource: PropTypes.func.isRequired
  };

  componentWillMount() {
    let { match, getCustomerResource } = this.props;
    let { id } = match.params;
    getCustomerResource(id);
  }

  componentWillReceiveProps(nextProps) {
    let { match, getCustomerResource } = nextProps;
    let { id } = match.params;

    if (id !== this.props.match.params.id) {
      getCustomerResource(id);
    }
  }

  toggleSelected = () => {
    let { model, updateResource } = this.props;
    model.isSelected = !model.isSelected;

    // clear out any customizations before sending to server
    if (!model.isSelected) {
      model.visibilityData.isHidden = false;
      model.customCoverages = [];
      model.customEmbargoPeriod = {};
    }

    updateResource(model);
  }

  toggleHidden = () => {
    let { model, updateResource } = this.props;
    model.visibilityData.isHidden = !model.visibilityData.isHidden;
    updateResource(model);
  }

  render() {
    return (
      <View
        model={this.props.model}
        toggleSelected={this.toggleSelected}
        toggleHidden={this.toggleHidden}
      />
    );
  }
}

export default connect(
  ({ eholdings: { data } }, { match }) => ({
    model: createResolver(data).find('customerResources', match.params.id)
  }), {
    getCustomerResource: id => CustomerResource.find(id, { include: 'package' }),
    updateResource: model => CustomerResource.save(model)
  }
)(CustomerResourceShowRoute);
