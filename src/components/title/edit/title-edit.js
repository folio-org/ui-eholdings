import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import createFocusDecorator from 'final-form-focus';

import {
  Button,
  Icon
} from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';
import DetailsView from '../../details-view';
import NameField from '../_fields/name';
import EditionField from '../_fields/edition';
import PublisherNameField from '../_fields/publisher-name';
import PublicationTypeField from '../_fields/publication-type';
import IdentifiersFields from '../_fields/identifiers';
import DescriptionField from '../_fields/description';
import ContributorField from '../_fields/contributor';
import PeerReviewedField from '../_fields/peer-reviewed';
import DetailsViewSection from '../../details-view-section';
import NavigationModal from '../../navigation-modal';
import Toaster from '../../toaster';
import PaneHeaderButton from '../../pane-header-button';
import FullViewLink from '../../full-view-link';

const focusOnErrors = createFocusDecorator();

export default class TitleEdit extends Component {
  static propTypes = {
    fullViewLink: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object
    ]),
    initialValues: PropTypes.object.isRequired,
    model: PropTypes.object.isRequired,
    onCancel: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    updateRequest: PropTypes.object.isRequired,
  };

  getActionMenu = ({ onToggle }) => {
    const {
      fullViewLink,
      onCancel
    } = this.props;

    return (
      <Fragment>
        <Button
          data-test-eholdings-title-cancel-action
          buttonStyle="dropdownItem fullWidth"
          onClick={() => {
            onToggle();
            onCancel();
          }}
        >
          <FormattedMessage id="ui-eholdings.actionMenu.cancelEditing" />
        </Button>

        {fullViewLink && (
          <FullViewLink to={fullViewLink} />
        )}
      </Fragment>
    );
  }

  render() {
    let {
      initialValues,
      model,
      onSubmit,
      updateRequest
    } = this.props;

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
        <Form
          onSubmit={onSubmit}
          initialValues={initialValues}
          decorators={[focusOnErrors]}
          mutators={{ ...arrayMutators }}
          render={({ handleSubmit, pristine }) => (
            <Fragment>
              <form onSubmit={handleSubmit}>
                <DetailsView
                  type="title"
                  model={model}
                  paneTitle={model.name}
                  actionMenu={this.getActionMenu}
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
                        <ContributorField />
                        <EditionField />
                        <PublisherNameField />
                        <PublicationTypeField />
                        <IdentifiersFields />
                        <DescriptionField />
                        <PeerReviewedField />
                      </DetailsViewSection>
                    </Fragment>
                  )}
                />
              </form>

              <NavigationModal when={!pristine && !updateRequest.isResolved} />
            </Fragment>
          )}
        />
      </Fragment>
    );
  }
}
