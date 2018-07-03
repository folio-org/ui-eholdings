import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

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
    let wasUpdated = !this.props.model.update.isPending && prevProps.model.update.isPending && (!this.props.model.update.errors.length > 0);
    let { router } = this.context;
    let { match, getResource } = this.props;
    let { id } = match.params;

    let { packageName, packageId } = prevProps.model;
    if (!prevProps.model.destroy.isResolved && this.props.model.destroy.isResolved) {
      this.context.router.history.replace(`/eholdings/packages/${packageId}?searchType=packages&q=${packageName}`,
        { eholdings: true, isDestroyed: true });
    }

    if (wasUpdated) {
      router.history.push({
        pathname: `/eholdings/resources/${this.props.model.id}`,
        search: router.route.location.search,
        state: { eholdings: true, isFreshlySaved: true }
      });
    }

    if (id !== prevProps.match.params.id) {
      getResource(id);
    }
  }

  toggleSelected = () => {
    let { model, updateResource, destroyResource } = this.props;
    model.isSelected = !model.isSelected;

    if (model.isSelected === false && model.package.isCustom) {
      destroyResource(model);
    } else {
      // clear out any customizations before sending to server
      model.visibilityData.isHidden = false;
      model.customCoverages = [];
      model.coverageStatement = '';
      model.customEmbargoPeriod = {};
      model.identifiersList = [];
      model.identifiers = {};

      updateResource(model);
    }
  }

  render() {
    return (
      <View
        model={this.props.model}
        toggleSelected={this.toggleSelected}
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
)(ResourceShowRoute);
