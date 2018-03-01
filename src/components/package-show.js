import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Button from '@folio/stripes-components/lib/Button';
import Layout from '@folio/stripes-components/lib/Layout';
import Icon from '@folio/stripes-components/lib/Icon';

import DetailsView from './details-view';
import QueryList from './query-list';
import Link from './link';
import KeyValueLabel from './key-value-label';
import TitleListItem from './title-list-item';
import ToggleSwitch from './toggle-switch';
import Modal from './modal';
import PackageCustomCoverage from './package-custom-coverage';
import styles from './styles.css';

export default class PackageShow extends Component {
  static propTypes = {
    model: PropTypes.object.isRequired,
    fetchPackageTitles: PropTypes.func.isRequired,
    toggleSelected: PropTypes.func.isRequired,
    toggleHidden: PropTypes.func.isRequired,
    customCoverageSubmitted: PropTypes.func.isRequired,
    toggleAllowKbToAddTitles: PropTypes.func.isRequired
  };

  static contextTypes = {
    intl: PropTypes.object,
    router: PropTypes.object,
    queryParams: PropTypes.object
  };

  state = {
    showSelectionModal: false,
    packageSelected: this.props.model.isSelected,
    packageHidden: this.props.model.visibilityData.isHidden,
    packageAllowedToAddTitles: this.props.model.allowKbToAddTitles
  };

  componentWillReceiveProps({ model }) {
    if (!model.isSaving) {
      this.setState({
        packageSelected: model.isSelected,
        packageHidden: model.visibilityData.isHidden,
        packageAllowedToAddTitles: model.allowKbToAddTitles
      });
    }
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

  render() {
    let { model, fetchPackageTitles, customCoverageSubmitted } = this.props;
    let { intl } = this.context;
    let { showSelectionModal, packageSelected, packageHidden, packageAllowedToAddTitles } = this.state;

    let customCoverages = [{
      beginCoverage: model.customCoverage.beginCoverage,
      endCoverage: model.customCoverage.endCoverage
    }];

    return (
      <div>
        <DetailsView
          type="package"
          model={model}
          paneTitle={model.name}
          bodyContent={(
            <div>
              <KeyValueLabel label="Provider">
                <div data-test-eholdings-package-details-provider>
                  <Link to={`/eholdings/providers/${model.providerId}`}>{model.providerName}</Link>
                </div>
              </KeyValueLabel>

              {model.contentType && (
                <KeyValueLabel label="Content Type">
                  <div data-test-eholdings-package-details-content-type>
                    {model.contentType}
                  </div>
                </KeyValueLabel>
              )}

              <KeyValueLabel label="Titles Selected">
                <div data-test-eholdings-package-details-titles-selected>
                  {intl.formatNumber(model.selectedCount)}
                </div>
              </KeyValueLabel>

              <KeyValueLabel label="Total Titles">
                <div data-test-eholdings-package-details-titles-total>
                  {intl.formatNumber(model.titleCount)}
                </div>
              </KeyValueLabel>

              <label
                data-test-eholdings-package-details-selected
                htmlFor="package-details-toggle-switch"
              >
                <h4>{packageSelected ? 'Selected' : 'Not Selected'}</h4>
                <ToggleSwitch
                  onChange={this.handleSelectionToggle}
                  checked={packageSelected}
                  isPending={model.update.isPending && 'isSelected' in model.update.changedAttributes}
                  id="package-details-toggle-switch"
                />
              </label>

              {packageSelected && (
                <div>
                  <hr />

                  <label
                    data-test-eholdings-package-details-hidden
                    htmlFor="package-details-toggle-hidden-switch"
                  >
                    <h4>
                      {model.visibilityData.isHidden
                        ? 'Hidden from patrons'
                        : 'Visible to patrons'}
                    </h4>

                    <Layout className="flex">
                      <div className={styles.marginRightHalf}>
                        <ToggleSwitch
                          onChange={this.props.toggleHidden}
                          checked={!packageHidden}
                          isPending={model.update.isPending &&
                            ('visibilityData' in model.update.changedAttributes)}
                          id="package-details-toggle-hidden-switch"
                        />
                      </div>

                      {model.visibilityData.isHidden && (
                        <div data-test-eholdings-package-details-is-hidden>
                          {model.visibilityData.reason}
                        </div>
                      )}
                    </Layout>
                  </label>

                  <hr />

                  <label
                    data-test-eholdings-package-details-allow-add-new-titles
                    htmlFor="package-details-toggle-allow-add-new-titles-switch"
                  >
                    {/* The check below for null could be refactored after RM API starts sending this attribute
                    in list of packages to mod-kb-ebsco */}
                    {packageAllowedToAddTitles != null ? (
                      <div>
                        <h4>
                          {packageAllowedToAddTitles
                            ? 'Allow KB to add new titles'
                            : 'Do not allow KB to add new titles'}
                        </h4>
                        <ToggleSwitch
                          onChange={this.props.toggleAllowKbToAddTitles}
                          checked={packageAllowedToAddTitles}
                          isPending={model.update.isPending && 'allowKbToAddTitles' in model.update.changedAttributes}
                          id="package-details-toggle-allow-add-new-titles-switch"
                        />
                      </div>
                      ) : (
                        <Icon icon="spinner-ellipsis" />
                      )}
                  </label>

                  <hr />

                  <div data-test-eholdings-package-details-custom-coverage>
                    <PackageCustomCoverage
                      initialValues={{ customCoverages }}
                      onSubmit={customCoverageSubmitted}
                      isPending={model.update.isPending && 'customCoverage' in model.update.changedAttributes}
                    />
                  </div>
                </div>
              )}

              <hr />
            </div>
          )}
          listHeader="Titles"
          renderList={scrollable => (
            <QueryList
              type="package-titles"
              fetch={fetchPackageTitles}
              collection={model.customerResources}
              length={model.titleCount}
              scrollable={scrollable}
              itemHeight={70}
              renderItem={item => (
                <TitleListItem
                  item={item.content}
                  link={item.content && `/eholdings/customer-resources/${item.content.id}`}
                  showSelected
                />
              )}
            />
          )}
        />

        <Modal
          open={showSelectionModal}
          size="small"
          label="Remove package from holdings?"
          scope="root"
          footer={(
            <div>
              <Button
                buttonStyle="primary"
                onClick={this.commitSelectionToggle}
                data-test-eholdings-package-deselection-confirmation-modal-yes
              >
                Yes, remove
              </Button>
              <Button
                onClick={this.cancelSelectionToggle}
                data-test-eholdings-package-deselection-confirmation-modal-no
              >
                No, do not remove
              </Button>
            </div>
          )}
        >
          Are you sure you want to remove this package and all its titles from your holdings? All customizations will be lost.
        </Modal>
      </div>
    );
  }
}
