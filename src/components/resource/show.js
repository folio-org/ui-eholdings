import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  Button,
  IconButton,
  Icon,
  KeyValue,
  PaneMenu
} from '@folio/stripes-components';

import DetailsView from '../details-view';
import Link from '../link';
import IdentifiersList from '../identifiers-list';
import ContributorsList from '..//contributors-list';
import CoverageDateList from '../coverage-date-list';
import { isBookPublicationType, isValidCoverageList, processErrors } from '../utilities';
import Modal from '../modal';
import DetailsViewSection from '../details-view-section';
import Toaster from '../toaster';

export default class ResourceShow extends Component {
  static propTypes = {
    model: PropTypes.object.isRequired,
    toggleSelected: PropTypes.func.isRequired
  };

  static contextTypes = {
    router: PropTypes.object
  };

  state = {
    showSelectionModal: false,
    resourceSelected: this.props.model.isSelected
  };

  static getDerivedStateFromProps({ model }, prevState) {
    return !model.isSaving ?
      { ...prevState, resourceSelected: model.isSelected } :
      prevState;
  }

  handleHoldingStatus = () => {
    if (this.props.model.isSelected) {
      this.setState({ showSelectionModal: true });
    } else {
      this.props.toggleSelected();
    }
  };

  commitSelectionToggle = () => {
    this.setState({
      showSelectionModal: false,
      resourceSelected: false
    });
    this.props.toggleSelected();
  };

  cancelSelectionToggle = () => {
    this.setState({
      showSelectionModal: false,
      resourceSelected: this.props.model.isSelected
    });
  };

  render() {
    let { model } = this.props;
    let { router } = this.context;
    let {
      showSelectionModal,
      resourceSelected
    } = this.state;

    let isSelectInFlight = model.update.isPending && 'isSelected' in model.update.changedAttributes;
    let visibilityMessage = model.package.visibilityData.isHidden
      ? '(All titles in this package are hidden)'
      : model.visibilityData.reason && `(${model.visibilityData.reason})`;

    let hasManagedCoverages = model.managedCoverages.length > 0 &&
      isValidCoverageList(model.managedCoverages);
    let hasManagedEmbargoPeriod = model.managedEmbargoPeriod &&
      model.managedEmbargoPeriod.embargoUnit &&
      model.managedEmbargoPeriod.embargoValue;
    let customEmbargoValue = model.customEmbargoPeriod && model.customEmbargoPeriod.embargoValue;
    let customEmbargoUnit = model.customEmbargoPeriod && model.customEmbargoPeriod.embargoUnit;
    let hasCustomEmbargoPeriod = model.customEmbargoPeriod &&
      model.customEmbargoPeriod.embargoUnit &&
      model.customEmbargoPeriod.embargoValue;
    let hasCustomCoverages = model.customCoverages.length > 0 &&
    isValidCoverageList(model.customCoverages);

    let actionMenuItems = [
      {
        label: 'Edit',
        to: {
          pathname: `/eholdings/resources/${model.id}/edit`,
          state: { eholdings: true }
        }
      }
    ];

    let toasts = processErrors(model);

    // if coming from updating any value on managed title in a managed package
    // show a success toast
    if (router.history.action === 'PUSH' &&
        router.history.location.state &&
        router.history.location.state.isFreshlySaved) {
      toasts.push({
        id: `success-package-creation-${model.id}`,
        message: 'Title was updated.',
        type: 'success'
      });
    }

    if (resourceSelected === true) {
      actionMenuItems.push({
        'label': 'Remove title from holdings',
        'state': { eholdings: true },
        'onClick': this.handleHoldingStatus,
        'data-test-eholdings-remove-resource-from-holdings': true
      });
    } else if (resourceSelected === false) {
      actionMenuItems.push({
        'label': 'Add to holdings',
        'state': { eholdings: true },
        'onClick': this.handleHoldingStatus,
        'data-test-eholdings-add-resource-to-holdings': true
      });
    }

    return (
      <div>
        <Toaster toasts={toasts} position="bottom" />

        <DetailsView
          type="resource"
          model={model}
          paneTitle={model.title.name}
          paneSub={model.package.name}
          actionMenuItems={actionMenuItems}
          lastMenu={(
            <PaneMenu>
              <IconButton
                data-test-eholdings-resource-edit-link
                icon="edit"
                ariaLabel={`Edit ${model.title.name}`}
                to={{
                  pathname: `/eholdings/resources/${model.id}/edit`,
                  state: { eholdings: true }
                }}
              />
            </PaneMenu>
          )}
          bodyContent={(
            <div>
              <DetailsViewSection label="Title information">
                <KeyValue label="Title">
                  <Link to={`/eholdings/titles/${model.titleId}`}>
                    {model.title.name}
                  </Link>
                </KeyValue>

                {model.title.edition && (
                  <KeyValue label="Edition">
                    <div data-test-eholdings-resource-show-edition>
                      {model.title.edition}
                    </div>
                  </KeyValue>
                )}

                <ContributorsList data={model.title.contributors} />

                {model.title.publisherName && (
                  <KeyValue label="Publisher">
                    <div data-test-eholdings-resource-show-publisher-name>
                      {model.title.publisherName}
                    </div>
                  </KeyValue>
                )}

                {model.title.publicationType && (
                  <KeyValue label="Publication type">
                    <div data-test-eholdings-resource-show-publication-type>
                      {model.title.publicationType}
                    </div>
                  </KeyValue>
                )}

                <IdentifiersList data={model.title.identifiers} />

                {model.title.subjects.length > 0 && (
                  <KeyValue label="Subjects">
                    <div data-test-eholdings-resource-show-subjects-list>
                      {model.title.subjects.map(subjectObj => subjectObj.subject).join('; ')}
                    </div>
                  </KeyValue>
                )}

                <KeyValue label="Peer reviewed">
                  <div data-test-eholdings-peer-reviewed-field>
                    {model.title.isPeerReviewed ? 'Yes' : 'No'}
                  </div>
                </KeyValue>

                <KeyValue label="Title type">
                  <div data-test-eholdings-package-details-type>
                    {model.title.isTitleCustom ? 'Custom' : 'Managed'}
                  </div>
                </KeyValue>

                {model.title.description && (
                  <KeyValue label="Description">
                    <div data-test-eholdings-description-field>
                      {model.title.description}
                    </div>
                  </KeyValue>
                )}
              </DetailsViewSection>

              <DetailsViewSection label="Package information">
                <KeyValue label="Package">
                  <div data-test-eholdings-resource-show-package-name>
                    <Link to={`/eholdings/packages/${model.packageId}`}>{model.package.name}</Link>
                  </div>
                </KeyValue>

                <KeyValue label="Provider">
                  <div data-test-eholdings-resource-show-provider-name>
                    <Link to={`/eholdings/providers/${model.providerId}`}>{model.package.providerName}</Link>
                  </div>
                </KeyValue>

                {model.package.contentType && (
                  <KeyValue label="Content type">
                    <div data-test-eholdings-resource-show-content-type>
                      {model.package.contentType}
                    </div>
                  </KeyValue>
                )}
              </DetailsViewSection>

              <DetailsViewSection label="Resource settings">
                <KeyValue label="Show to patrons">
                  <div data-test-eholdings-resource-show-visibility>
                    {model.visibilityData.isHidden || !resourceSelected
                      ? `No ${visibilityMessage}`
                      : 'Yes'}
                  </div>
                </KeyValue>

                {model.url && (
                  <KeyValue label={`${model.title.isTitleCustom ? 'Custom' : 'Managed'} URL`}>
                    <div data-test-eholdings-resource-show-url>
                      <a href={model.url} target="_blank" rel="noopener noreferrer">{model.url}</a>
                    </div>
                  </KeyValue>
                )}
              </DetailsViewSection>

              <DetailsViewSection label="Holding status">
                <label
                  data-test-eholdings-resource-show-selected
                  htmlFor="resource-show-toggle-switch"
                >
                  {
                    model.update.isPending ? (
                      <Icon icon='spinner-ellipsis' />
                    ) : (
                      <h4>{resourceSelected ? 'Selected' : 'Not selected'}</h4>
                    )
                  }
                  <br />
                  { ((!resourceSelected && !isSelectInFlight) || (!this.props.model.isSelected && isSelectInFlight)) && (
                    <Button
                      buttonStyle="primary"
                      onClick={this.handleHoldingStatus}
                      disabled={model.destroy.isPending || isSelectInFlight}
                      data-test-eholdings-resource-add-to-holdings-button
                    >
                      Add to holdings
                    </Button>)}
                </label>
              </DetailsViewSection>

              <DetailsViewSection
                label="Coverage dates"
                closedByDefault={!hasManagedCoverages && !resourceSelected}
              >
                {hasManagedCoverages && (
                  <KeyValue label="Managed coverage dates">
                    <div data-test-eholdings-resource-show-managed-coverage-list>
                      <CoverageDateList
                        coverageArray={model.managedCoverages}
                        isYearOnly={isBookPublicationType(model.publicationType)}
                      />
                    </div>
                  </KeyValue>
                )}

                {(resourceSelected && !isSelectInFlight) && (
                <div>
                  {hasCustomCoverages && (
                  <KeyValue label="Custom coverage dates">
                    <span data-test-eholdings-resource-show-custom-coverage-list>
                      <CoverageDateList
                        coverageArray={model.customCoverages}
                        isYearOnly={isBookPublicationType(model.publicationType)}
                      />
                    </span>
                  </KeyValue>
                  )}
                </div>)}

                {!hasManagedCoverages && !hasCustomCoverages && (
                  <p data-test-eholdings-resource-no-coverage-date-label>No coverage date has been set.</p>
                )}

              </DetailsViewSection>
              <DetailsViewSection
                label="Coverage statement"
              >
                {(resourceSelected && !isSelectInFlight) ? (
                  <div>
                    {model.coverageStatement ? (
                      <span data-test-eholdings-resource-coverage-statement-display>
                        {model.coverageStatement}
                      </span>
                   ) : (<p data-test-eholdings-resource-no-coverage-label>No coverage statement has been set.</p>
                   )}
                  </div>
                ) : (
                  <p data-test-eholdings-resource-coverage-not-shown-label>Add the resource to holdings to set a coverage statement.</p>
                )}
              </DetailsViewSection>

              <DetailsViewSection
                label="Embargo period"
                closedByDefault={!hasManagedEmbargoPeriod && !resourceSelected}
              >
                {hasManagedEmbargoPeriod && (
                  <KeyValue label="Managed embargo period">
                    <div data-test-eholdings-resource-show-managed-embargo-period>
                      {model.managedEmbargoPeriod.embargoValue} {model.managedEmbargoPeriod.embargoUnit}
                    </div>
                  </KeyValue>
                )}

                {(resourceSelected && !isSelectInFlight) && (
                  <div>
                    {hasCustomEmbargoPeriod && (
                      <KeyValue label="Custom">
                        <span data-test-eholdings-resource-custom-embargo-display>
                          {customEmbargoValue} {customEmbargoUnit}
                        </span>
                      </KeyValue>
                   )}
                  </div>
                 )}

                {!hasManagedEmbargoPeriod && !hasCustomEmbargoPeriod && (
                <p data-test-eholdings-resource-no-embargo-label>No embargo period has been set.</p>
                )}
              </DetailsViewSection>
            </div>
          )}
        />

        <Modal
          open={showSelectionModal}
          size="small"
          label="Remove resource from holdings?"
          scope="root"
          id="eholdings-resource-deselection-confirmation-modal"
          footer={(
            <div>
              <Button
                buttonStyle="primary"
                onClick={this.commitSelectionToggle}
                data-test-eholdings-resource-deselection-confirmation-modal-yes
              >
                Yes, remove
              </Button>
              <Button
                onClick={this.cancelSelectionToggle}
                data-test-eholdings-resource-deselection-confirmation-modal-no
              >
                No, do not remove
              </Button>
            </div>
          )}
        >
          {
            /*
               we use <= here to account for the case where a user
               selects and then immediately deselects the
               resource
            */
            (model.title.resources.length <= 1 && model.title.isTitleCustom) ? (
              <span data-test-eholdings-deselect-final-title-warning>
                Are you sure you want to remove this title from your holdings?
                It is also the last title selected in this package. By removing
                this title, you will also remove this package from your holdings
                and all customizations will be lost.
              </span>
            ) : (
              <span data-test-eholdings-deselect-title-warning>
                Are you sure you want to remove this title from your holdings?
                All customizations will be lost.
              </span>
            )
          }
        </Modal>
      </div>
    );
  }
}
