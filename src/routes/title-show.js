import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { createResolver } from '../redux';
import Title from '../redux/title';
import View from '../components/title-show';

class TitleShowRoute extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        titleId: PropTypes.string.isRequired
      }).isRequired
    }).isRequired,
    model: PropTypes.object.isRequired,
    resolver: PropTypes.object.isRequired,
    getTitle: PropTypes.func.isRequired,
    getPackages: PropTypes.func.isRequired
  };

  state = {
    pkgSearchParams: {}
  }

  componentWillMount() {
    let { match, getTitle } = this.props;
    let { titleId } = match.params;
    getTitle(titleId);
  }

  componentDidUpdate(prevProps, prevState) {
    let { match, getPackages } = this.props;
    let { pkgSearchParams } = this.state;
    let { titleId } = match.params;

    if (titleId !== prevProps.match.params.titleId) {
      this.props.getTitle(titleId);
    }

    if (pkgSearchParams !== prevState.pkgSearchParams) {
      getPackages(titleId, pkgSearchParams);
    }
  }

  getPkgResults() {
    let { match, resolver } = this.props;
    let { pkgSearchParams } = this.state;
    let { titleId } = match.params;

    return resolver.query('resources', pkgSearchParams, {
      path: `${Title.pathFor(titleId)}/resources`
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
      model: resolver.find('titles', match.params.titleId),
      resolver
    };
  }, {
    getTitle: id => Title.find(id, { include: 'resources' }),
    getPackages: (id, params) => Title.queryRelated(id, 'resources', params)
  }
)(TitleShowRoute);
