import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';

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

  // where would I catch the error for this update?
  // then I need to display a toast with the error message
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

  customEmbargoSubmitted = (values) => {
    let { model, updateResource } = this.props;
    model.customEmbargoPeriod = {
      embargoValue: values.customEmbargoValue,
      embargoUnit: values.customEmbargoUnit
    };
    updateResource(model);
  }

  coverageSubmitted = (values) => {
    let { model, updateResource } = this.props;
    model.customCoverages = values.customCoverages.map((dateRange) => {
      let beginCoverage = !dateRange.beginCoverage ? null : moment(dateRange.beginCoverage).format('YYYY-MM-DD');
      let endCoverage = !dateRange.endCoverage ? null : moment(dateRange.endCoverage).format('YYYY-MM-DD');

      return {
        beginCoverage,
        endCoverage
      };
    });

    updateResource(model);
  }

  coverageStatementSubmitted = (values) => {
    let { model, updateResource } = this.props;
    model.coverageStatement = values.coverageStatement;
    updateResource(model);
  }

  render() {
    return (
      <View
        model={this.props.model}
        toggleSelected={this.toggleSelected}
        toggleHidden={this.toggleHidden}
        customEmbargoSubmitted={this.customEmbargoSubmitted}
        coverageSubmitted={this.coverageSubmitted}
        coverageStatementSubmitted={this.coverageStatementSubmitted}
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
