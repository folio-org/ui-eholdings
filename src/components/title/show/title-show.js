import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import update from 'lodash/fp/update';
import set from 'lodash/fp/set';
import { Form } from 'react-final-form';
import createFocusDecorator from 'final-form-focus';
import {
  Accordion,
  Button,
  Headline,
  IconButton,
  KeyValue,
  Modal,
  ModalFooter
} from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';
import { processErrors } from '../../utilities';
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
    request: PropTypes.object.isRequired
  };

  state = {
    showCustomPackageModal: false,
    sections: {
      titleShowTitleInformation: true
    }
  };

  getActionMenu = () => {
    const {
      onEdit,
      onFullView,
      model
    } = this.props;

    return (model.isTitleCustom || onFullView) ? (
      <Fragment>
        {model.isTitleCustom && (
          <Button
            buttonStyle="dropdownItem fullWidth"
            onClick={onEdit}
          >
            <FormattedMessage id="ui-eholdings.actionMenu.edit" />
          </Button>
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
    ) : null;
  }

  get lastMenu() {
    const {
      model,
      onEdit,
    } = this.props;

    if (onEdit && model.isTitleCustom) {
      return (
        <FormattedMessage
          id="ui-eholdings.title.editCustomTitle"
          values={{
            id: '',
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
      );
    } else {
      return null;
    }
  }

  get toasts() {
    let { model, isFreshlySaved, isNewRecord } = this.props;
    let toasts = processErrors(model);

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
    let titlePackageIds = this.props.model.resources.map(({ id }) => id);
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
    let next = update(`sections.${id}`, value => !value, this.state);
    this.setState(next);
  }

  handleExpandAll = (sections) => {
    let next = set('sections', sections, this.state);
    this.setState(next);
  }

  render() {
    let { model, addCustomPackage, request } = this.props;
    let { showCustomPackageModal, sections } = this.state;

    let modalMessage =
      {
        header: <FormattedMessage id="ui-eholdings.title.modalMessage.addTitleToCustomPackage" />,
        saving: <FormattedMessage id="ui-eholdings.saving" />,
        submit: <FormattedMessage id="ui-eholdings.submit" />,
        cancel: <FormattedMessage id="ui-eholdings.cancel" />
      };

    return (
      <div>
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
          listType="packages"
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
      </div>
    );
  }
}

export default TitleShow;
