import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { createResolver } from '../redux';
import Provider from '../redux/provider';

import View from '../components/provider-show';

class ProviderShowRoute extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        providerId: PropTypes.string.isRequired
      }).isRequired
    }).isRequired,
    model: PropTypes.object.isRequired,
    resolver: PropTypes.object.isRequired,
    getProvider: PropTypes.func.isRequired,
    getPackages: PropTypes.func.isRequired
  };

  state = {
    pkgSearchParams: {}
  }

  componentWillMount() {
    let { providerId } = this.props.match.params;
    this.props.getProvider(providerId);
  }

  componentDidUpdate(prevProps, prevState) {
    let { match, getPackages } = this.props;
    let { pkgSearchParams } = this.state;
    let { providerId } = match.params;

    if (providerId !== prevProps.match.params.providerId) {
      this.props.getProvider(providerId);
    }

    if (pkgSearchParams !== prevState.pkgSearchParams) {
      getPackages(providerId, pkgSearchParams);
    }
  }

  getPkgResults() {
    let { match, resolver } = this.props;
    let { pkgSearchParams } = this.state;
    let { providerId } = match.params;

    return resolver.query('packages', pkgSearchParams, {
      path: `${Provider.pathFor(providerId)}/packages`
    });
  }

  searchPackages = (params) => {
    this.setState({ pkgSearchParams: params });
  };

  fetchPackages = (page) => {
    let { pkgSearchParams } = this.state;
    this.searchPackages({ ...pkgSearchParams, page });
  };

  render() {
    return (
      <View
        model={this.props.model}
        packages={this.getPkgResults()}
        fetchPackages={this.fetchPackages}
        searchPackages={this.searchPackages}
        searchParams={this.state.pkgSearchParams}
      />
    );
  }
}

export default connect(
  ({ eholdings: { data } }, { match }) => {
    let resolver = createResolver(data);

    return {
      model: resolver.find('providers', match.params.providerId),
      resolver
    };
  }, {
    getProvider: id => Provider.find(id, { include: 'packages' }),
    getPackages: (id, params) => Provider.queryRelated(id, 'packages', params)
  }
)(ProviderShowRoute);
