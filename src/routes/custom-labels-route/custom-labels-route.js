import { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { TitleManager } from '@folio/stripes/core';
import { Icon } from '@folio/stripes/components';

import View from '../../components/settings/settings-custom-labels';

export default class SettingsCustomLabelsRoute extends Component {
  static propTypes = {
    confirmUpdate: PropTypes.func.isRequired,
    customLabels: PropTypes.shape({
      isLoading: PropTypes.bool.isRequired,
      items: PropTypes.object.isRequired,
    }).isRequired,
    getCustomLabels: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    updateCustomLabels: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { getCustomLabels, match: { params } } = this.props;

    getCustomLabels(params.kbId);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.kbId !== this.props.match.params.kbId) {
      this.props.getCustomLabels(this.props.match.params.kbId);
    }
  }

  render() {
    const {
      customLabels,
      customLabels: { isLoading },
      updateCustomLabels,
      confirmUpdate,
      match: { params: { kbId } },
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
                {!isLoading ? (
                  <View
                    customLabels={customLabels}
                    updateCustomLabels={updateCustomLabels}
                    confirmUpdate={confirmUpdate}
                    credentialId={kbId}
                  />
                ) : (
                  <Icon
                    icon='spinner-ellipsis'
                    size='large'
                  />
                )}
              </TitleManager>
            )}
          </FormattedMessage>
        )}
      </FormattedMessage>
    );
  }
}
