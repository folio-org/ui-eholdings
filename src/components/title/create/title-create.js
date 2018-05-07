import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';

import {
  Button,
  IconButton,
  PaneHeader,
  PaneMenu
} from '@folio/stripes-components';

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
    pristine: PropTypes.bool.isRequired
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
      pristine
    } = this.props;

    let {
      router
    } = this.context;

    let historyState = router.history.location.state;

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
          paneTitle="New custom title"
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
            <DetailsViewSection label="Title information" separator={false}>
              <NameField />
              <ContributorField />
              <EditionField />
              <PublisherNameField />
              <PublicationTypeField />
              <IdentifiersFields />
              <DescriptionField />
              <PeerReviewedField />
            </DetailsViewSection>
            <DetailsViewSection label="Package information">
              <PackageSelectField packages={customPackages} />
            </DetailsViewSection>
            <div className={styles['title-create-action-buttons']}>
              <div data-test-eholdings-title-create-cancel-button>
                <Button type="button" onClick={this.handleCancel}>
                  Cancel
                </Button>
              </div>
              <div data-test-eholdings-title-create-save-button>
                <Button type="submit" buttonStyle="primary">
                  Save
                </Button>
              </div>
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

export default reduxForm({
  validate,
  enableReinitialize: true,
  form: 'TitleCreate',
  destroyOnUnmount: false
})(TitleCreate);
