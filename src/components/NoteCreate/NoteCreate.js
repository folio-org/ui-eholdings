import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import createFocusDecorator from 'final-form-focus';
import { FormattedMessage } from 'react-intl';

import {
  Row,
  Col,
  Button,
  AccordionSet,
  Accordion,
  Paneset,
  Pane,
} from '@folio/stripes/components';
// import DetailsViewSection from '../../details-view-section';
// import NameField from '../_fields/name';
// import CoverageFields from '../_fields/custom-coverage';
// import ContentTypeField from '../_fields/content-type';
// import NavigationModal from '../../navigation-modal';
// import Toaster from '../../toaster';
// import PaneHeaderButton from '../../pane-header-button';
// import styles from './package-create.css';

const initialValues = {
  type: '',
  title: 'Unknown',
  details: []
};

const focusOnErrors = createFocusDecorator();

export default class NoteCreate extends Component {
  static propTypes = {
    onCancel: PropTypes.func,
    onSubmit: PropTypes.func.isRequired,
  };

  state = {
    accordionsExpandState: {
      generalInfo: true,
      assigned: true,
    }
  }

  getActionMenu = ({ onToggle }) => {
    const {
      onCancel
    } = this.props;

    return onCancel ? (
      <Button
        data-test-eholdings-package-create-cancel-action
        buttonStyle="dropdownItem fullWidth"
        onClick={() => {
          onToggle();
          onCancel();
        }}
      // disabled={request.isPending}
      >
        <FormattedMessage id="ui-eholdings.actionMenu.cancelEditing" />
      </Button>
    ) : null;
  }

  onToggleSection = (accordion) => {
    const { id } = accordion;

    this.setState((prevState) => {
      return {
        ...prevState,
        accordionsExpandState: {
          ...prevState.accordionsExpandState,
          [id]: !prevState.accordionsExpandState[id],
        },
      };
    });
  }

  render() {
    const {
      onCancel,
      onSubmit,
    } = this.props;

    return (
      <Form
        initialValues={initialValues}
        decorators={[focusOnErrors]}
        mutators={{ ...arrayMutators }}
        onSubmit={onSubmit}
        render={({ handleSubmit, pristine }) => (
          <div data-test-eholdings-package-create>
            {/* <Toaster
              position="bottom"
              toasts={request.errors.map(({ title }, index) => ({
                id: `error-${request.timestamp}-${index}`,
                message: title,
                type: 'error'
              }))}
            /> */}

            <Paneset>
              <Pane
                onSubmit={handleSubmit}
                tagName="form"
                flexGrow={1}
                paneTitle={<FormattedMessage id="stripes-components.notes" />}
                lastMenu={(
                  <Fragment>
                    {request.isPending && (
                      <Icon icon="spinner-ellipsis" />
                    )}
                    <PaneHeaderButton
                      // disabled={pristine || request.isPending}
                      type="submit"
                      buttonStyle="primary"
                      data-test-eholdings-package-create-save-button
                    >
                      {/* {request.isPending ?
                        (<FormattedMessage id="ui-eholdings.saving" />)
                        : (<FormattedMessage id="ui-eholdings.save" />)
                      } */}
                    </PaneHeaderButton>
                  </Fragment>
                )}
              >
                <AccordionSet accordionStatus={this.state.accordionsExpandState} onToggle={this.onToggleSection}>
                  <Accordion
                    id="generalInfo"
                    label={<FormattedMessage id="ui-eholdings.item.information" />}
                  >
                    <Row>
                      <Col xs={4}>
                        Field
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={6}>
                        Field
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={6}>
                        Field
                      </Col>
                    </Row>
                  </Accordion>
                  <Accordion
                    id="generalInfo"
                    label={<FormattedMessage id="ui-eholdings.item.information" />}
                  >
                    Assign accordion
                  </Accordion>
                </AccordionSet>
              </Pane>
            </Paneset>

            {/* <NavigationModal when={!pristine && !request.isPending && !request.isResolved} /> */}
          </div>
        )}
      />
    );
  }
}
