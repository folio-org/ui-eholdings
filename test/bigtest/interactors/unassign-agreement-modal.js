import {
  interactor,
  clickable,
} from '@bigtest/interactor';

@interactor
class UnassignAgreementModal {
  static defaultScope = '#unassign-agreement-confirmation-modal';

  confirmUnassign = clickable('[data-test-eholdings-agreements-unassign-modal-yes]');
  cancelUnassign = clickable('[data-test-eholdings-agreements-unassign-modal-no]');
}

export default new UnassignAgreementModal();
