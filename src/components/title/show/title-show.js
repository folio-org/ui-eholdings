import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Form } from 'react-final-form';
import createFocusDecorator from 'final-form-focus';

import update from 'lodash/fp/update';
import set from 'lodash/fp/set';

import {
  withStripes,
  IfPermission,
} from '@folio/stripes-core';

import {
  Accordion,
  Button,
  Headline,
  IconButton,
  KeyValue,
  Modal,
  ModalFooter,
} from '@folio/stripes/components';

import { processErrors } from '../../utilities';
import { listTypes } from '../../../constants';
import DetailsView from '../../details-view';
import ScrollView from '../../scroll-view';
import PackageListItem from '../../package-list-item';
import IdentifiersList from '../../identifiers-list';
import ContributorsList from '../../contributors-list';
import AddTitleToPackage from '../_field-groups/add-title-to-package';
import Toaster from '../../toaster';
import KeyValueColumns from '../../key-value-columns';
import styles from './title-show.css';

const focusOnErrors = createFocusDecorator();
const ITEM_HEIGHT = 53;

class TitleShow extends Component {
  static propTypes = {
    addCustomPackage: PropTypes.func.isRequired,
    customPackages: PropTypes.object.isRequired,
    isFreshlySaved: PropTypes.bool,
    isNewRecord: PropTypes.bool,
    model: PropTypes.object.isRequired,
    onEdit: PropTypes.func.isRequired,
    onFullView: PropTypes.func,
    request: PropTypes.object.isRequired,
    stripes: PropTypes.shape({
      hasPerm: PropTypes.func.isRequired,
    }).isRequired,
  };

  state = {
    showCustomPackageModal: false,
    sections: {
      titleShowTags: true,
      titleShowTitleInformation: true
    }
  };

  getActionMenu = () => {
    const {
      stripes,
      onEdit,
      onFullView,
      model: { isTitleCustom },
    } = this.props;

    const hasEditPermission = stripes.hasPerm('ui-eholdings.records.edit');
    const isEditButtonNeeded = hasEditPermission && isTitleCustom;
    const isMenuNeeded = onFullView || isEditButtonNeeded;

    return isMenuNeeded && (
      <Fragment>
        {isEditButtonNeeded && (
          <IfPermission perm="ui-eholdings.records.edit">
            <Button
              buttonStyle="dropdownItem fullWidth"
              onClick={onEdit}
            >
              <FormattedMessage id="ui-eholdings.actionMenu.edit" />
            </Button>
          </IfPermission>
        )}
        {onFullView && (
          <Button
            buttonStyle="dropdownItem fullWidth"
            onClick={onFullView}
          >
            <FormattedMessage id="ui-eholdings.actionMenu.fullView" />
          </Button>
        )}
      </Fragment>
    );
  }

  get lastMenu() {
    const {
      model,
      onEdit,
    } = this.props;

    if (onEdit && model.isTitleCustom) {
      return (
        <IfPermission perm="ui-eholdings.records.edit">
          <FormattedMessage
            id="ui-eholdings.title.editCustomTitle"
            values={{
              name: model.name
            }}
          >
            {ariaLabel => (
              <IconButton
                data-test-eholdings-title-edit-link
                icon="edit"
                ariaLabel={ariaLabel}
                onClick={onEdit}
              />
            )}
          </FormattedMessage>
        </IfPermission>
      );
    } else {
      return null;
    }
  }

  get toasts() {
    const { model, isFreshlySaved, isNewRecord } = this.props;
    const toasts = processErrors(model);

    // if coming from creating a new custom package, show a success toast
    if (isNewRecord) {
      toasts.push({
        id: `success-title-${model.id}`,
        message: <FormattedMessage id="ui-eholdings.title.toast.isNewRecord" />,
        type: 'success'
      });
    }

    // if coming from saving edits to the package, show a success toast
    if (isFreshlySaved) {
      toasts.push({
        id: `success-title-saved-${model.id}`,
        message: <FormattedMessage id="ui-eholdings.title.toast.isFreshlySaved" />,
        type: 'success'
      });
    }

    return toasts;
  }

  get customPackageOptions() {
    const titlePackageIds = this.props.model.resources.map(({ id }) => id);
    this.props.customPackages.pageSize = 100;

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
    const next = update(`sections.${id}`, value => !value, this.state);
    this.setState(next);
  }

  handleExpandAll = (sections) => {
    const next = set('sections', sections, this.state);
    this.setState(next);
  }

  render() {
    const {
      model,
      addCustomPackage,
      request,
    } = this.props;
    const { showCustomPackageModal, sections } = this.state;

    const modalMessage =
    {
      header: <FormattedMessage id="ui-eholdings.title.modalMessage.addTitleToCustomPackage" />,
      saving: <FormattedMessage id="ui-eholdings.saving" />,
      submit: <FormattedMessage id="ui-eholdings.submit" />,
      cancel: <FormattedMessage id="ui-eholdings.cancel" />
    };

    return (
      <Fragment>
        <Toaster toasts={this.toasts} position="bottom" />

        <DetailsView
          type="title"
          model={model}
          key={model.id}
          paneTitle={model.name}
          actionMenu={this.getActionMenu}
          sections={sections}
          handleExpandAll={this.handleExpandAll}
          lastMenu={this.lastMenu}
          bodyContent={(

            <Accordion
              label={<Headline size="large" tag="h3"><FormattedMessage id="ui-eholdings.title.titleInformation" /></Headline>}
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
          listType={listTypes.PACKAGES}
          resultsLength={model.resources.length}
          renderList={scrollable => (
            <ScrollView
              itemHeight={ITEM_HEIGHT}
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

        <Form
          onSubmit={addCustomPackage}
          decorators={[focusOnErrors]}
          render={({ handleSubmit }) => (
            <Modal
              open={showCustomPackageModal}
              size="small"
              label={modalMessage.header}
              id="eholdings-custom-package-modal"
              onSubmit={handleSubmit}
              wrappingElement="form"
              footer={(
                <ModalFooter>
                  <Button
                    data-test-eholdings-custom-package-modal-submit
                    buttonStyle="primary"
                    disabled={request.isPending}
                    type="submit"
                  >
                    {request.isPending ? modalMessage.saving : modalMessage.submit}
                  </Button>
                  <Button
                    data-test-eholdings-custom-package-modal-cancel
                    disabled={request.isPending}
                    onClick={this.toggleCustomPackageModal}
                  >
                    <FormattedMessage id="ui-eholdings.cancel" />
                  </Button>
                </ModalFooter>
              )}
            >
              <AddTitleToPackage
                packageOptions={this.customPackageOptions}
                {...this.props}
              />
            </Modal>
          )}
        />
      </Fragment>
    );
  }
}

export default withStripes(TitleShow);
