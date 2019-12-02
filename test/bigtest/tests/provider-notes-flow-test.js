import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';
import faker from 'faker';

import setupApplication from '../helpers/setup-application';
import NotesAccordion from '../interactors/notes-accordion';
import NotesModal from '../interactors/notes-modal';
import NoteForm from '../interactors/note-form';
import NoteView from '../interactors/note-view';
import wait from '../helpers/wait';

const notesModal = new NotesModal();
const noteForm = new NoteForm();
const noteView = new NoteView();
const notesAccordion = new NotesAccordion();

describe('Provider view', function () {
  setupApplication();

  let provider;
  let noteType;
  let providerNote;

  beforeEach(function () {
    provider = this.server.create('provider', {
      name: 'Cool Provider'
    });

    noteType = this.server.create('note-type', {
      id: 'noteType1',
      name: 'Test note type',
    });

    providerNote = this.server.create('note', {
      type: noteType.name,
      typeId: noteType.id,
      links: [{ type: 'provider', id: provider.id }],
    });

    this.server.create('note', {
      type: noteType.name,
      typeId: noteType.id,
      links: [{ type: 'package', id: '1' }],
    });

    this.server.create('note', {
      type: noteType.name,
      typeId: noteType.id,
      links: [{ type: 'package', id: '2' }],
    });
  });

  describe('when the provider details page is visited', () => {
    beforeEach(async function () {
      this.visit(`/eholdings/providers/${provider.id}`);
    });

    it('should display notes accordion', () => {
      expect(notesAccordion.providerNotesAccordionIsDisplayed).to.be.true;
    });

    it('notes accordion should contain 1 note', () => {
      expect(notesAccordion.notes().length).to.equal(1);
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

      it('displays assignment accordion as closed', () => {
        expect(noteForm.assignmentAccordion.isOpen).to.equal(false);
      });

      it('should disable save button', () => {
        expect(noteForm.saveButton.isDisabled).to.be.true;
      });

      describe('and close button was clicked', () => {
        beforeEach(async () => {
          await noteForm.closeButton.click();
        });

        it('should redirect to previous location', function () {
          expect(this.location.pathname + this.location.search).to.equal(`/eholdings/providers/${provider.id}`);
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
            await noteForm.enterNoteData(noteType.name, 'some note title');
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
                expect(this.location.pathname + this.location.search).to.equal(`/eholdings/providers/${provider.id}`);
              });
            });
          });

          describe('and save button was clicked', () => {
            beforeEach(async () => {
              await noteForm.saveButton.click();
            });

            it('should redirect to previous page', function () {
              expect(this.location.pathname + this.location.search).to.equal(`/eholdings/providers/${provider.id}`);
            });

            it('notes accordion should contain 1 note', () => {
              expect(notesAccordion.notes().length).to.equal(1);
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

      it('should disable search button', () => {
        expect(notesModal.searchButtonIsDisabled).to.be.true;
      });

      it('should display empty message', () => {
        expect(notesModal.emptyMessageIsDisplayed).to.be.true;
      });

      describe('and search query was entered', () => {
        beforeEach(async () => {
          await notesModal.enterSearchQuery('some note');
          await wait(300);
        });

        it('should enable search button', () => {
          expect(notesModal.searchButtonIsDisabled).to.be.false;
        });

        describe('and the search button was clicked', () => {
          beforeEach(async () => {
            await notesModal.clickSearchButton();
          });

          it('should display notes list', () => {
            expect(notesModal.notesListIsDisplayed).to.be.true;
          });
        });

        describe('and unassigned filter was selected', () => {
          beforeEach(async () => {
            await notesModal.selectUnassignedFilter();
          });

          it('notes list should contain 2 notes', () => {
            expect(notesModal.notes().length).to.equal(2);
          });

          it('notes list should display only unselected notes', () => {
            expect(notesModal.notes(0).checkboxIsSelected).to.be.false;
            expect(notesModal.notes(1).checkboxIsSelected).to.be.false;
          });

          describe('and the first note in the list was checked', () => {
            beforeEach(async () => {
              await notesModal.notes(0).clickCheckbox();
            });

            describe('and save button was clicked', () => {
              beforeEach(async () => {
                await notesModal.clickSaveButton();
              });

              it('should close notes modal', () => {
                expect(notesModal.isDisplayed).to.be.false;
              });

              it('notes accordion should contain 2 notes', () => {
                expect(notesAccordion.notes().length).to.equal(2);
              });
            });
          });
        });
      });
    });

    describe('and a note in the notes list was clicked', () => {
      beforeEach(async () => {
        await notesAccordion.notes(0).click();
        await noteView.whenLoaded();
      });

      it('should redirect to note view page', function () {
        expect(this.location.pathname + this.location.search).to.equal(`/eholdings/notes/${providerNote.id}`);
      });

      it('should display general information accordion', () => {
        expect(noteView.generalInfoAccordionIsDisplayed).to.be.true;
      });

      it('should display correct note type', () => {
        expect(noteView.noteType).to.equal(providerNote.type);
      });

      it('should display correct note title', () => {
        expect(noteView.noteTitle).to.equal(providerNote.title);
      });

      it('should display correct note details', () => {
        expect(noteView.noteDetails).to.equal(providerNote.content);
      });

      it('should display assignments information accordion', () => {
        expect(noteView.assignmentInformationAccordionIsDisplayed).to.be.true;
      });

      it('displays assignment accordion as closed', () => {
        expect(noteView.assignmentAccordion.isOpen).to.equal(false);
      });

      it('should display correct referred entity type', () => {
        expect(noteView.referredEntityType).to.equal('Provider');
      });

      it('should display correct referred entity name', () => {
        expect(noteView.referredEntityName).to.equal(provider.name);
      });

      describe('and close button is clicked', () => {
        beforeEach(async () => {
          await noteView.clickCancelButton();
        });

        it('should redirect to previous location', function () {
          expect(this.location.pathname + this.location.search).to.equal(`/eholdings/providers/${provider.id}`);
        });
      });

      describe('and delete button was clicked', async () => {
        beforeEach(async () => {
          await noteView.performDeleteNoteAction();
        });

        it('should open confirmation modal', () => {
          expect(noteView.deleteConfirmationModalIsDisplayed).to.be.true;
        });

        describe('and cancel button was clicked', () => {
          beforeEach(async () => {
            await noteView.deleteConfirmationModal.clickCancelButton();
          });

          it('should close confirmation modal', () => {
            expect(noteView.deleteConfirmationModalIsDisplayed).to.be.false;
          });
        });

        describe('and confirm button was clicked', () => {
          beforeEach(async () => {
            await noteView.deleteConfirmationModal.clickConfirmButton();
          });

          it('should redirect to package view page', function () {
            expect(this.location.pathname + this.location.search).to.equal(`/eholdings/providers/${provider.id}`);
          });
        });
      });

      describe('and edit button is clicked', () => {
        beforeEach(async () => {
          await noteView.clickEditButton();
          await noteForm.when(() => noteForm.formFieldsAccordionIsDisplayed);
        });

        it('should redirect to note edit page', function () {
          expect(this.location.pathname + this.location.search).to.equal(`/eholdings/notes/${providerNote.id}/edit/`);
        });

        it('should display general information accordion', () => {
          expect(noteForm.formFieldsAccordionIsDisplayed).to.be.true;
        });

        it('should display correct note title', () => {
          expect(noteForm.noteTitleField.value).to.equal(providerNote.title);
        });

        it('should display correct note type', () => {
          expect(noteForm.noteTypesSelect.value).to.equal(noteType.id);
        });

        it('should display correct note details', () => {
          expect(noteForm.noteDetailsField.value).to.equal(providerNote.content);
        });

        it('should display assignments information accordion', () => {
          expect(noteForm.assignmentInformationAccordionIsDisplayed).to.be.true;
        });

        it('should display correct referred entity type', () => {
          expect(noteForm.referredEntityType).to.equal('Provider');
        });

        it('should display correct referred entity name', () => {
          expect(noteForm.referredEntityName).to.equal(provider.name);
        });

        it('should disable save button', () => {
          expect(noteForm.saveButton.isDisabled).to.be.true;
        });

        describe('and cancel editing button is clicked', () => {
          beforeEach(async () => {
            await noteForm.clickCancelButton();
          });

          it('should redirect to previous page', function () {
            expect(this.location.pathname + this.location.search).to.equal(`/eholdings/notes/${providerNote.id}`);
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
                expect(this.location.pathname + this.location.search).to.equal(`/eholdings/notes/${providerNote.id}/edit/`);
              });
            });
          });

          describe('and correct note data was entered', () => {
            beforeEach(async () => {
              await noteForm.enterNoteData(noteType.name, 'some note title');
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
                  expect(this.location.pathname + this.location.search).to.equal(`/eholdings/notes/${providerNote.id}/edit/`);
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
                  expect(this.location.pathname + this.location.search).to.equal(`/eholdings/notes/${providerNote.id}`);
                });
              });
            });

            describe('and cancel editing button was clicked', () => {
              beforeEach(async () => {
                await noteForm.clickCancelButton();
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
                  expect(this.location.pathname + this.location.search).to.equal(`/eholdings/notes/${providerNote.id}/edit/`);
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
                  expect(this.location.pathname + this.location.search).to.equal(`/eholdings/notes/${providerNote.id}`);
                });
              });
            });

            describe('and save button was clicked', () => {
              beforeEach(async () => {
                await noteForm.saveButton.click();
              });

              it('should redirect to previous page', function () {
                expect(this.location.pathname + this.location.search).to.equal(`/eholdings/notes/${providerNote.id}`);
              });
            });
          });
        });
      });
    });
  });
});
