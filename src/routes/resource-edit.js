import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';

import { createResolver } from '../redux';
import Resource from '../redux/resource';

import View from '../components/resource/edit';

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
    let {
      coverageStatement,
      customCoverages,
      customEmbargoValue,
      customEmbargoUnit,
    } = values;
    model.customCoverages = customCoverages.map((dateRange) => {
      let beginCoverage = !dateRange.beginCoverage ? null : moment(dateRange.beginCoverage).tz('UTC').format('YYYY-MM-DD');
      let endCoverage = !dateRange.endCoverage ? null : moment(dateRange.endCoverage).tz('UTC').format('YYYY-MM-DD');

      return {
        beginCoverage,
        endCoverage
      };
    });
    model.coverageStatement = coverageStatement;
    model.customEmbargoPeriod = {
      embargoValue: customEmbargoValue,
      embargoUnit: customEmbargoUnit
    };
    updateResource(model);
  }

  render() {
    let { model } = this.props;

    return (
      <View
        model={model}
        onSubmit={this.resourceEditSubmitted}
        initialValues={{
          customCoverages: model.customCoverages,
          coverageStatement: model.coverageStatement,
          customEmbargoValue: model.customEmbargoPeriod.embargoValue,
          customEmbargoUnit: model.customEmbargoPeriod.embargoUnit
        }}
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
