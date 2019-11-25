import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  FormattedMessage,
} from 'react-intl';

import {
  Pluggable,
} from '@folio/stripes-core';

import {
  Accordion,
  Headline,
  Button,
  Badge,
} from '@folio/stripes/components';

import Toaster from '../../components/toaster';

import {
  selectAgreements,
  selectUserPermissions,
} from '../../redux/selectors';
import {
  attachAgreement as attachAgreementAction,
  getAgreements as getAgreementsAction,
} from '../../redux/actions';

import AgreementsList from '../../components/agreements-list';

import Agreement from './model';
import styles from './agreements-accordion.css';

class AgreementsAccordion extends Component {
  static propTypes = {
    agreements: PropTypes.object.isRequired,
    attachAgreement: PropTypes.func.isRequired,
    getAgreements: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
    isOpen: PropTypes.bool,
    onToggle: PropTypes.func,
    refId: PropTypes.string.isRequired,
    refType: PropTypes.string,
    userPermissions: PropTypes.objectOf(PropTypes.bool),
  }

  componentDidMount() {
    const {
      getAgreements,
      refId,
      userPermissions,
    } = this.props;

    if (userPermissions['erm.agreements.collection.get']) {
      getAgreements(refId);
    }
  }

  getAgreementsAccordionHeader = () => {
    return (
      <Headline
        size="large"
        tag="h3"
      >
        <FormattedMessage id="ui-eholdings.agreements" />
      </Headline>
    );
  }

  getToastErrors() {
    return this.props.agreements.errors.map((error) => {
      return {
        message: error.title,
        type: 'error',
      };
    });
  }

  renderFindAgreementTrigger = (props) => {
    return (
      <Button {...props}>
        <FormattedMessage id="ui-eholdings.add" />
      </Button>
    );
  }

  getAgreementsAccordionButtons() {
    const {
      refType,
      refId,
    } = this.props;

    return (
      <Fragment>
        <Pluggable
          dataKey="find-agreements"
          type="find-agreement"
          renderTrigger={this.renderFindAgreementTrigger}
          onAgreementSelected={this.onAddAgreementHandler}
        />
        <Button
          data-test-new-button
          buttonClass={styles['new-button']}
          to={`/erm/agreements/create?authority=${refType}&referenceId=${refId}`}
        >
          <FormattedMessage id="ui-eholdings.new" />
        </Button>
      </Fragment>
    );
  }

  renderBadge() {
    return (
      <Badge>
        {this.props.agreements.items.length}
      </Badge>
    );
  }

  onAddAgreementHandler = ({ name, id }) => {
    const {
      refId,
      refType,
      attachAgreement,
    } = this.props;

    const agreementParams = {
      id,
      refId,
      authorityType: refType,
      label: name,
    };

    attachAgreement(new Agreement(agreementParams));
  };

  render() {
    const {
      agreements,
      isOpen,
      id,
      onToggle,
    } = this.props;

    return (
      <Fragment>
        <Accordion
          id={id}
          open={isOpen}
          label={this.getAgreementsAccordionHeader()}
          displayWhenOpen={this.getAgreementsAccordionButtons()}
          displayWhenClosed={this.renderBadge()}
          onToggle={onToggle}
        >
          <AgreementsList agreements={agreements} />
        </Accordion>

        <Toaster
          position="bottom"
          toasts={this.getToastErrors()}
        />
      </Fragment>
    );
  }
}

export default connect(
  (store) => ({
    agreements: selectAgreements(store),
    userPermissions: selectUserPermissions(store),
  }), {
    getAgreements: getAgreementsAction,
    attachAgreement: attachAgreementAction,
  }
)(AgreementsAccordion);
