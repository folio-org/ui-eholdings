import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import { TitleManager } from '@folio/stripes/core';

import View from '../components/settings/settings-custom-labels';
import {
  getCustomLabels as getCustomLabelsAction,
  updateCustomLabels as updateCustomLabelsAction,
  confirmUpdateCustomLabels as confirmUpdateAction,
} from '../redux/actions';
import selectCustomLabels from '../redux/selectors/select-custom-labels';

class SettingsCustomLabelsRoute extends Component {
  static propTypes = {
    confirmUpdate: PropTypes.func.isRequired,
    customLabels: PropTypes.shape({
      items: PropTypes.object.isRequired,
    }).isRequired,
    getCustomLabels: PropTypes.func.isRequired,
    updateCustomLabels: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { getCustomLabels } = this.props;

    getCustomLabels();
  }

  render() {
    const {
      customLabels,
      updateCustomLabels,
      confirmUpdate,
    } = this.props;

    return (
      <FormattedMessage id="ui-eholdings.label.settings">
        {pageLabel => (
          <FormattedMessage id="ui-eholdings.resource.customLabels">
            {recordLabel => (
              <TitleManager
                page={pageLabel}
                record={recordLabel}
              >
                <View
                  customLabels={customLabels}
                  updateCustomLabels={updateCustomLabels}
                  confirmUpdate={confirmUpdate}
                />
              </TitleManager>
            )}
          </FormattedMessage>
        )}
      </FormattedMessage>
    );
  }
}

export default connect(
  (store) => ({
    customLabels: selectCustomLabels(store),
  }), {
    getCustomLabels: getCustomLabelsAction,
    updateCustomLabels: updateCustomLabelsAction,
    confirmUpdate: confirmUpdateAction,
  }
)(SettingsCustomLabelsRoute);
