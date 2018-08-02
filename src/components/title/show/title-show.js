import React, { Component } from 'react';
import PropTypes from 'prop-types';
import update from 'lodash/fp/update';
import set from 'lodash/fp/set';
import {
  Accordion,
  Button,
  IconButton,
  KeyValue,
  Modal,
  ModalFooter
} from '@folio/stripes-components';
import { intlShape, injectIntl, FormattedMessage } from 'react-intl';
import { processErrors } from '../../utilities';
import DetailsView from '../../details-view';
import ScrollView from '../../scroll-view';
import PackageListItem from '../../package-list-item';
import IdentifiersList from '../../identifiers-list';
import ContributorsList from '../../contributors-list';
import AddToPackageForm from '../_forms/add-to-package';
import Toaster from '../../toaster';
import KeyValueColumns from '../../key-value-columns';
import styles from './title-show.css';

class TitleShow extends Component {
  static propTypes = {
    request: PropTypes.object.isRequired,
    model: PropTypes.object.isRequired,
    customPackages: PropTypes.object.isRequired,
    addCustomPackage: PropTypes.func.isRequired,
    intl: intlShape.isRequired
  };

  static contextTypes = {
    router: PropTypes.object,
    queryParams: PropTypes.object
  };

  state = {
    showCustomPackageModal: false,
    sections: {
      titleShowTitleInformation: true
    }
  };

  get actionMenuItems() {
    let { model } = this.props;
    let { queryParams, router } = this.context;
    let items = [];

    if (model.isTitleCustom) {
      items.push({
        label: <FormattedMessage id="ui-eholdings.actionMenu.edit" />,
        to: {
          pathname: `/eholdings/titles/${model.id}/edit`,
          search: router.route.location.search,
          state: { eholdings: true }
        }
      });
    }

    if (queryParams.searchType) {
      items.push({
        label: <FormattedMessage id="ui-eholdings.actionMenu.fullView" />,
        to: {
          pathname: `/eholdings/titles/${model.id}`,
          state: { eholdings: true }
        },
        className: styles['full-view-link']
      });
    }

    return items;
  }

  get lastMenu() {
    let { model } = this.props;
    let { router } = this.context;

    if (model.isTitleCustom) {
      return (
        <IconButton
          data-test-eholdings-title-edit-link
          icon="edit"
          ariaLabel={`Edit ${model.name}`}
          to={{
            pathname: `/eholdings/titles/${model.id}/edit`,
            search: router.route.location.search,
            state: { eholdings: true }
          }}
        />
      );
    } else {
      return null;
    }
  }

  get toasts() {
    let { model, intl } = this.props;
    let { router } = this.context;
    let toasts = processErrors(model);

    // if coming from creating a new custom package, show a success toast
    if (router.history.action === 'REPLACE' &&
        router.history.location.state &&
        router.history.location.state.isNewRecord) {
      toasts.push({
        id: `success-title-${model.id}`,
        message: intl.formatMessage({ id: 'ui-eholdings.title.toast.isNewRecord' }),
        type: 'success'
      });
    }

    // if coming from saving edits to the package, show a success toast
    if (router.history.action === 'PUSH' &&
        router.history.location.state &&
        router.history.location.state.isFreshlySaved) {
      toasts.push({
        id: `success-title-saved-${model.id}`,
        message: intl.formatMessage({ id: 'ui-eholdings.title.toast.isFreshlySaved' }),
        type: 'success'
      });
    }

    return toasts;
  }

  get customPackageOptions() {
    let titlePackageIds = this.props.model.resources.map(({ id }) => id);

    return this.props.customPackages.map(pkg => ({
      disabled: titlePackageIds.includes(pkg.id),
      label: pkg.name,
      value: pkg.id
    }));
  }

  toggleCustomPackageModal = () => {
    this.setState(({ showCustomPackageModal }) => ({
      showCustomPackageModal: !showCustomPackageModal
    }));
  }

  handleSectionToggle = ({ id }) => {
    let next = update(`sections.${id}`, value => !value, this.state);
    this.setState(next);
  }

  handleExpandAll = (sections) => {
    let next = set('sections', sections, this.state);
    this.setState(next);
  }

  render() {
    let { model, addCustomPackage, request, intl } = this.props;
    let { showCustomPackageModal, sections } = this.state;

    // this will become a ref that will allow us to submit the form
    // from our modal footer buttons
    let addToPackageForm;

    let modalMessage =
      {
        header: intl.formatMessage({ id: 'ui-eholdings.title.modalMessage.addTitleToCustomPackage' }),
        saving: intl.formatMessage({ id: 'ui-eholdings.saving' }),
        submit: intl.formatMessage({ id: 'ui-eholdings.submit' }),
        cancel: intl.formatMessage({ id: 'ui-eholdings.cancel' })
      };

    return (
      <div>
        <Toaster toasts={this.toasts} position="bottom" />

        <DetailsView
          type="title"
          model={model}
          key={model.id}
          paneTitle={model.name}
          actionMenuItems={this.actionMenuItems}
          sections={sections}
          handleExpandAll={this.handleExpandAll}
          lastMenu={this.lastMenu}
          bodyContent={(
            <Accordion
              label={<FormattedMessage id="ui-eholdings.title.titleInformation" />}
              open={sections.titleShowTitleInformation}
              id="titleShowTitleInformation"
              onToggle={this.handleSectionToggle}
            >
              <KeyValueColumns>
                <div>
                  <ContributorsList data={model.contributors} />

                  {model.edition && (
                    <KeyValue label={<FormattedMessage id="ui-eholdings.title.edition" />}>
                      <div data-test-eholdings-title-show-edition>
                        {model.edition}
                      </div>
                    </KeyValue>
                  )}

                  {model.publisherName && (
                    <KeyValue label={<FormattedMessage id="ui-eholdings.title.publisherName" />}>
                      <div data-test-eholdings-title-show-publisher-name>
                        {model.publisherName}
                      </div>
                    </KeyValue>
                  )}

                  {model.publicationType && (
                    <KeyValue label={<FormattedMessage id="ui-eholdings.title.publicationType" />}>
                      <div data-test-eholdings-title-show-publication-type>
                        {model.publicationType}
                      </div>
                    </KeyValue>
                  )}

                  <IdentifiersList data={model.identifiers} />

                </div>
                <div>

                  {model.subjects.length > 0 && (
                    <KeyValue label={<FormattedMessage id="ui-eholdings.title.subjects" />}>
                      <div data-test-eholdings-title-show-subjects-list>
                        {model.subjects.map(subjectObj => subjectObj.subject).join('; ')}
                      </div>
                    </KeyValue>
                  )}

                  <KeyValue label={<FormattedMessage id="ui-eholdings.title.peerReviewed" />}>
                    <div data-test-eholdings-peer-reviewed-field>
                      {model.isPeerReviewed ? (<FormattedMessage id="ui-eholdings.yes" />) : (<FormattedMessage id="ui-eholdings.no" />)}
                    </div>
                  </KeyValue>

                  <KeyValue label={<FormattedMessage id="ui-eholdings.title.titleType" />}>
                    <div data-test-eholdings-title-details-type>
                      {model.isTitleCustom ? (<FormattedMessage id="ui-eholdings.custom" />) : (<FormattedMessage id="ui-eholdings.managed" />)}
                    </div>
                  </KeyValue>

                  {model.description && (
                    <KeyValue label={<FormattedMessage id="ui-eholdings.title.description" />}>
                      <div data-test-eholdings-description-field>
                        {model.description}
                      </div>
                    </KeyValue>
                  )}
                </div>
              </KeyValueColumns>

              <div className={styles['add-to-custom-package-button']}>
                <Button
                  data-test-eholdings-add-to-custom-package-button
                  onClick={this.toggleCustomPackageModal}
                >
                  <FormattedMessage id="ui-eholdings.title.addToCustomPackage" />
                </Button>
              </div>
            </Accordion>
          )}
          listType="packages"
          renderList={scrollable => (
            <ScrollView
              itemHeight={70}
              items={model.resources}
              scrollable={scrollable}
              data-test-query-list="title-packages"
            >
              {item => (
                <PackageListItem
                  link={`/eholdings/resources/${item.id}`}
                  packageName={item.packageName}
                  item={item}
                  headingLevel='h4'
                />
              )}
            </ScrollView>
          )}
        />

        <Modal
          open={showCustomPackageModal}
          size="small"
          label={modalMessage.header}
          id="eholdings-custom-package-modal"
          footer={(
            <ModalFooter
              primaryButton={{
                'label': request.isPending ? (modalMessage.saving) : (modalMessage.submit),
                'onClick': () => addToPackageForm.submit(),
                'disabled': request.isPending,
                'data-test-eholdings-custom-package-modal-submit': true
              }}
              secondaryButton={{
                'label': intl.formatMessage({ id: 'ui-eholdings.cancel' }),
                'onClick': this.toggleCustomPackageModal,
                'disabled': request.isPending,
                'data-test-eholdings-custom-package-modal-cancel': true
              }}
            />
          )}
        >
          <AddToPackageForm
            ref={(form) => { addToPackageForm = form; }}
            packageOptions={this.customPackageOptions}
            onSubmit={addCustomPackage}
          />
        </Modal>
      </div>
    );
  }
}

export default injectIntl(TitleShow);
