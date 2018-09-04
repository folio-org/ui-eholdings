import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TitleManager from '@folio/stripes-core/src/components/TitleManager';

import { createResolver } from '../redux';
import Title from '../redux/title';
import Resource from '../redux/resource';

import View from '../components/title/edit';

class TitleEditRoute extends Component {
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

  constructor(props) {
    super(props);
    let { match, getTitle } = props;
    let { titleId } = match.params;
    getTitle(titleId);
  }

  componentDidUpdate(prevProps) {
    let { match, getTitle } = this.props;
    let { titleId } = match.params;

    if (!prevProps.updateRequest.isResolved && this.props.updateRequest.isResolved) {
      this.context.router.history.push(
        `/eholdings/titles/${this.props.model.id}`,
        { eholdings: true, isFreshlySaved: true }
      );
    }

    if (titleId !== prevProps.match.params.titleId) {
      getTitle(titleId);
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
        mergedTypeIndex = this.flattenedIdentifiers.findIndex(row => row.type === type && row.subtype === subtype);
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
      <TitleManager record={`Edit ${this.props.model.name}`}>
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
      </TitleManager>
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
)(TitleEditRoute);
