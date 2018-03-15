import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { createResolver } from '../redux';
import CustomerResource from '../redux/customer-resource';
import View from '../components/customer-resource-edit';

class CustomerResourceEditRoute extends Component {
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

  resourceEditSubmitted = (values) => {
    let { model, updateResource } = this.props;
    model.customEmbargoPeriod = {
      embargoValue: values.customEmbargoValue,
      embargoUnit: values.customEmbargoUnit
    };
    updateResource(model);
  }

  render() {
    return (
      <View
        model={this.props.model}
        onSubmit={this.resourceEditSubmitted}
        initialValues={{
          customEmbargoValue: this.props.model.customEmbargoPeriod.embargoValue,
          customEmbargoUnit: this.props.model.customEmbargoPeriod.embargoUnit
        }}
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
)(CustomerResourceEditRoute);
