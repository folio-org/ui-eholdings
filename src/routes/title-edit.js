import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { createResolver } from '../redux';
import Title from '../redux/title';
import Resource from '../redux/resource';

import View from '../components/title/edit';

class TitleShowRoute extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        titleId: PropTypes.string.isRequired
      }).isRequired
    }).isRequired,
    model: PropTypes.object.isRequired,
    getTitle: PropTypes.func.isRequired,
    updateResource: PropTypes.func.isRequired,
    updateRequest: PropTypes.object
  };

  static contextTypes = {
    router: PropTypes.shape({
      history: PropTypes.shape({
        push: PropTypes.func.isRequired
      }).isRequired
    }).isRequired
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

  componentDidUpdate(prevProps) {
    if (!prevProps.updateRequest.isResolved && this.props.updateRequest.isResolved) {
      this.context.router.history.push(
        `/eholdings/titles/${this.props.model.id}`,
        { eholdings: true, isFreshlySaved: true }
      );
    }
  }

  flattenedIdentifiers = [
    { type: 'ISSN', subtype: 'Online' },
    { type: 'ISSN', subtype: 'Print' },
    { type: 'ISBN', subtype: 'Online' },
    { type: 'ISBN', subtype: 'Print' }
  ]

  mergeIdentifiers = (identifiers) => {
    return identifiers.map(({ id, type, subtype }) => {
      let mergedTypeIndex = 0;

      if (type && subtype) {
        mergedTypeIndex = this.flattenedIdentifiers.filter(row =>
          row.type === type && row.subtype === subtype);
      }

      return {
        id,
        flattenedType: mergedTypeIndex
      };
    });
  }

  expandIdentifiers = (identifiers) => {
    return identifiers.map(({ id, flattenedType }) => {
      let flattenedTypeIndex = flattenedType || 0;
      return { id, ...this.flattenedIdentifiers[flattenedTypeIndex] };
    });
  }

  titleEditSubmitted = (values) => {
    let { model, updateResource } = this.props;
    let resource = model.resources.records[0];
    updateResource(Object.assign(resource, {
      ...values,
      identifiers: this.expandIdentifiers(values.identifiers)
    }));
  }

  render() {
    let {
      model,
      updateRequest
    } = this.props;

    return (
      <View
        model={model}
        onSubmit={this.titleEditSubmitted}
        updateRequest={updateRequest}
        initialValues={{
          name: model.name,
          edition: model.edition,
          isPeerReviewed: model.isPeerReviewed,
          publicationType: model.publicationType,
          publisherName: model.publisherName,
          description: model.description,
          contributors: model.contributors,
          identifiers: this.mergeIdentifiers(model.identifiers)
        }}
      />
    );
  }
}

export default connect(
  ({ eholdings: { data } }, { match }) => ({
    model: createResolver(data).find('titles', match.params.titleId),
    updateRequest: createResolver(data).getRequest('update', { type: 'resources' })
  }), {
    getTitle: id => Title.find(id, { include: 'resources' }),
    updateResource: model => Resource.save(model)
  }
)(TitleShowRoute);
