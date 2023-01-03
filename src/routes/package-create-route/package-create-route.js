import { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import moment from 'moment';
import { TitleManager } from '@folio/stripes/core';
import { FormattedMessage } from 'react-intl';

import View from '../../components/package/create';

import { accessTypesReduxStateShape } from '../../constants';

export default class PackageCreateRoute extends Component {
  static propTypes = {
    accessStatusTypes: accessTypesReduxStateShape.isRequired,
    createPackage: PropTypes.func.isRequired,
    createRequest: PropTypes.object.isRequired,
    getAccessTypes: PropTypes.func.isRequired,
    history: ReactRouterPropTypes.history.isRequired,
    location: ReactRouterPropTypes.location.isRequired,
    removeCreateRequests: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    props.getAccessTypes();
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.createRequest.isResolved && this.props.createRequest.isResolved) {
      this.props.history.replace( // OK REDIRECT
        `/eholdings/packages/${this.props.createRequest.records[0]}`,
        { eholdings: true, isNewRecord: true }
      );
    }
  }

  packageCreateSubmitted = (values) => {
    const attrs = {};

    if (values.customCoverages[0]) {
      attrs.customCoverage = {
        beginCoverage: !values.customCoverages[0].beginCoverage ? '' :
          moment.utc(values.customCoverages[0].beginCoverage).format('YYYY-MM-DD'),
        endCoverage: !values.customCoverages[0].endCoverage ? '' :
          moment.utc(values.customCoverages[0].endCoverage).format('YYYY-MM-DD')
      };
    }

    if ('name' in values) {
      attrs.name = values.name;
    }

    if ('contentType' in values) {
      attrs.contentType = values.contentType;
    }

    attrs.accessTypeId = values.accessTypeId;

    this.props.createPackage(attrs);
  };

  render() {
    const {
      history,
      location,
      removeCreateRequests,
      accessStatusTypes,
    } = this.props;

    return (
      <FormattedMessage id="ui-eholdings.label.create.package">
        {([pageTitle]) => (
          <TitleManager record={pageTitle}>
            <View
              request={this.props.createRequest}
              onSubmit={this.packageCreateSubmitted}
              onCancel={location.state?.eholdings ? () => history.goBack() : null}
              removeCreateRequests={removeCreateRequests}
              accessStatusTypes={accessStatusTypes}
            />
          </TitleManager>
        )}
      </FormattedMessage>
    );
  }
}
