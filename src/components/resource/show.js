import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  Button,
  IconButton,
  KeyValue,
  PaneMenu
} from '@folio/stripes-components';

import DetailsView from '../details-view';
import Link from '../link';
import IdentifiersList from '../identifiers-list';
import ContributorsList from '..//contributors-list';
import ToggleSwitch from '../toggle-switch';
import CoverageDateList from '../coverage-date-list';
import { isBookPublicationType, isValidCoverageList, processErrors } from '../utilities';
import Modal from '../modal';
import CustomCoverage from './_forms/custom-coverage';
import CustomEmbargo from './_forms/custom-embargo';
import CoverageStatement from './_forms/coverage-statement';
import NavigationModal from '../navigation-modal';
import DetailsViewSection from '../details-view-section';
import Toaster from '../toaster';

export default class ResourceShow extends Component {
  static propTypes = {
    model: PropTypes.object.isRequired,
    toggleSelected: PropTypes.func.isRequired,
    toggleHidden: PropTypes.func.isRequired,
    customEmbargoSubmitted: PropTypes.func.isRequired,
    coverageSubmitted: PropTypes.func.isRequired,
    coverageStatementSubmitted: PropTypes.func.isRequired
  };

  static contextTypes = {
    locale: PropTypes.string,
    router: PropTypes.object,
    intl: PropTypes.object
  };

  state = {
    showSelectionModal: false,
    resourceSelected: this.props.model.isSelected,
    resourceHidden: this.props.model.visibilityData.isHidden,
    isCoverageEditable: false,
    isEmbargoEditable: false,
    isCoverageStatementEditable: false
  };

  componentWillReceiveProps({ model }) {
    if (!model.isSaving) {
      this.setState({
        resourceSelected: model.isSelected,
        resourceHidden: model.visibilityData.isHidden
      });
    }
  }

  handleSelectionToggle = () => {
    this.setState({ resourceSelected: !this.props.model.isSelected });
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

  handleCoverageEdit = (isCoverageEditable) => {
    this.setState({ isCoverageEditable });
  };

  handleEmbargoEdit = (isEmbargoEditable) => {
    this.setState({ isEmbargoEditable });
  };

  handleCoverageStatementEdit = (isCoverageStatementEditable) => {
    this.setState({ isCoverageStatementEditable });
  };

  render() {
    let { model, customEmbargoSubmitted, coverageSubmitted, coverageStatementSubmitted } = this.props;
    let { locale, intl, router } = this.context;
    let {
      showSelectionModal,
      resourceSelected,
      resourceHidden,
      isCoverageEditable,
      isEmbargoEditable,
      isCoverageStatementEditable
    } = this.state;

    let hasManagedCoverages = model.managedCoverages.length > 0 &&
      isValidCoverageList(model.managedCoverages);
    let hasManagedEmbargoPeriod = model.managedEmbargoPeriod &&
      model.managedEmbargoPeriod.embargoUnit &&
      model.managedEmbargoPeriod.embargoValue;
    let customEmbargoValue = model.customEmbargoPeriod && model.customEmbargoPeriod.embargoValue;
    let customEmbargoUnit = model.customEmbargoPeriod && model.customEmbargoPeriod.embargoUnit;

    // in the event that the resource lacks custom coverage, we must
    // add an artificial "blank" row of coverage at this level so
    // the form initializes correctly when adding coverage.  unfortunately,
    // due to redux-form eccentricity, we cannot do this in the CoverageForm
    // component itself.  instead we clone the coverages off the model here,
    // as mutating the model directly will break all other customizations.
    let customCoverages = [...model.customCoverages];
    if (customCoverages.length === 0 && model.isSelected) {
      customCoverages = [{
        beginCoverage: '',
        endCoverage: ''
      }];
    }

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

              {model.url && (
                <DetailsViewSection label="Resource information">
                  <KeyValue label={`${model.title.isTitleCustom ? 'Custom' : 'Managed'} URL`}>
                    <div data-test-eholdings-resource-show-url>
                      <a href={model.url} target="_blank">{model.url}</a>
                    </div>
                  </KeyValue>
                </DetailsViewSection>
              )}

              <DetailsViewSection label="Holding status">
                <label
                  data-test-eholdings-resource-show-selected
                  htmlFor="resource-show-toggle-switch"
                >
                  <h4>{resourceSelected ? 'Selected' : 'Not selected'}</h4>
                  <br />
                  <ToggleSwitch
                    onChange={this.handleSelectionToggle}
                    checked={model.destroy.isPending ? false : resourceSelected}
                    isPending={model.destroy.isPending ||
                    (model.update.isPending && 'isSelected' in model.update.changedAttributes)}
                    id="resource-show-toggle-switch"
                  />
                </label>
              </DetailsViewSection>
              <DetailsViewSection label="Visibility">
                {resourceSelected ? (
                  <div>
                    <label
                      data-test-eholdings-resource-toggle-hidden
                      htmlFor="resource-show-hide-toggle-switch"
                    >
                      <h4>
                        {model.visibilityData.isHidden
                          ? 'Hidden from patrons'
                          : 'Visible to patrons'}
                      </h4>
                      <br />
                      <ToggleSwitch
                        onChange={this.props.toggleHidden}
                        checked={!resourceHidden}
                        isPending={model.update.isPending &&
                          ('visibilityData' in model.update.changedAttributes)}
                        id="resource-show-hide-toggle-switch"
                      />
                    </label>

                    {model.visibilityData.isHidden && (
                      <div data-test-eholdings-resource-toggle-hidden-reason>
                        {model.package.visibilityData.isHidden
                          ? 'All titles in this package are hidden.'
                          : model.visibilityData.reason}
                      </div>
                    )}
                  </div>
                ) : (
                  <p>Not shown to patrons.</p>
                )}
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

                {resourceSelected && (
                  <CustomCoverage
                    initialValues={{ customCoverages }}
                    packageCoverage={model.package.customCoverage}
                    isEditable={isCoverageEditable}
                    onEdit={this.handleCoverageEdit}
                    onSubmit={coverageSubmitted}
                    isPending={model.update.isPending && 'customCoverages' in model.update.changedAttributes}
                    locale={locale}
                    intl={intl}
                  />
                )}

                {!hasManagedCoverages && !resourceSelected && (
                  <p>Add the resource to holdings to set custom coverage dates.</p>
                )}

              </DetailsViewSection>

              <DetailsViewSection
                label="Coverage statement"
              >
                {resourceSelected && (
                  <CoverageStatement
                    initialValues={{ coverageStatement: model.coverageStatement }}
                    isEditable={isCoverageStatementEditable}
                    onEdit={this.handleCoverageStatementEdit}
                    onSubmit={coverageStatementSubmitted}
                    isPending={model.update.isPending && 'coverageStatement' in model.update.changedAttributes}
                  />
                )}

                {!hasManagedEmbargoPeriod && !resourceSelected && (
                  <p>Add the resource to holdings to set a coverage statement.</p>
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

                {resourceSelected && (
                  <CustomEmbargo
                    initialValues={{ customEmbargoValue, customEmbargoUnit }}
                    isEditable={isEmbargoEditable}
                    onEdit={this.handleEmbargoEdit}
                    onSubmit={customEmbargoSubmitted}
                    isPending={model.update.isPending && 'customEmbargoPeriod' in model.update.changedAttributes}
                  />
                )}

                {!hasManagedEmbargoPeriod && !resourceSelected && (
                  <p>Add the resource to holdings to set an custom embargo period.</p>
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
            model.package.selectedCount <= 1 ? (
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

        <NavigationModal when={isCoverageEditable || isEmbargoEditable || isCoverageStatementEditable} />
      </div>
    );
  }
}
