import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';

import { createResolver } from '../redux';
import Resource from '../redux/resource';

import ManagedResourceEdit from '../components/resource/edit-managed-title';
import CustomResourceEdit from '../components/resource/edit-custom-title';


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

  componentDidUpdate(prevProps) {
    let { packageName, packageId } = prevProps.model;
    if (!prevProps.model.destroy.isResolved && this.props.model.destroy.isResolved) {
      this.context.router.history.replace(`/eholdings/packages/${packageId}?searchType=packages&q=${packageName}`,
        { eholdings: true, isDestroyed: true });
    }
  }

  resourceEditSubmitted = (values) => {
    let { model, updateResource, destroyResource } = this.props;
    let {
      coverageStatement,
      customCoverages,
      customEmbargoValue,
      customEmbargoUnit,
      customUrl
    } = values;

    if (values.isSelected === false) {
      destroyResource(model);
    } else {
      model.customCoverages = customCoverages.map((dateRange) => {
        let beginCoverage = !dateRange.beginCoverage ? null : moment(dateRange.beginCoverage).format('YYYY-MM-DD');
        let endCoverage = !dateRange.endCoverage ? null : moment(dateRange.endCoverage).format('YYYY-MM-DD');

        return {
          beginCoverage,
          endCoverage
        };
      });

      model.url = customUrl;
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
    let initialValues = {};
    let View;

    if (model.isTitleCustom === true || model.destroy.params.isTitleCustom === true) {
      View = CustomResourceEdit;
      initialValues = {
        isSelected: model.isSelected,
        customCoverages: model.customCoverages,
        coverageStatement: model.coverageStatement,
        customEmbargoValue: model.customEmbargoPeriod.embargoValue,
        customEmbargoUnit: model.customEmbargoPeriod.embargoUnit,
        customUrl: model.url
      };
    } else if (model.isTitleCustom === false) {
      View = ManagedResourceEdit;
      initialValues = {
        isSelected: model.isSelected,
        customCoverages: model.customCoverages,
        coverageStatement: model.coverageStatement,
        customEmbargoValue: model.customEmbargoPeriod.embargoValue,
        customEmbargoUnit: model.customEmbargoPeriod.embargoUnit
      };
    }

    return (
      <View
        model={model}
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
    getResource: id => Resource.find(id, { include: ['package', 'title'] }),
    updateResource: model => Resource.save(model),
    destroyResource: model => Resource.destroy(model)
  }
)(ResourceEditRoute);
