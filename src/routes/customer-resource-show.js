import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Resolver from '../redux/resolver';
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
    updateResource(model);
  }

  render() {
    return (
      <View
        model={this.props.model}
        toggleSelected={this.toggleSelected}
      />
    );
  }
}

export default connect(
  ({ eholdings: { data } }, { match }) => ({
    model: new Resolver(data).find('customerResources', match.params.id)
  }), {
    getCustomerResource: id => CustomerResource.find(id),
    updateResource: model => CustomerResource.save(model)
  }
)(CustomerResourceShowRoute);
