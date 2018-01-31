import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from '@folio/stripes-components/lib/Icon';
import IconButton from '@folio/stripes-components/lib/IconButton';
import PaneHeader from '@folio/stripes-components/lib/PaneHeader';
import PaneMenu from '@folio/stripes-components/lib/PaneMenu';
import Button from '@folio/stripes-components/lib/Button';

import Link from '../link';
import KeyValueLabel from '../key-value-label';
import IdentifiersList from '../identifiers-list';
import ContributorsList from '../contributors-list';
import ToggleSwitch from '../toggle-switch';
import CoverageDates from '../coverage-dates';
import { isBookPublicationType, isValidCoverageList } from '../utilities';
import Modal from '../modal';
import styles from './customer-resource-show.css';

export default class CustomerResourceShow extends Component {
  static propTypes = {
    model: PropTypes.object.isRequired,
    toggleSelected: PropTypes.func.isRequired,
    toggleHidden: PropTypes.func.isRequired
  };

  static contextTypes = {
    router: PropTypes.object,
    queryParams: PropTypes.object
  };

  state = {
    showSelectionModal: false,
    resourceSelected: this.props.model.isSelected,
    resourceHidden: this.props.model.visibilityData.isHidden
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
    this.setState({ showSelectionModal: false });
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
    let { router, queryParams } = this.context;
    let { showSelectionModal, resourceSelected } = this.state;

    let historyState = router.history.location.state;
    let hasManagedCoverages = model.managedCoverages.length > 0 &&
      isValidCoverageList(model.managedCoverages);
    let hasManagedEmbargoPeriod = model.managedEmbargoPeriod &&
      model.managedEmbargoPeriod.embargoUnit &&
      model.managedEmbargoPeriod.embargoValue;
    let hasCustomEmbargoPeriod = model.customEmbargoPeriod &&
      model.customEmbargoPeriod.embargoUnit &&
      model.customEmbargoPeriod.embargoValue;

    return (
      <div>
        {!queryParams.searchType && (
          <PaneHeader
            firstMenu={historyState && historyState.eholdings && (
              <PaneMenu>
                <div data-test-eholdings-customer-resource-show-back-button>
                  <IconButton icon="left-arrow" onClick={() => router.history.goBack()} />
                </div>
              </PaneMenu>
            )}
          />
        )}
        <div className={styles['detail-container']} data-test-eholdings-customer-resource-show>
          {model.isLoaded ? (
            <div>
              <div className={styles['detail-container-header']}>
                <KeyValueLabel label="Resource">
                  <h1 data-test-eholdings-customer-resource-show-title-name>
                    {model.name}
                  </h1>
                </KeyValueLabel>
              </div>

              <ContributorsList data={model.contributors} />

              <KeyValueLabel label="Publisher">
                <div data-test-eholdings-customer-resource-show-publisher-name>
                  {model.publisherName}
                </div>
              </KeyValueLabel>

              <KeyValueLabel label="Publication Type">
                <div data-test-eholdings-customer-resource-show-publication-type>
                  {model.publicationType}
                </div>
              </KeyValueLabel>

              <IdentifiersList data={model.identifiers} />

              {model.subjects.length > 0 && (
                <KeyValueLabel label="Subjects">
                  <div data-test-eholdings-customer-resource-show-subjects-list>
                    {model.subjects.map(subjectObj => subjectObj.subject).join('; ')}
                  </div>
                </KeyValueLabel>
              ) }

              <KeyValueLabel label="Package">
                <div data-test-eholdings-customer-resource-show-package-name>
                  <Link to={`/eholdings/packages/${model.packageId}`}>{model.packageName}</Link>
                </div>
              </KeyValueLabel>

              {model.contentType && (
                <KeyValueLabel label="Content Type">
                  <div data-test-eholdings-customer-resource-show-content-type>
                    {model.contentType}
                  </div>
                </KeyValueLabel>
              ) }

              <KeyValueLabel label="Provider">
                <div data-test-eholdings-customer-resource-show-provider-name>
                  <Link to={`/eholdings/providers/${model.providerId}`}>{model.providerName}</Link>
                </div>
              </KeyValueLabel>

              {model.url && (
                <KeyValueLabel label="Managed URL">
                  <div data-test-eholdings-customer-resource-show-managed-url>
                    <a href={model.url} target="_blank">{model.url}</a>
                  </div>
                </KeyValueLabel>
              ) }

              {hasManagedCoverages && (
                <KeyValueLabel label="Managed Coverage Dates">
                  <CoverageDates
                    coverageArray={model.managedCoverages}
                    id="customer-resource-show-managed-coverage-list"
                    isYearOnly={isBookPublicationType(model.publicationType)}
                  />
                </KeyValueLabel>
              )}

              {hasManagedEmbargoPeriod && (
                <KeyValueLabel label="Managed Embargo Period">
                  <div data-test-eholdings-customer-resource-show-managed-embargo-period>
                    {model.managedEmbargoPeriod.embargoValue} {model.managedEmbargoPeriod.embargoUnit}
                  </div>
                </KeyValueLabel>
              )}

              {hasCustomEmbargoPeriod && (
                <KeyValueLabel label="Custom Embargo Period">
                  <div data-test-eholdings-customer-resource-show-custom-embargo-period>
                    {model.customEmbargoPeriod.embargoValue} {model.customEmbargoPeriod.embargoUnit}
                  </div>
                </KeyValueLabel>
              )}

              <hr />

              <label
                data-test-eholdings-customer-resource-show-selected
                htmlFor="customer-resource-show-toggle-switch"
              >
                <h4>{model.isSelected ? 'Selected' : 'Not Selected'}</h4>
                <ToggleSwitch
                  onChange={this.handleSelectionToggle}
                  checked={resourceSelected}
                  isPending={model.update.isPending && 'isSelected' in model.update.changedAttributes}
                  id="customer-resource-show-toggle-switch"
                />
              </label>

              <hr />

              <label
                data-test-eholdings-customer-resource-toggle-hidden
                htmlFor="customer-resource-show-hide-toggle-switch"
              > {
                  model.package.visibilityData.isHidden ? (
                    <div>
                      <h4>Hidden from patrons</h4>
                      <div className={styles['flex-container']}>
                        <div className={styles['flex-item']}>
                          <ToggleSwitch
                            id="customer-resource-show-hide-toggle-switch"
                            checked={false}
                            disabled
                          />
                        </div>

                        <div className={styles['flex-item']}>
                          {
                            <p data-test-eholdings-customer-resource-toggle-hidden-reason>
                              All titles in this package are hidden.
                            </p>
                          }
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h4>{model.visibilityData.isHidden ? 'Hidden from patrons' : 'Visible to patrons'}</h4>
                      <div className={styles['flex-container']}>
                        <div className={styles['flex-item']}>
                          { resourceSelected ? (
                            <ToggleSwitch
                              onChange={this.props.toggleHidden}
                              checked={!model.visibilityData.isHidden}
                              isPending={model.update.isPending}
                              id="customer-resource-show-hide-toggle-switch"
                            />
                          ) : (
                            <ToggleSwitch
                              checked
                              disabled
                              id="customer-resource-show-hide-toggle-switch"
                            />
                          )
                          }
                        </div>
                        <div className={styles['flex-item']}>
                          {
                            model.visibilityData.isHidden ? (
                              <p data-test-eholdings-customer-resource-toggle-hidden-reason>
                                {model.visibilityData.reason}
                              </p>
                            ) : (
                              <p data-test-eholdings-customer-resource-toggle-hidden-reason />
                            )
                          }
                        </div>
                      </div>
                    </div>
                  )
                }
              </label>

              <hr />

              <div>
                <Link to={`/eholdings/titles/${model.titleId}`}>
                  View all packages that include this title
                </Link>
              </div>
            </div>
          ) : model.request.isRejected ? (
            <p data-test-eholdings-customer-resource-show-error>
              {model.request.errors[0].title}
            </p>
          ) : model.isLoading ? (
            <Icon icon="spinner-ellipsis" />
          ) : null}
        </div>
        <Modal
          open={showSelectionModal}
          size="small"
          label="Remove resource from holdings?"
          scope="root"
          footer={(
            <div>
              <Button
                buttonStyle="primary"
                onClick={this.commitSelectionToggle}
                data-test-eholdings-customer-resource-deselection-confirmation-modal-yes
              >
                Yes, remove
              </Button>
              <Button
                hollow
                onClick={this.cancelSelectionToggle}
                data-test-eholdings-customer-resource-deselection-confirmation-modal-no
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
               customerResource
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
      </div>
    );
  }
}
