import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Resolver from '../redux/resolver';
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
    getTitle: PropTypes.func.isRequired
  };

  componentWillMount() {
    let { match, getTitle } = this.props;
    let { titleId } = match.params;
    getTitle(titleId);
  }

  componentWillReceiveProps(nextProps) {
    let { match, getTitle } = nextProps;
    let { titleId } = match.params;

    if (titleId !== this.props.match.params.titleId) {
      getTitle(titleId);
    }
  }

  render() {
    return (
      <View
        model={this.props.model}
      />
    );
  }
}

export default connect(
  ({ eholdings: { data } }, { match }) => ({
    model: new Resolver(data).find('titles', match.params.titleId)
  }), {
    getTitle: id => Title.find(id, { include: 'customerResources' })
  }
)(TitleShowRoute);
