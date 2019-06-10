import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';
import faker from 'faker';

import setupApplication from '../helpers/setup-application';
import NotesAccordion from '../interactors/notes-accordion';
import NotesModal from '../interactors/notes-modal';
import NoteForm from '../interactors/note-form';

const notesAccordion = new NotesAccordion();
const notesModal = new NotesModal();
const noteForm = new NoteForm();

const wait = (ms = 5000) => new Promise(resolve => { setTimeout(resolve, ms); });

describe.only('Package view', () => {
  setupApplication();
  let provider;
  let providerPackage;

  beforeEach(function () {
    provider = this.server.create('provider', {
      name: 'Cool Provider'
    });

    providerPackage = this.server.create('package', 'withTitles', 'withCustomCoverage', 'withProxy', {
      provider,
      name: 'Cool Package',
      contentType: 'E-Book',
      isSelected: false,
      titleCount: 5,
      packageType: 'Complete'
    });
  });

  describe('when the package details page is visited', () => {
    beforeEach(async function () {
      this.visit(`/eholdings/packages/${providerPackage.id}`);
    });

    it('should display notes accordion', () => {
      expect(notesAccordion.isDisplayed).to.be.true;
    });

    it('should display create note button', () => {
      expect(notesAccordion.newButtonDisplayed).to.be.true;
    });

    it('should display assign button', () => {
      expect(notesAccordion.assignButtonDisplayed).to.be.true;
    });

    it('should display notes list', () => {
      expect(notesAccordion.notesListIsDisplayed).to.be.true;
    });

    describe('and new button was clicked', () => {
      beforeEach(async () => {
        await notesAccordion.newButton.click();
      });

      it('should open create note page', function () {
        expect(this.location.pathname).to.equal('/eholdings/notes/new');
      });

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

      describe('and the form is touched', () => {
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

        describe('and correct note data was entered', () => {
          beforeEach(async () => {
            await noteForm.enterNoteData('type 2', 'some note title');
          });

          it('should enable save button', () => {
            expect(noteForm.saveButton.isDisabled).to.be.false;
          });

          describe('and close button was clicked', () => {
            beforeEach(async () => {
              await noteForm.closeButton.click();
            });

            it('should display navigation modal', function () {
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

          describe('and save button was clicked', () => {
            beforeEach(async () => {
              await noteForm.saveButton.click();
            });

            it('should redirect to previous page', function () {
              expect(this.location.pathname + this.location.search).to.equal(`/eholdings/packages/${providerPackage.id}`);
            });
          });
        });
      });
    });

    describe('and assign button was clicked', () => {
      beforeEach(async () => {
        await notesAccordion.assignButton.click();
      });

      it('should open notes modal', function () {
        expect(notesModal.isDisplayed).to.be.true;
      });
    });
  });
});
