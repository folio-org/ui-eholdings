import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';

import {
  Icon
} from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';
import DetailsView from '../../details-view';
import NameField, { validate as validateName } from '../_fields/name';
import EditionField, { validate as validateEdition } from '../_fields/edition';
import PublisherNameField, { validate as validatePublisher } from '../_fields/publisher-name';
import PublicationTypeField from '../_fields/publication-type';
import IdentifiersFields, { validate as validateIdentifiers } from '../_fields/identifiers';
import DescriptionField, { validate as validateDescription } from '../_fields/description';
import ContributorField, { validate as validateContributor } from '../_fields/contributor';
import PeerReviewedField from '../_fields/peer-reviewed';
import DetailsViewSection from '../../details-view-section';
import NavigationModal from '../../navigation-modal';
import Toaster from '../../toaster';
import PaneHeaderButton from '../../pane-header-button';
import styles from './title-edit.css';

class TitleEdit extends Component {
  static propTypes = {
    fullViewLink: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object
    ]),
    handleSubmit: PropTypes.func,
    initialValues: PropTypes.object.isRequired,
    model: PropTypes.object.isRequired,
    onCancel: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    pristine: PropTypes.bool,
    updateRequest: PropTypes.object.isRequired,
  };

  render() {
    let {
      model,
      handleSubmit,
      onSubmit,
      pristine,
      updateRequest,
      initialValues,
      onCancel,
      fullViewLink
    } = this.props;

    let actionMenuItems = [
      {
        'label': <FormattedMessage id="ui-eholdings.actionMenu.cancelEditing" />,
        'onClick': onCancel,
        'data-test-eholdings-title-cancel-action': true
      }
    ];

    if (fullViewLink) {
      actionMenuItems.push({
        label: <FormattedMessage id="ui-eholdings.actionMenu.fullView" />,
        to: fullViewLink,
        className: styles['full-view-link']
      });
    }

    return (
      <Fragment>
        <Toaster
          position="bottom"
          toasts={updateRequest.errors.map(({ title }, index) => ({
            id: `error-${updateRequest.timestamp}-${index}`,
            message: title,
            type: 'error'
          }))}
        />

        <form onSubmit={handleSubmit(onSubmit)}>
          <DetailsView
            type="title"
            model={model}
            paneTitle={model.name}
            actionMenuItems={actionMenuItems}
            lastMenu={(
              <Fragment>
                {model.update.isPending && (
                  <Icon icon="spinner-ellipsis" />
                )}
                <PaneHeaderButton
                  disabled={pristine || model.update.isPending}
                  type="submit"
                  buttonStyle="primary"
                  data-test-eholdings-title-save-button
                >
                  {model.update.isPending ? (<FormattedMessage id="ui-eholdings.saving" />) : (<FormattedMessage id="ui-eholdings.save" />)}
                </PaneHeaderButton>
              </Fragment>
            )}
            bodyContent={(
              <Fragment>
                <DetailsViewSection
                  label={<FormattedMessage id="ui-eholdings.title.titleInformation" />}
                >
                  <NameField />

                  <ContributorField
                    initialValue={initialValues.contributors}
                  />

                  <EditionField />
                  <PublisherNameField />
                  <PublicationTypeField />

                  <IdentifiersFields
                    initialValue={initialValues.identifiers}
                  />

                  <DescriptionField />
                  <PeerReviewedField />
                </DetailsViewSection>
                <NavigationModal
                  modalLabel={<FormattedMessage id="ui-eholdings.navModal.modalLabel" />}
                  continueLabel={<FormattedMessage id="ui-eholdings.navModal.continueLabel" />}
                  dismissLabel={<FormattedMessage id="ui-eholdings.navModal.dismissLabel" />}
                  when={!pristine && !updateRequest.isResolved}
                />
              </Fragment>
            )}
          />
        </form>
      </Fragment>
    );
  }
}

const validate = (values) => {
  return Object.assign({},
    validateName(values),
    validateContributor(values),
    validateEdition(values),
    validatePublisher(values),
    validateIdentifiers(values),
    validateDescription(values));
};

export default reduxForm({
  validate,
  enableReinitialize: true,
  form: 'TitleEdit',
  destroyOnUnmount: false,
})(TitleEdit);
