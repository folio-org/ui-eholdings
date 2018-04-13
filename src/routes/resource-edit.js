import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';

import { createResolver } from '../redux';
import Resource from '../redux/resource';

import ManagedResourceEdit from '../components/managed-resource-edit';
import CustomResourceEdit from '../components/custom-resource-edit';

class ResourceEditRoute extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string.isRequired
      }).isRequired
    }).isRequired,
    model: PropTypes.object.isRequired,
    getResource: PropTypes.func.isRequired,
    updateResource: PropTypes.func.isRequired
  };

  componentWillMount() {
    let { match, getResource } = this.props;
    let { id } = match.params;
    getResource(id);
  }

  componentWillReceiveProps(nextProps) {
    let { match, getResource } = nextProps;
    let { id } = match.params;

    if (id !== this.props.match.params.id) {
      getResource(id);
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
      View = CustomResourceEdit;
      initialValues = {
        name: model.name,
        customCoverages: model.customCoverages,
        coverageStatement: this.props.model.coverageStatement,
        customEmbargoValue: model.customEmbargoPeriod.embargoValue,
        customEmbargoUnit: model.customEmbargoPeriod.embargoUnit

      };
    } else {
      View = ManagedResourceEdit;
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
    model: createResolver(data).find('resources', match.params.id)
  }), {
    getResource: id => Resource.find(id, { include: 'package' }),
    updateResource: model => Resource.save(model)
  }
)(ResourceEditRoute);
