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
    updateResource: PropTypes.func.isRequired,
    destroyResource: PropTypes.func.isRequired
  };

  static contextTypes = {
    router: PropTypes.shape({
      history: PropTypes.shape({
        replace: PropTypes.func.isRequired
      }).isRequired
    }).isRequired
  };

  constructor(props) {
    super(props);
    let { match, getResource } = props;
    let { id } = match.params;
    getResource(id);
  }

  componentDidUpdate(prevProps) {
    let { packageName, packageId } = prevProps.model;
    let { match, getResource } = this.props;
    let { id } = match.params;

    if (!prevProps.model.destroy.isResolved && this.props.model.destroy.isResolved) {
      this.context.router.history.replace(`/eholdings/packages/${packageId}?searchType=packages&q=${packageName}`,
        { eholdings: true, isDestroyed: true });
    }

    if (id !== prevProps.match.params.id) {
      getResource(id);
    }
  }

  resourceEditSubmitted = (values) => {
    let { model, updateResource, destroyResource } = this.props;
    let {
      coverageStatement,
      customCoverages,
      customEmbargoValue,
      customEmbargoUnit,
      customUrl,
      isVisible
    } = values;

    if (values.isSelected === false && model.package.isCustom) {
      destroyResource(model);
    } else if (values.isSelected === false) {
      model.isSelected = false;
      model.customCoverages = [];
      model.visibilityData.isHidden = false;
      model.identifiersList = [];
      model.identifiers = {};
      model.customStatement = '';
      model.customEmbargoPeriod = {};
      model.contributors = [];
      model.coverageStatement = '';

      updateResource(model);
    } else {
      model.customCoverages = customCoverages.map((dateRange) => {
        let beginCoverage = !dateRange.beginCoverage ? null : moment(dateRange.beginCoverage).tz('UTC').format('YYYY-MM-DD');
        let endCoverage = !dateRange.endCoverage ? null : moment(dateRange.endCoverage).tz('UTC').format('YYYY-MM-DD');

        return {
          beginCoverage,
          endCoverage
        };
      });
      model.isSelected = values.isSelected;
      model.url = customUrl;
      model.visibilityData.isHidden = isVisible === 'false';
      model.coverageStatement = coverageStatement;
      model.customEmbargoPeriod = {
        embargoValue: customEmbargoValue,
        embargoUnit: customEmbargoUnit
      };
      updateResource(model);
    }
  }

  render() {
    let { model } = this.props;

    return (
      <View
        model={model}
        onSubmit={this.resourceEditSubmitted}
      />
    );
  }
}

export default connect(
  ({ eholdings: { data } }, { match }) => ({
    model: createResolver(data).find('resources', match.params.id)
  }), {
    getResource: id => Resource.find(id, { include: ['package', 'title'] }),
    updateResource: model => Resource.save(model),
    destroyResource: model => Resource.destroy(model)
  }
)(ResourceEditRoute);
