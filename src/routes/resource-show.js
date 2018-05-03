import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';

import { createResolver } from '../redux';
import Resource from '../redux/resource';
import View from '../components/resource/show';

class ResourceShowRoute extends Component {
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
      let beginCoverage = !dateRange.beginCoverage ? null : moment(dateRange.beginCoverage).tz('UTC').format('YYYY-MM-DD');
      let endCoverage = !dateRange.endCoverage ? null : moment(dateRange.endCoverage).tz('UTC').format('YYYY-MM-DD');

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
    model: createResolver(data).find('resources', match.params.id)
  }), {
    getResource: id => Resource.find(id, { include: ['package', 'title'] }),
    updateResource: model => Resource.save(model)
  }
)(ResourceShowRoute);
