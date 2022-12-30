import { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { FormattedMessage } from 'react-intl';
import noop from 'lodash/noop';

import { TitleManager } from '@folio/stripes/core';

import View from '../../components/title/create';
import { expandIdentifiers } from '../utils';

export default class TitleCreateRoute extends Component {
  static propTypes = {
    createRequest: PropTypes.object.isRequired,
    createTitle: PropTypes.func.isRequired,
    customPackages: PropTypes.object.isRequired,
    getCustomPackages: PropTypes.func.isRequired,
    history: ReactRouterPropTypes.history.isRequired,
    location: ReactRouterPropTypes.location.isRequired,
    removeCreateRequests: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.getCustomPackages();
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.createRequest.isResolved && this.props.createRequest.isResolved) {
      this.props.history.replace( // OK REDIRECT
        `/eholdings/titles/${this.props.createRequest.records[0]}`,
        { eholdings: true, isNewRecord: true }
      );
    }
  }

  createTitle = (values) => {
    const { packageId, ...attrs } = values;

    // a resource is created along with the title
    attrs.resources = [{ packageId }];

    this.props.createTitle(Object.assign(attrs, {
      identifiers: expandIdentifiers(attrs.identifiers),
    }));
  };

  onPackageFilter = (searchParam) => {
    this.props.getCustomPackages(searchParam);
  };

  render() {
    const {
      customPackages,
      history,
      location,
      removeCreateRequests,
      createRequest,
    } = this.props;

    return (
      <FormattedMessage id="ui-eholdings.label.create.title">
        {([pageTitle]) => (
          <TitleManager record={pageTitle}>
            <View
              request={createRequest}
              customPackages={customPackages}
              onSubmit={this.createTitle}
              onPackageFilter={this.onPackageFilter}
              onCancel={location.state?.eholdings ? () => history.goBack() : null} // DONE REDIRECT
              removeCreateRequests={removeCreateRequests}
            />
          </TitleManager>
        )}
      </FormattedMessage>
    );
  }
}
