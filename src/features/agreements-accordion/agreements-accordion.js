import {
  useState,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import {
  Pluggable,
  useStripes,
} from '@folio/stripes/core';
import {
  Accordion,
  Headline,
  Button,
  Badge,
  Modal,
  ModalFooter,
} from '@folio/stripes/components';

import Toaster from '../../components/toaster';

import { selectPropFromData } from '../../redux/selectors';
import {
  attachAgreement as attachAgreementAction,
  getAgreements as getAgreementsAction,
  unassignAgreement as unassignAgreementAction,
  confirmUnassignAgreement as confirmUnassignAgreementAction,
} from '../../redux/actions';

import AgreementsList from '../../components/agreements-list';

import Agreement from './model';
import styles from './agreements-accordion.css';

const propTypes = {
  agreements: PropTypes.shape({
    errors: PropTypes.array.isRequired,
    isLoading: PropTypes.bool.isRequired,
    isUnassigned: PropTypes.bool.isRequired,
    items: PropTypes.arrayOf({
      agreementStatus: PropTypes.shape({
        label: PropTypes.string.isRequired,
      }).isRequired,
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      startDate: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  attachAgreement: PropTypes.func.isRequired,
  confirmUnassignAgreement: PropTypes.func.isRequired,
  getAgreements: PropTypes.func.isRequired,
  headerProps: PropTypes.object,
  id: PropTypes.string.isRequired,
  isOpen: PropTypes.bool,
  onToggle: PropTypes.func,
  refId: PropTypes.string.isRequired,
  refName: PropTypes.string.isRequired,
  refType: PropTypes.string,
  unassignAgreement: PropTypes.func.isRequired,
};

const AgreementsAccordion = ({
  agreements,
  attachAgreement,
  confirmUnassignAgreement,
  getAgreements,
  headerProps,
  id,
  isOpen,
  onToggle,
  refId,
  refName,
  refType,
  unassignAgreement,
}) => {
  const stripes = useStripes();
  const [showModal, setShowModal] = useState(false);
  const [currentAgreement, setCurrentAgreement] = useState({});

  useEffect(() => {
    if (stripes.hasPerm('erm.agreements.collection.get')) {
      getAgreements(refId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (agreements.isUnassigned) {
      confirmUnassignAgreement();
    }
  }, [agreements.isUnassigned]); // eslint-disable-line react-hooks/exhaustive-deps

  const getAgreementsAccordionHeader = () => {
    return (
      <Headline
        size="large"
        tag="h3"
      >
        <FormattedMessage id="ui-eholdings.agreements" />
      </Headline>
    );
  };

  const renderFindAgreementTrigger = (props) => {
    return (
      <Button {...props}>
        <FormattedMessage id="ui-eholdings.add" />
      </Button>
    );
  };

  const onAddAgreementHandler = ({ name, id: agreementId }) => {
    const agreementParams = {
      id: agreementId,
      refId,
      authorityType: refType,
      label: name,
    };

    attachAgreement(new Agreement(agreementParams));
  };

  const getAgreementsAccordionButtons = () => {
    return (
      <>
        <Pluggable
          dataKey="find-agreements"
          type="find-agreement"
          renderTrigger={renderFindAgreementTrigger}
          onAgreementSelected={onAddAgreementHandler}
        />
        <Button
          data-test-new-button
          buttonClass={styles['new-button']}
          to={`/erm/agreements/create?authority=${refType}&referenceId=${refId}`}
        >
          <FormattedMessage id="ui-eholdings.new" />
        </Button>
      </>
    );
  };

  const renderBadge = () => {
    return (
      <Badge>
        {agreements.items.length}
      </Badge>
    );
  };

  const getToasts = () => {
    const toasts = agreements.errors.map(error => ({
      message: error.title,
      type: 'error',
    }));

    return toasts;
  };

  const onUnassignAgreement = (agreement) => {
    setShowModal(true);
    setCurrentAgreement(agreement);
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentAgreement({});
  };

  const handleUnassignConfirm = () => {
    unassignAgreement({ id: currentAgreement.id });
    closeModal();
  };

  return (
    <>
      <Accordion
        id={id}
        open={isOpen}
        label={getAgreementsAccordionHeader()}
        displayWhenOpen={getAgreementsAccordionButtons()}
        displayWhenClosed={renderBadge()}
        onToggle={onToggle}
        headerProps={headerProps}
      >
        <AgreementsList
          agreements={agreements}
          onUnassignAgreement={onUnassignAgreement}
        />
      </Accordion>

      <Toaster
        position="bottom"
        toasts={getToasts()}
      />

      <Modal
        open={showModal}
        size="small"
        label={<FormattedMessage id="ui-eholdings.agreements.unassignModal.header" />}
        id="unassign-agreement-confirmation-modal"
        footer={(
          <ModalFooter>
            <Button
              data-test-eholdings-agreements-unassign-modal-yes
              buttonStyle="primary"
              marginBottom0
              onClick={handleUnassignConfirm}
            >
              <FormattedMessage id="ui-eholdings.agreements.unassignModal.unassign" />
            </Button>
            <Button
              data-test-eholdings-agreements-unassign-modal-no
              marginBottom0
              onClick={closeModal}
            >
              <FormattedMessage id="ui-eholdings.agreements.unassignModal.cancel" />
            </Button>
          </ModalFooter>
        )}
      >
        <FormattedMessage
          id="ui-eholdings.agreements.unassignModal.description"
          values={{
            agreementName: currentAgreement.name,
            recordName: refName,
          }}
        />
      </Modal>
    </>
  );
};

AgreementsAccordion.propTypes = propTypes;

export default connect(
  (store) => ({
    agreements: selectPropFromData(store, 'agreements'),
  }), {
    getAgreements: getAgreementsAction,
    attachAgreement: attachAgreementAction,
    unassignAgreement: unassignAgreementAction,
    confirmUnassignAgreement: confirmUnassignAgreementAction,
  }
)(AgreementsAccordion);
