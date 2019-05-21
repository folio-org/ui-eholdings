import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';

import { expect } from 'chai';
import faker from 'faker';

import {
  NoteFormInteractor,
  NotesAccordionInteractor,
} from '@folio/stripes-smart-components';

import setupApplication from '../helpers/setup-application';

const noteForm = new NoteFormInteractor();
const notesAccordion = new NotesAccordionInteractor();

let provider;
let providerPackage;

setupApplication();

describe('Create note page', () => {
  beforeEach(function () {
    provider = this.server.create('provider', {
      name: 'Cool Provider'
    });

    providerPackage = this.server.create('package', {
      provider,
      name: 'Cool Package',
      contentType: 'E-Book',
      isCustom: true
    });
  });

  describe('when the create note page is visited using notes accordion', () => {
    beforeEach(async function () {
      this.visit(`/eholdings/packages/${providerPackage.id}`);
      await notesAccordion.clickOnNoteNewButton();
    });

    describe('and the form is pristine', () => {
      it('should disable save button', () => {
        expect(noteForm.saveButton.isDisabled).to.be.true;
      });

      describe('and close button was clicked', () => {
        beforeEach(async () => {
          await noteForm.closeButton.click();
        });

        it('should redirect to previous location', function () {
          expect(this.location.pathname + this.location.search).to.equal(`/eholdings/packages/${providerPackage.id}`);
        });
      });
    });

    describe('and the form is touched', () => {
      beforeEach(async () => {
        await noteForm.noteTypesSelect.selectAndBlur('type 2');
      });

      describe('and note title length is exceeded', () => {
        beforeEach(async () => {
          await noteForm.noteTitleField.enterText(faker.lorem.words(100));
        });

        it('should display title length error', () => {
          expect(noteForm.hasTitleLengthError).to.be.true;
        });

        describe('and save button is clicked', () => {
          beforeEach(async () => {
            await noteForm.saveButton.click();
          });

          it('should not redirect to previous location', function () {
            expect(this.location.pathname + this.location.search).to.equal('/eholdings/notes/new');
          });
        });
      });

      describe('and note title is missing', () => {
        beforeEach(async () => {
          await noteForm.noteTitleField.enterText('');
        });

        it('should display missing title error', () => {
          expect(noteForm.hasTitleMissingError).to.be.true;
        });

        describe('and save button is clicked', () => {
          beforeEach(async () => {
            await noteForm.saveButton.click();
          });

          it('should not redirect to previous location', function () {
            expect(this.location.pathname + this.location.search).to.equal('/eholdings/notes/new');
          });
        });
      });

      describe('and close button is clicked', () => {
        beforeEach(async () => {
          await noteForm.closeButton.click();
        });

        it('should display navigation modal', () => {
          expect(noteForm.navigationModalIsOpened).to.be.true;
        });

        describe('and cancel navigation button was clicked', () => {
          beforeEach(async () => {
            await noteForm.clickCancelNavigationButton();
          });

          it('should close navigation modal', () => {
            expect(noteForm.navigationModalIsOpened).to.be.false;
          });

          it('should keep the user on the same page', function () {
            expect(this.location.pathname + this.location.search).to.equal('/eholdings/notes/new');
          });
        });

        describe('and continue navigation button was clicked', () => {
          beforeEach(async () => {
            await noteForm.clickContinueNavigationButton();
          });

          it('should close navigation modal', () => {
            expect(noteForm.navigationModalIsOpened).to.be.false;
          });

          it('should redirect to previous page', function () {
            expect(this.location.pathname + this.location.search).to.equal(`/eholdings/packages/${providerPackage.id}`);
          });
        });
      });

      describe('and all required fields are entered correctly', () => {
        beforeEach(async () => {
          await noteForm.noteTitleField.enterText('some title');
        });

        describe('and save button is clicked', () => {
          beforeEach(async () => {
            await noteForm.saveButton.click();
          });

          it('should redirect to previous page', function () {
            expect(this.location.pathname + this.location.search).to.equal(`/eholdings/packages/${providerPackage.id}`);
          });
        });
      });
    });

    describe('when the note create page is visited using a link', () => {
      beforeEach(function () {
        this.visit('/eholdings/notes/new');
      });

      it('should redirect to eholdings root route', function () {
        expect(this.location.pathname + this.location.search).to.equal('/eholdings?searchType=providers');
      });
    });
  });
});
