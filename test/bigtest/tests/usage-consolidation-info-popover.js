import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

const usageConsolidationInfoPopoverTests = (interactor) => {
  describe('Usage consolidation info popover', () => {
    beforeEach(async () => {
      await interactor.whenTriggerButtonLoaded();
      await interactor.triggerButton.click();
      await interactor.whenPopoverLoaded();
    });

    it('should display correct content text', () => {
      expect(interactor.content).to.equal('Access to cost and usage information for the packages and titles that are a part of your library\'s holdings.');
    });

    it('should be presented info popover button', () => {
      expect(interactor.button.isPresent).to.be.true;
    });

    it('should display correct info popover button label', () => {
      expect(interactor.button.text).to.equal('Learn more');
    });

    it('should display correct info popover button href', () => {
      expect(interactor.button.href).to.equal('https://wiki.folio.org/display/FOLIOtips/Usage+Consolidation');
    });
  });
};

export default usageConsolidationInfoPopoverTests;
