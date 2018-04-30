import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { createResolver } from '../redux';
import Title from '../redux/title';

import View from '../components/title/create';

class TitleCreateRoute extends Component {
  static propTypes = {
    createRequest: PropTypes.object.isRequired,
    createTitle: PropTypes.func.isRequired
  };

  static contextTypes = {
    router: PropTypes.shape({
      history: PropTypes.shape({
        replace: PropTypes.func.isRequired
      }).isRequired
    }).isRequired
  };

  componentDidUpdate(prevProps) {
    if (!prevProps.createRequest.isResolved && this.props.createRequest.isResolved) {
      this.context.router.history.replace(
        `/eholdings/titles/${this.props.createRequest.records[0]}`,
        { eholdings: true, isNewRecord: true }
      );
    }
  }

  render() {
    return (
      <View
        request={this.props.createRequest}
        onSubmit={this.props.createTitle}
        initialValues={{
          name: '',
          publisherName: '',
          publicationType: 'Unspecified',
          isPeerReviewed: false,
          description: '',
        }}
      />
    );
  }
}

export default connect(
  ({ eholdings: { data } }) => ({
    createRequest: createResolver(data).getRequest('create', { type: 'titles' })
  }), {
    createTitle: attrs => Title.create(attrs)
  }
)(TitleCreateRoute);
