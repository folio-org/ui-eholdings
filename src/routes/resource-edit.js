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
      name,
      isPeerReviewed,
      publicationType,
      publisherName
    } = values;
    model.customCoverages = customCoverages.map((dateRange) => {
      let beginCoverage = !dateRange.beginCoverage ? null : moment(dateRange.beginCoverage).format('YYYY-MM-DD');
      let endCoverage = !dateRange.endCoverage ? null : moment(dateRange.endCoverage).format('YYYY-MM-DD');

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
    model.publicationType = publicationType;
    model.publisherName = publisherName;

    if ('name' in values) {
      model.name = name;
    }

    model.isPeerReviewed = isPeerReviewed;
    updateResource(model);
  }

  render() {
    let { model } = this.props;

    return (
      <View
        model={model}
        onSubmit={this.resourceEditSubmitted}
        initialValues={{
          name: model.name,
          customCoverages: model.customCoverages,
          coverageStatement: model.coverageStatement,
          customEmbargoValue: model.customEmbargoPeriod.embargoValue,
          customEmbargoUnit: model.customEmbargoPeriod.embargoUnit,
          isPeerReviewed: model.isPeerReviewed,
          publicationType: model.publicationType,
          publisherName: model.publisherName
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
