import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';

import { createResolver } from '../redux';
import CustomerResource from '../redux/customer-resource';

import ManagedCustomerResourceEdit from '../components/managed-customer-resource-edit';
import CustomCustomerResourceEdit from '../components/custom-customer-resource-edit';

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
    model.customCoverages = values.customCoverages.map((dateRange) => {
      let beginCoverage = !dateRange.beginCoverage ? null : moment(dateRange.beginCoverage).format('YYYY-MM-DD');
      let endCoverage = !dateRange.endCoverage ? null : moment(dateRange.endCoverage).format('YYYY-MM-DD');

      return {
        beginCoverage,
        endCoverage
      };
    });
    model.coverageStatement = values.coverageStatement;
    model.customEmbargoPeriod = {
      embargoValue: values.customEmbargoValue,
      embargoUnit: values.customEmbargoUnit
    };

    if ('name' in values) {
      model.name = values.name;
    }

    updateResource(model);
  }

  render() {
    let { model } = this.props;
    let initialValues = {};
    let View;

    if (model.isTitleCustom) {
      View = CustomCustomerResourceEdit;
      initialValues = {
        name: model.name,
        customCoverages: model.customCoverages,
        coverageStatement: model.coverageStatement
      };
    } else {
      View = ManagedCustomerResourceEdit;
      initialValues = {
        customCoverages: model.customCoverages,
        coverageStatement: model.coverageStatement,
        customEmbargoValue: model.customEmbargoPeriod.embargoValue,
        customEmbargoUnit: model.customEmbargoPeriod.embargoUnit
      };
    }

    return (
      <View
        model={this.props.model}
        onSubmit={this.resourceEditSubmitted}
        initialValues={initialValues}
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
