import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getTitle } from '../../redux/title';

import View from '../../components/title-show';

class TitleShowRoute extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        titleId: PropTypes.string.isRequired
      }).isRequired
    }).isRequired,
    title: PropTypes.object.isRequired,
    getTitle: PropTypes.func.isRequired
  };

  componentWillMount() {
    let { titleId } = this.props.match.params;
    this.props.getTitle({ titleId });
  }

  render() {
    return (
      <View title={this.props.title}/>
    );
  }
}

export default connect(
  ({ eholdings: { title }}) => ({ title }),
  { getTitle }
)(TitleShowRoute);
