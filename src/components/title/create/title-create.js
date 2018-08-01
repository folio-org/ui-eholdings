import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';

import {
  Icon,
  IconButton,
  PaneHeader
} from '@folio/stripes-components';

import { intlShape, injectIntl } from 'react-intl';
import DetailsViewSection from '../../details-view-section';
import NameField, { validate as validateName } from '../_fields/name';
import EditionField, { validate as validateEdition } from '../_fields/edition';
import PublisherNameField, { validate as validatePublisherName } from '../_fields/publisher-name';
import PackageSelectField, { validate as validatePackageSelection } from '../_fields/package-select';
import ContributorField, { validate as validateContributor } from '../_fields/contributor';
import IdentifiersFields, { validate as validateIdentifiers } from '../_fields/identifiers';
import DescriptionField, { validate as validateDescription } from '../_fields/description';
import PublicationTypeField from '../_fields/publication-type';
import PeerReviewedField from '../_fields/peer-reviewed';
import NavigationModal from '../../navigation-modal';
import Toaster from '../../toaster';
import PaneHeaderButton from '../../pane-header-button';
import styles from './title-create.css';

class TitleCreate extends Component {
  static propTypes = {
    request: PropTypes.object.isRequired,
    customPackages: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    pristine: PropTypes.bool.isRequired,
    intl: intlShape.isRequired
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
      customPackages,
      handleSubmit,
      onSubmit,
      pristine,
      intl
    } = this.props;

    let {
      router
    } = this.context;

    let historyState = router.history.location.state;

    let packageOptions = customPackages.map(pkg => ({
      label: pkg.name,
      value: pkg.id
    }));

    let actionMenuItems = [];

    if (!request.isPending) {
      actionMenuItems.push({
        'label': intl.formatMessage({ id: 'ui-eholdings.actionMenu.cancelEditing' }),
        'state': { eholdings: true },
        'onClick': this.handleCancel,
        'data-test-eholdings-title-create-cancel-action': true
      });
    }

    return (
      <div data-test-eholdings-title-create>
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
            paneTitle={intl.formatMessage({ id: 'ui-eholdings.title.create.paneTitle' })}
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
                  data-test-eholdings-title-create-save-button
                >
                  {request.isPending ? intl.formatMessage({ id: 'ui-eholdings.saving' }) : intl.formatMessage({ id: 'ui-eholdings.save' })}
                </PaneHeaderButton>
              </Fragment>
            )}
          />

          <div className={styles['title-create-form-container']}>
            <DetailsViewSection label={intl.formatMessage({ id: 'ui-eholdings.title.titleInformation' })} separator={false}>
              <NameField />
              <ContributorField />
              <EditionField />
              <PublisherNameField />
              <PublicationTypeField />
              <IdentifiersFields />
              <DescriptionField />
              <PeerReviewedField />
            </DetailsViewSection>
            <DetailsViewSection label={intl.formatMessage({ id: 'ui-eholdings.label.packageInformation' })}>
              <PackageSelectField options={packageOptions} />
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
  return Object.assign({},
    validateName(values, props),
    validateContributor(values),
    validateEdition(values),
    validatePublisherName(values),
    validateIdentifiers(values),
    validateDescription(values),
    validatePackageSelection(values));
};

export default injectIntl(reduxForm({
  validate,
  enableReinitialize: true,
  form: 'TitleCreate',
  destroyOnUnmount: false
})(TitleCreate));
