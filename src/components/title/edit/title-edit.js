import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';

import {
  Icon
} from '@folio/stripes-components';
import { FormattedMessage, intlShape, injectIntl } from 'react-intl';
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
    model: PropTypes.object.isRequired,
    initialValues: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    pristine: PropTypes.bool,
    updateRequest: PropTypes.object.isRequired,
    intl: intlShape.isRequired,
    fullViewLink: PropTypes.object,
  };

  render() {
    let {
      model,
      handleSubmit,
      onSubmit,
      pristine,
      updateRequest,
      initialValues,
      intl,
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
                  label={intl.formatMessage({ id: 'ui-eholdings.title.titleInformation' })}
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
                  modalLabel={intl.formatMessage({ id: 'ui-eholdings.navModal.modalLabel' })}
                  continueLabel={intl.formatMessage({ id: 'ui-eholdings.navModal.continueLabel' })}
                  dismissLabel={intl.formatMessage({ id: 'ui-eholdings.navModal.dismissLabel' })}
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

const validate = (values, props) => {
  return Object.assign({},
    validateName(values, props),
    validateContributor(values, props),
    validateEdition(values, props),
    validatePublisher(values, props),
    validateIdentifiers(values, props),
    validateDescription(values, props));
};

export default injectIntl(reduxForm({
  validate,
  enableReinitialize: true,
  form: 'TitleEdit',
  destroyOnUnmount: false,
})(TitleEdit));
