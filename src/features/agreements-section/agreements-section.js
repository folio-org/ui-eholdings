import React, { Component } from 'react';
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
} from '@folio/stripes/components';

import selectAgreements from '../../redux/selectors';
import {
  attachAgreement,
  getAgreements,
} from '../../redux/actions';

import AgreementsList from '../../components/agreements-list';

class AgreementsSection extends Component {
  static propTypes = {
    agreements: PropTypes.object,
    attachAgreement: PropTypes.func.isRequired,
    getAgreements: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
    isOpen: PropTypes.bool,
    onToggle: PropTypes.func,
    referenceId: PropTypes.string.isRequired,
  }

  componentDidMount() {
    this.props.getAgreements({
      referenceId: this.props.referenceId,
    });
  }

  getAgreementsSectionHeader = () => {
    return (
      <Headline
        size="large"
        tag="h3"
      >
        <FormattedMessage id="ui-eholdings.agreements" />
      </Headline>
    );
  }

  renderFindAgreementTrigger = (props) => {
    return (
      <Button {...props}>
        <FormattedMessage id="ui-eholdings.add" />
      </Button>
    );
  }

  getAgreementsSectionButtons() {
    const {
      onAddAgreement,
    } = this.props;

    return (
      <Pluggable
        dataKey="find-agreements"
        type="find-agreement"
        renderTrigger={this.renderFindAgreementTrigger}
        onAgreementSelected={onAddAgreement}
      />
    );
  }

  onAddAgreementHandler = ({ name, id }) => {
    const agreement = {
      type: 'external',
      authority: 'EKB',
      reference: this.props.referenceId,
      label: name,
    };

    this.props.attachAgreement({ id, referenceId: this.props.referenceId, agreement });
  };

  render() {
    const {
      agreements,
      isOpen,
      id,
      onToggle,
    } = this.props;

    return (
      <Accordion
        id={id}
        label={this.getAgreementsSectionHeader()}
        open={isOpen}
        displayWhenOpen={this.getAgreementsSectionButtons()}
        onToggle={onToggle}
      >
        <AgreementsList agreements={agreements} />
      </Accordion>
    );
  }
}

export default connect(
  (store, { referenceId }) => ({
    agreements: selectAgreements(store, referenceId),
  }), {
    getAgreements: (data) => getAgreements(data),
    attachAgreement: (data) => attachAgreement(data),
  }
)(AgreementsSection);
