import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';
import moment from 'moment';
import { TitleManager } from '@folio/stripes/core';
import { FormattedMessage } from 'react-intl';

import { createResolver } from '../redux';
import { ProxyType } from '../redux/application';
import Resource from '../redux/resource';

import View from '../components/resource/resource-edit';
import {
  accessTypes,
  accessTypesReduxStateShape,
} from '../constants';
import { getAccessTypes as getAccessTypesAction } from '../redux/actions';
import { selectPropFromData } from '../redux/selectors';

class ResourceEditRoute extends Component {
  static propTypes = {
    accessStatusTypes: accessTypesReduxStateShape.isRequired,
    destroyResource: PropTypes.func.isRequired,
    getAccessTypes: PropTypes.func.isRequired,
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
    const { match, getResource, getProxyTypes, getAccessTypes } = props;
    const { id } = match.params;
    getResource(id);
    getProxyTypes();
    getAccessTypes();
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
    const isFreshlySaved = wasPending && needsUpdate && !isRejected && (wasUnSelected || isCurrentlySelected);
    if (isFreshlySaved || (model.isLoaded && !model.isSelected)) {
      history.replace({
        pathname: `/eholdings/resources/${model.id}`,
        search: location.search,
        state: {
          eholdings: true,
          isFreshlySaved,
        }
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
      proxyId,
      accessTypeId,
      userDefinedField1,
      userDefinedField2,
      userDefinedField3,
      userDefinedField4,
      userDefinedField5,
    } = values;

    const newAccessTypeId = accessTypeId === accessTypes.ACCESS_TYPE_NONE_ID ? null : accessTypeId;

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
        accessTypeId: newAccessTypeId,
        userDefinedField1: '',
        userDefinedField2: '',
        userDefinedField3: '',
        userDefinedField4: '',
        userDefinedField5: '',
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
        accessTypeId: newAccessTypeId,
        userDefinedField1,
        userDefinedField2,
        userDefinedField3,
        userDefinedField4,
        userDefinedField5,
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
      accessStatusTypes,
    } = this.props;
    return (
      <FormattedMessage id="ui-eholdings.label.editLink" values={{ name: model.name }}>
        {pageTitle => (
          <TitleManager record={pageTitle}>
            <View
              model={model}
              onSubmit={this.resourceEditSubmitted}
              onCancel={this.handleCancel}
              proxyTypes={proxyTypes}
              accessStatusTypes={accessStatusTypes}
            />
          </TitleManager>
        )}
      </FormattedMessage>
    );
  }
}

export default connect(
  (store, { match }) => {
    const { eholdings: { data } } = store;

    const resolver = createResolver(data);

    return {
      model: resolver.find('resources', match.params.id),
      proxyTypes: resolver.query('proxyTypes'),
      accessStatusTypes: selectPropFromData(store, 'accessStatusTypes'),
    };
  }, {
    getResource: id => Resource.find(id, { include: ['package', 'title', 'accessType'] }),
    getProxyTypes: () => ProxyType.query(),
    updateResource: model => Resource.save(model),
    destroyResource: model => Resource.destroy(model),
    getAccessTypes: getAccessTypesAction,
  }
)(ResourceEditRoute);
