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
    const { match, getResource, getProxyTypes } = props;
    const { id } = match.params;
    getResource(id);
    getProxyTypes();
  }

  componentDidUpdate(prevProps) {
    const { packageName, packageId } = prevProps.model;
    const { match, getResource, history, location, model } = this.props;
    const { id } = match.params;

    if (!prevProps.model.destroy.isResolved && this.props.model.destroy.isResolved) {
      history.replace(`/eholdings/packages/${packageId}?searchType=packages&q=${packageName}`,
        { eholdings: true, isDestroyed: true });
    }

    if (id !== prevProps.match.params.id) {
      getResource(id);
    }

    const wasPending = prevProps.model.update.isPending && !model.update.isPending;
    const needsUpdate = !isEqual(prevProps.model, model);
    const isRejected = model.update.isRejected;
    const wasUnSelected = prevProps.model.isSelected && !model.isSelected;
    const isCurrentlySelected = prevProps.model.isSelected && model.isSelected;

    if (wasPending && needsUpdate && !isRejected && (wasUnSelected || isCurrentlySelected)) {
      history.push({
        pathname: `/eholdings/resources/${model.id}`,
        search: location.search,
        state: { eholdings: true, isFreshlySaved: true }
      });
    }
  }

  resourceEditSubmitted = (values) => {
    const { model, updateResource, destroyResource } = this.props;
    const {
      coverageStatement,
      customCoverages,
      customEmbargoPeriod,
      customUrl,
      isVisible,
      proxyId
    } = values;

    if (values.isSelected === false && model.package.isCustom) {
      destroyResource(model);
    } else if (values.isSelected === false) {
      updateResource(Object.assign(model, {
        isSelected: false,
        customCoverages: [],
        visibilityData: { isHidden: false },
        identifiersList: [],
        identifiers: [],
        customStatement: '',
        customEmbargoPeriod: {},
        contributors: [],
        coverageStatement: '',
        proxy: {},
      }));
    } else if (values.isSelected && !values.customCoverages) {
      updateResource(Object.assign(model, {
        isSelected: true,
      }));
    } else {
      const newCustomCoverages = customCoverages.map((dateRange) => {
        const beginCoverage = !dateRange.beginCoverage ? null : moment.utc(dateRange.beginCoverage).format('YYYY-MM-DD');
        const endCoverage = !dateRange.endCoverage ? null : moment.utc(dateRange.endCoverage).format('YYYY-MM-DD');

        return {
          beginCoverage,
          endCoverage
        };
      });

      const defaultEmbargoPeriod = { embargoValue: 0 };

      updateResource(Object.assign(model, {
        customCoverages: newCustomCoverages,
        isSelected: values.isSelected,
        url: customUrl,
        visibilityData: { isHidden: !isVisible },
        coverageStatement,
        customEmbargoPeriod: customEmbargoPeriod[0] || defaultEmbargoPeriod,
        proxy: { id: proxyId },
      }));
    }
  }

  handleCancel = () => {
    const {
      history,
      model,
      location,
    } = this.props;

    const viewRouteState = {
      pathname: `/eholdings/resources/${model.id}`,
      search: location.search,
      state: {
        eholdings: true,
      }
    };

    history.replace(viewRouteState);
  }

  render() {
    const {
      model,
      proxyTypes,
    } = this.props;
    return (
      <TitleManager record={`Edit ${model.name}`}>
        <View
          model={model}
          onSubmit={this.resourceEditSubmitted}
          onCancel={this.handleCancel}
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
