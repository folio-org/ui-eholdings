import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';

import {
  Button,
  Icon,
  IconButton,
  PaneHeader,
  PaneMenu
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

        <PaneHeader
          paneTitle={intl.formatMessage({ id: 'ui-eholdings.title.create.paneTitle' })}
          firstMenu={historyState && historyState.eholdings && (
            <PaneMenu>
              <div data-test-eholdings-details-view-back-button>
                <IconButton
                  icon="left-arrow"
                  ariaLabel="Go back"
                  onClick={this.handleCancel}
                />
              </div>
            </PaneMenu>
          )}
        />

        <div className={styles['title-create-form-container']}>
          <form onSubmit={handleSubmit(onSubmit)}>
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
            <DetailsViewSection label={intl.formatMessage({ id: 'ui-eholdings.packageInformation' })}>
              <PackageSelectField options={packageOptions} />
            </DetailsViewSection>
            <div className={styles['title-create-action-buttons']}>
              <div data-test-eholdings-title-create-cancel-button>
                <Button
                  disabled={request.isPending}
                  type="button"
                  onClick={this.handleCancel}
                >
                  {intl.formatMessage({ id: 'ui-eholdings.cancel' })}
                </Button>
              </div>
              <div data-test-eholdings-title-create-save-button>
                <Button
                  disabled={pristine || request.isPending}
                  type="submit"
                  buttonStyle="primary"
                >
                  {request.isPending ? intl.formatMessage({ id: 'ui-eholdings.saving' }) : intl.formatMessage({ id: 'ui-eholdings.save' })}
                </Button>
              </div>
              {request.isPending && (
              <Icon icon="spinner-ellipsis" />
                )}
            </div>
          </form>
        </div>

        <NavigationModal when={!pristine && !request.isResolved} />
      </div>
    );
  }
}

const validate = (values) => {
  return Object.assign({},
    validateName(values),
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
