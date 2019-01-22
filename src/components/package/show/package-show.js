import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import update from 'lodash/fp/update';
import set from 'lodash/fp/set';

import {
  Accordion,
  Button,
  Headline,
  Icon,
  IconButton,
  KeyValue,
  Modal,
  ModalFooter
} from '@folio/stripes/components';
import { FormattedDate, FormattedNumber, FormattedMessage } from 'react-intl';
import { processErrors } from '../../utilities';

import DetailsView from '../../details-view';
import QueryList from '../../query-list';
import InternalLink from '../../internal-link';
import TitleListItem from '../../title-list-item';
import NavigationModal from '../../navigation-modal';
import Toaster from '../../toaster';

import SelectionStatus from '../selection-status';
import KeyValueColumns from '../../key-value-columns';
import ProxyDisplay from '../../proxy-display';
import TokenDisplay from '../../token-display';
import FullViewLink from '../../full-view-link';

class PackageShow extends Component {
  static propTypes = {
    addPackageToHoldings: PropTypes.func.isRequired,
    editLink: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object
    ]).isRequired,
    fetchPackageTitles: PropTypes.func.isRequired,
    fullViewLink: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object
    ]),
    isDestroyed: PropTypes.bool,
    isFreshlySaved: PropTypes.bool,
    isNewRecord: PropTypes.bool,
    model: PropTypes.object.isRequired,
    provider: PropTypes.object.isRequired,
    proxyTypes: PropTypes.object.isRequired,
    searchModal: PropTypes.node,
    toggleSelected: PropTypes.func.isRequired
  };

  state = {
    showSelectionModal: false,
    packageSelected: this.props.model.isSelected,
    packageAllowedToAddTitles: this.props.model.allowKbToAddTitles,
    isCoverageEditable: false,
    sections: {
      packageShowHoldingStatus: true,
      packageShowInformation: true,
      packageShowSettings: true,
      packageShowCoverageSettings: true,
      packageShowTitles: true
    }
  };

  static getDerivedStateFromProps(nextProps) {
    const { model: { allowKbToAddTitles, isSaving, isSelected } } = nextProps;
    if (!isSaving) {
      return {
        packageSelected: isSelected,
        packageAllowedToAddTitles: allowKbToAddTitles
      };
    }
    return null;
  }

  handleSelectionToggle = () => {
    this.setState({ packageSelected: !this.props.model.isSelected });
    if (this.props.model.isSelected) {
      this.setState({ showSelectionModal: true });
    } else {
      this.setState({ packageAllowedToAddTitles: true });
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
      packageSelected: this.props.model.isSelected
    });
  };

  handleCoverageEdit = (isCoverageEditable) => {
    this.setState({ isCoverageEditable });
  };

  handleSectionToggle = ({ id }) => {
    let next = update(`sections.${id}`, value => !value, this.state);
    this.setState(next);
  }

  handleExpandAll = (sections) => {
    let next = set('sections', sections, this.state);
    this.setState(next);
  }

  getActionMenu = ({ onToggle }) => {
    const {
      editLink,
      fullViewLink,
      model
    } = this.props;

    const { packageSelected } = this.state;

    return (
      <Fragment>
        <Button
          buttonStyle="dropdownItem fullWidth"
          to={editLink}
        >
          <FormattedMessage id="ui-eholdings.actionMenu.edit" />
        </Button>

        {fullViewLink && (
          <FullViewLink to={fullViewLink} />
        )}

        {packageSelected && (
          <Button
            data-test-eholdings-package-remove-from-holdings-action
            buttonStyle="dropdownItem fullWidth"
            onClick={() => {
              onToggle();
              this.handleSelectionToggle();
            }}
          >
            <FormattedMessage
              id={`ui-eholdings.package.${(model.isCustom ? 'deletePackage' : 'removeFromHoldings')}`}
            />
          </Button>
        )}

        {(!packageSelected || model.isPartiallySelected) && (
          <Button
            data-test-eholdings-package-add-to-holdings-action
            buttonStyle="dropdownItem fullWidth"
            onClick={() => {
              onToggle();
              this.props.addPackageToHoldings();
            }}
          >
            <FormattedMessage
              id={`ui-eholdings.${(model.isPartiallySelected ? 'addAllToHoldings' : 'addToHoldings')}`}
            />
          </Button>
        )}
      </Fragment>
    );
  }

  render() {
    let {
      model,
      fetchPackageTitles,
      proxyTypes,
      provider,
      searchModal,
      editLink,
      isFreshlySaved,
      isNewRecord,
      isDestroyed
    } = this.props;

    let {
      showSelectionModal,
      packageSelected,
      packageAllowedToAddTitles,
      isCoverageEditable,
      sections
    } = this.state;

    let visibilityMessage = model.visibilityData.reason && `(${model.visibilityData.reason})`;
    let hasProxy = model.proxy && model.proxy.id;
    let hasProviderToken = provider.providerToken && provider.providerToken.prompt;
    let hasPackageToken = model.packageToken && model.packageToken.prompt;
    let modalMessage = model.isCustom ?
      {
        header: <FormattedMessage id="ui-eholdings.package.modal.header.isCustom" />,
        body: <FormattedMessage id="ui-eholdings.package.modal.body.isCustom" />,
        buttonConfirm: <FormattedMessage id="ui-eholdings.package.modal.buttonConfirm.isCustom" />,
        buttonCancel: <FormattedMessage id="ui-eholdings.package.modal.buttonCancel.isCustom" />
      } :
      {
        header: <FormattedMessage id="ui-eholdings.package.modal.header" />,
        body: <FormattedMessage id="ui-eholdings.package.modal.body" />,
        buttonConfirm: <FormattedMessage id="ui-eholdings.package.modal.buttonConfirm" />,
        buttonCancel: <FormattedMessage id="ui-eholdings.package.modal.buttonCancel" />
      };

    let toasts = processErrors(model);

    // if coming from creating a new custom package, show a success toast
    if (isNewRecord) {
      toasts.push({
        id: `success-package-creation-${model.id}`,
        message: <FormattedMessage id="ui-eholdings.package.toast.isNewRecord" />,
        type: 'success'
      });
    }

    // if coming from destroying a custom or managed title
    // from within custom-package, show a success toast
    if (isDestroyed) {
      toasts.push({
        id: `success-resource-destruction-${model.id}`,
        message: <FormattedMessage id="ui-eholdings.package.toast.isDestroyed" />,
        type: 'success'
      });
    }

    // if coming from saving edits to the package, show a success toast
    if (isFreshlySaved) {
      toasts.push({
        id: `success-package-saved-${model.id}`,
        message: <FormattedMessage id="ui-eholdings.package.toast.isFreshlySaved" />,
        type: 'success'
      });
    }

    return (
      <div>
        <Toaster toasts={toasts} position="bottom" />
        <DetailsView
          type="package"
          model={model}
          key={model.id}
          paneTitle={model.name}
          actionMenu={this.getActionMenu}
          sections={sections}
          handleExpandAll={this.handleExpandAll}
          searchModal={searchModal}
          lastMenu={(
            <FormattedMessage
              id="ui-eholdings.label.editLink"
              values={{
                name: model.name
              }}
            >
              {ariaLabel => (
                <IconButton
                  data-test-eholdings-package-edit-link
                  icon="edit"
                  ariaLabel={ariaLabel}
                  to={editLink}
                />
              )}
            </FormattedMessage>
          )}
          bodyContent={(
            <div>
              <Accordion
                label={<Headline size="large" tag="h3"><FormattedMessage id="ui-eholdings.label.holdingStatus" /></Headline>}
                open={sections.packageShowHoldingStatus}
                id="packageShowHoldingStatus"
                onToggle={this.handleSectionToggle}
              >
                <SelectionStatus
                  model={model}
                  onAddToHoldings={this.props.addPackageToHoldings}
                />
              </Accordion>
              <Accordion
                label={<Headline size="large" tag="h3"><FormattedMessage id="ui-eholdings.label.packageInformation" /></Headline>}
                open={sections.packageShowInformation}
                id="packageShowInformation"
                onToggle={this.handleSectionToggle}
              >
                <KeyValueColumns>
                  <div>
                    <KeyValue label={<FormattedMessage id="ui-eholdings.package.provider" />}>
                      <div data-test-eholdings-package-details-provider>
                        <InternalLink to={`/eholdings/providers/${model.providerId}`}>{model.providerName}</InternalLink>
                      </div>
                    </KeyValue>

                    {model.contentType && (
                      <KeyValue label={<FormattedMessage id="ui-eholdings.package.contentType" />}>
                        <div data-test-eholdings-package-details-content-type>
                          {model.contentType}
                        </div>
                      </KeyValue>
                    )}

                    {model.packageType && (
                      <KeyValue label={<FormattedMessage id="ui-eholdings.package.packageType" />}>
                        <div data-test-eholdings-package-details-type>
                          {model.packageType}
                        </div>
                      </KeyValue>
                    )}
                  </div>

                  <div>
                    <KeyValue label={<FormattedMessage id="ui-eholdings.package.titlesSelected" />}>
                      <div data-test-eholdings-package-details-titles-selected>
                        <FormattedNumber value={model.selectedCount} />
                      </div>
                    </KeyValue>

                    <KeyValue label={<FormattedMessage id="ui-eholdings.package.totalTitles" />}>
                      <div data-test-eholdings-package-details-titles-total>
                        <FormattedNumber value={model.titleCount} />
                      </div>
                    </KeyValue>
                  </div>
                </KeyValueColumns>
              </Accordion>
              <Accordion
                label={<Headline size="large" tag="h3"><FormattedMessage id="ui-eholdings.package.packageSettings" /></Headline>}
                open={sections.packageShowSettings}
                id="packageShowSettings"
                onToggle={this.handleSectionToggle}
              >
                {packageSelected ? (
                  <div>
                    <KeyValue label={<FormattedMessage id="ui-eholdings.package.visibility" />}>
                      <div data-test-eholdings-package-details-visibility-status>
                        {!model.visibilityData.isHidden ?
                          (<FormattedMessage id="ui-eholdings.yes" />)
                          :
                          (<FormattedMessage id="ui-eholdings.package.visibility.no" values={{ visibilityMessage }} />)}
                      </div>
                    </KeyValue>
                    {!model.isCustom && (
                      <KeyValue label={<FormattedMessage id="ui-eholdings.package.packageAllowToAddTitles" />}>
                        <div>
                          {packageAllowedToAddTitles != null ? (
                            <div data-test-eholdings-package-details-allow-add-new-titles>
                              {packageAllowedToAddTitles ?
                                (<FormattedMessage id="ui-eholdings.yes" />)
                                :
                                (<FormattedMessage id="ui-eholdings.no" />)
                              }
                            </div>
                          ) : (
                            <div>
                              <Icon icon="spinner-ellipsis" />
                            </div>
                          )}
                        </div>
                      </KeyValue>
                    )}
                    {hasProxy && (proxyTypes.request.isResolved && model.isLoaded && provider.isLoaded) ? (
                      <ProxyDisplay
                        model={model}
                        proxyTypes={proxyTypes}
                        inheritedProxyId={provider.proxy && provider.proxy.id}
                      />
                    ) : (
                      <Icon icon="spinner-ellipsis" />
                    )}
                    {hasProviderToken && (
                      (provider.isLoading) ? (
                        <Icon icon="spinner-ellipsis" />
                      ) : (
                        <KeyValue label={<FormattedMessage id="ui-eholdings.provider.token" />}>
                          <TokenDisplay
                            token={provider.providerToken}
                            type="provider"
                          />
                        </KeyValue>
                      ))}
                    {hasPackageToken && (
                      (model.isLoading) ? (
                        <Icon icon="spinner-ellipsis" />
                      ) : (
                        <KeyValue label={<FormattedMessage id="ui-eholdings.package.token" />}>
                          <TokenDisplay
                            token={model.packageToken}
                            type="package"
                          />
                        </KeyValue>
                      ))}
                  </div>
                ) : (
                  <p><FormattedMessage id="ui-eholdings.package.visibility.notSelected" /></p>
                )}
              </Accordion>
              <Accordion
                label={<Headline size="large" tag="h3"><FormattedMessage id="ui-eholdings.package.coverageSettings" /></Headline>}
                closedByDefault={!packageSelected}
                open={sections.packageShowCoverageSettings}
                id="packageShowCoverageSettings"
                onToggle={this.handleSectionToggle}
              >
                {packageSelected ? (
                  <div>
                    {model.customCoverage.beginCoverage ? (
                      <div>
                        <KeyValue label={<FormattedMessage id="ui-eholdings.package.customCoverageDates" />}>
                          <div data-test-eholdings-package-details-custom-coverage-display>
                            <FormattedDate
                              value={model.customCoverage.beginCoverage}
                              timeZone="UTC"
                              year="numeric"
                              month="numeric"
                              day="numeric"
                            />
                              &nbsp;-&nbsp;
                            {(model.customCoverage.endCoverage) ? (
                              <FormattedDate
                                value={model.customCoverage.endCoverage}
                                timeZone="UTC"
                                year="numeric"
                                month="numeric"
                                day="numeric"
                              />
                            ) : (<FormattedMessage id="ui-eholdings.date.present" />)}
                          </div>
                        </KeyValue>
                      </div>
                    ) : (
                      <p><FormattedMessage id="ui-eholdings.package.customCoverage.notSet" /></p>
                    )}
                  </div>
                ) : (
                  <p><FormattedMessage id="ui-eholdings.package.customCoverage.notSelected" /></p>
                )}
              </Accordion>
            </div>
          )}
          listType="titles"
          listSectionId="packageShowTitles"
          onListToggle={this.handleSectionToggle}
          resultsLength={model.resources.length}
          renderList={scrollable => (
            <QueryList
              type="package-titles"
              fetch={fetchPackageTitles}
              collection={model.resources}
              length={model.titleCount}
              scrollable={scrollable}
              itemHeight={60}
              notFoundMessage={<FormattedMessage id="ui-eholdings.notFound" />}
              renderItem={item => (
                <TitleListItem
                  item={item.content}
                  link={item.content && `/eholdings/resources/${item.content.id}`}
                  showSelected
                  headingLevel='h4'
                />
              )}
            />
          )}
        />

        <Modal
          open={showSelectionModal}
          size="small"
          label={modalMessage.header}
          id="eholdings-package-confirmation-modal"
          footer={(
            <ModalFooter>
              <Button
                data-test-eholdings-package-deselection-confirmation-modal-yes
                buttonStyle="primary"
                onClick={this.commitSelectionToggle}
              >
                {modalMessage.buttonConfirm}
              </Button>
              <Button
                data-test-eholdings-package-deselection-confirmation-modal-no
                onClick={this.cancelSelectionToggle}
              >
                {modalMessage.buttonCancel}
              </Button>
            </ModalFooter>
          )}
        >
          {modalMessage.body}
        </Modal>

        <NavigationModal when={isCoverageEditable} />
      </div>
    );
  }
}

export default PackageShow;
