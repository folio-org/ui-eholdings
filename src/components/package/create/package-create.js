import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import { intlShape, injectIntl, FormattedMessage } from 'react-intl';

import {
  Icon,
  IconButton,
  PaneHeader
} from '@folio/stripes/components';

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
    handleSubmit: PropTypes.func.isRequired,
    intl: intlShape.isRequired,
    onCancel: PropTypes.func,
    onSubmit: PropTypes.func.isRequired,
    pristine: PropTypes.bool.isRequired,
    request: PropTypes.object.isRequired
  };

  render() {
    let {
      intl,
      request,
      handleSubmit,
      onSubmit,
      onCancel,
      pristine
    } = this.props;

    let actionMenuItems = [];

    if (!request.isPending && onCancel) {
      actionMenuItems.push({
        'label': intl.formatMessage({ id: 'ui-eholdings.actionMenu.cancelEditing' }),
        'state': { eholdings: true },
        'onClick': onCancel,
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
            paneTitle={<FormattedMessage id="ui-eholdings.package.create.custom" />}
            actionMenuItems={actionMenuItems}
            firstMenu={onCancel && (
              <FormattedMessage id="ui-eholdings.label.icon.goBack">
                {ariaLabel => (
                  <IconButton
                    icon="left-arrow"
                    ariaLabel={ariaLabel}
                    onClick={onCancel}
                    data-test-eholdings-details-view-back-button
                  />
                )}
              </FormattedMessage>
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
                  {request.isPending ?
                    (<FormattedMessage id="ui-eholdings.saving" />)
                    : (<FormattedMessage id="ui-eholdings.save" />)
                  }
                </PaneHeaderButton>
              </Fragment>
            )}
          />

          <div className={styles['package-create-form-container']}>
            <DetailsViewSection
              label={<FormattedMessage id="ui-eholdings.package.packageInformation" />}
              separator={false}
            >
              <NameField />
              <ContentTypeField />
            </DetailsViewSection>
            <DetailsViewSection
              label={<FormattedMessage id="ui-eholdings.label.coverageSettings" />}
            >
              <CoverageFields />
            </DetailsViewSection>
          </div>
        </form>
        <NavigationModal
          modalLabel={intl.formatMessage({ id: 'ui-eholdings.navModal.modalLabel' })}
          continueLabel={intl.formatMessage({ id: 'ui-eholdings.navModal.continueLabel' })}
          dismissLabel={intl.formatMessage({ id: 'ui-eholdings.navModal.dismissLabel' })}
          when={!pristine && !request.isResolved}
        />
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
