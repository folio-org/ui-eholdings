import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import { intlShape, injectIntl } from 'react-intl';

import {
  Icon,
  IconButton,
  PaneHeader
} from '@folio/stripes-components';

import DetailsViewSection from '../../details-view-section';
import NameField, { validate as validatePackageName } from '../_fields/name';
import CoverageFields, { validate as validateCoverageDates } from '../_fields/custom-coverage';
import ContentTypeField from '../_fields/content-type';
import NavigationModal from '../../navigation-modal';
import Toaster from '../../toaster';
import PaneHeaderButton from '../../pane-header-button';
import styles from './package-create.css';

class PackageCreate extends Component {
  static propTypes = {
    request: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    pristine: PropTypes.bool.isRequired,
    intl: intlShape.isRequired // eslint-disable-line react/no-unused-prop-types
  };

  static contextTypes = {
    router: PropTypes.shape({
      history: PropTypes.shape({
        goBack: PropTypes.func.isRequired
      }).isRequired
    }).isRequired
  };

  handleCancel = () => {
    this.context.router.history.goBack();
  }

  render() {
    let {
      request,
      handleSubmit,
      onSubmit,
      pristine
    } = this.props;

    let {
      router
    } = this.context;

    let historyState = router.history.location.state;

    let actionMenuItems = [];

    if (!request.isPending) {
      actionMenuItems.push({
        'label': 'Cancel editing',
        'state': { eholdings: true },
        'onClick': this.handleCancel,
        'data-test-eholdings-package-create-cancel-action': true
      });
    }

    return (
      <div data-test-eholdings-package-create>
        <Toaster
          position="bottom"
          toasts={request.errors.map(({ title }, index) => ({
            id: `error-${request.timestamp}-${index}`,
            message: title,
            type: 'error'
          }))}
        />

        <form onSubmit={handleSubmit(onSubmit)}>
          <PaneHeader
            paneTitle="New custom package"
            actionMenuItems={actionMenuItems}
            firstMenu={historyState && historyState.eholdings && (
              <IconButton
                icon="left-arrow"
                ariaLabel="Go back"
                onClick={this.handleCancel}
                data-test-eholdings-details-view-back-button
              />
            )}
            lastMenu={(
              <Fragment>
                {request.isPending && (
                  <Icon icon="spinner-ellipsis" />
                )}
                <PaneHeaderButton
                  disabled={pristine || request.isPending}
                  type="submit"
                  buttonStyle="primary"
                  data-test-eholdings-package-create-save-button
                >
                  {request.isPending ? 'Saving' : 'Save'}
                </PaneHeaderButton>
              </Fragment>
            )}
          />

          <div className={styles['package-create-form-container']}>
            <DetailsViewSection label="Package information" separator={false}>
              <NameField />
              <ContentTypeField />
            </DetailsViewSection>
            <DetailsViewSection label="Coverage settings">
              <CoverageFields />
            </DetailsViewSection>
          </div>
        </form>
        <NavigationModal when={!pristine && !request.isResolved} />
      </div>
    );
  }
}

const validate = (values, props) => {
  return Object.assign({}, validatePackageName(values, props), validateCoverageDates(values, props));
};

export default injectIntl(reduxForm({
  validate,
  enableReinitialize: true,
  form: 'PackageCreate',
  destroyOnUnmount: false
})(PackageCreate));
