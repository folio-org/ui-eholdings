import React, { Component } from 'react';
import PropTypes from 'prop-types';
import fetch from 'isomorphic-fetch';

import View from '../../components/title-show';

export default class TitleShowRoute extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        titleId: PropTypes.string.isRequired
      }).isRequired
    }).isRequired,
    resources: PropTypes.shape({
      showTitle: PropTypes.shape({
        records: PropTypes.arrayOf(PropTypes.object)
      })
    })
  };

  static manifest = Object.freeze({
    showTitle: {
      type: 'okapi',
      path: 'eholdings/titles/:{titleId}',
      pk: 'titleId'
    }
  });

  render() {
    return (<View title={this.getTitle()}/>);
  }

  getTitle() {
    const {
      resources: { showTitle },
      match: { params: { titleId } }
    } = this.props;

    if (!showTitle) {
      return null;
    }

    return showTitle.records.find((title) => {
      return title.titleId === titleId;
    });
  }
}
