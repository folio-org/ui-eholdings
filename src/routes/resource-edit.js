import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';
import moment from 'moment';
import { TitleManager } from '@folio/stripes/core';

import { createResolver } from '../redux';
import { ProxyType } from '../redux/application';
import Resource from '../redux/resource';

import View from '../components/resource/resource-edit';

class ResourceEditRoute extends Component {
  static propTypes = {
    destroyResource: PropTypes.func.isRequired,
    getProxyTypes: PropTypes.func.isRequired,
    getResource: PropTypes.func.isRequired,
    history: ReactRouterPropTypes.history.isRequired,
    location: ReactRouterPropTypes.location.isRequired,
    match: ReactRouterPropTypes.match.isRequired,
    model: PropTypes.object.isRequired,
    proxyTypes: PropTypes.object.isRequired,
    updateResource: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    let { match, getResource, getProxyTypes } = props;
    let { id } = match.params;
    getResource(id);
    getProxyTypes();
  }

  componentDidUpdate(prevProps) {
    let { packageName, packageId } = prevProps.model;
    let { match, getResource, history, location, model } = this.props;
    let { id } = match.params;

    if (!prevProps.model.destroy.isResolved && this.props.model.destroy.isResolved) {
      history.replace(`/eholdings/packages/${packageId}?searchType=packages&q=${packageName}`,
        { eholdings: true, isDestroyed: true });
    }

    if (id !== prevProps.match.params.id) {
      getResource(id);
    }

    let wasPending = prevProps.model.update.isPending && !model.update.isPending;
    let needsUpdate = !isEqual(prevProps.model, model);
    let isRejected = model.update.isRejected;
    let wasUnSelected = prevProps.model.isSelected && !model.isSelected;
    let isCurrentlySelected = prevProps.model.isSelected && model.isSelected;

    if (wasPending && needsUpdate && !isRejected && (wasUnSelected || isCurrentlySelected)) {
      history.push({
        pathname: `/eholdings/resources/${model.id}`,
        search: location.search,
        state: { eholdings: true, isFreshlySaved: true }
      });
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
      isVisible,
      proxyId
    } = values;

    if (values.isSelected === false && model.package.isCustom) {
      destroyResource(model);
    } else if (values.isSelected === false) {
      model.isSelected = false;
      model.customCoverages = [];
      model.visibilityData.isHidden = false;
      model.identifiersList = [];
      model.identifiers = [];
      model.customStatement = '';
      model.customEmbargoPeriod = {};
      model.contributors = [];
      model.coverageStatement = '';
      model.proxy = {};

      updateResource(model);
    } else if (values.isSelected && !values.customCoverages) {
      model.isSelected = true;

      updateResource(model);
    } else {
      model.customCoverages = customCoverages.map((dateRange) => {
        let beginCoverage = !dateRange.beginCoverage ? null : moment.utc(dateRange.beginCoverage).format('YYYY-MM-DD');
        let endCoverage = !dateRange.endCoverage ? null : moment.utc(dateRange.endCoverage).format('YYYY-MM-DD');

        return {
          beginCoverage,
          endCoverage
        };
      });
      model.isSelected = values.isSelected;
      model.url = customUrl;
      model.visibilityData.isHidden = !isVisible;
      model.coverageStatement = coverageStatement;
      model.customEmbargoPeriod = {
        embargoValue: customEmbargoValue,
        embargoUnit: customEmbargoUnit
      };
      model.proxy.id = proxyId;

      updateResource(model);
    }
  }

  render() {
    let { model, proxyTypes, history, location } = this.props;

    return (
      <TitleManager record={`Edit ${model.name}`}>
        <View
          model={model}
          onSubmit={this.resourceEditSubmitted}
          onCancel={() => history.push({
            pathname: `/eholdings/resources/${model.id}`,
            search: location.search,
            state: { eholdings: true }
          })}
          proxyTypes={proxyTypes}
        />
      </TitleManager>
    );
  }
}

export default connect(
  ({ eholdings: { data } }, { match }) => ({
    model: createResolver(data).find('resources', match.params.id),
    proxyTypes: createResolver(data).query('proxyTypes')
  }), {
    getResource: id => Resource.find(id, { include: ['package', 'title'] }),
    getProxyTypes: () => ProxyType.query(),
    updateResource: model => Resource.save(model),
    destroyResource: model => Resource.destroy(model)
  }
)(ResourceEditRoute);
