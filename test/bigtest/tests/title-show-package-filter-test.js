import { expect } from 'chai';
import { describe, beforeEach, it } from '@bigtest/mocha';

import setupApplication, { axe } from '../helpers/setup-application';
import TitleShowPage from '../interactors/title-show';
import PackageFilterModal from '../interactors/package-filter-modal';

describe('TitleShow package filter flow', () => {
  setupApplication();
  let title;

  let a11yResults = null;

  beforeEach(function () {
    title = this.server.create('title', 'withPackages', {
      name: 'Cool Title',
      edition: 'Cool Edition',
      publisherName: 'Cool Publisher',
      publicationType: 'Website'
    });

    title.subjects = [
      this.server.create('subject', { subject: 'Cool Subject 1' }),
      this.server.create('subject', { subject: 'Cool Subject 2' }),
      this.server.create('subject', { subject: 'Cool Subject 3' })
    ].map(m => m.toJSON());

    title.identifiers = [
      this.server.create('identifier', { type: 'ISBN', subtype: 'Print', id: '978-0547928210' }),
      this.server.create('identifier', { type: 'ISBN', subtype: 'Print', id: '978-0547928203' }),
      this.server.create('identifier', { type: 'ISBN', subtype: 'Online', id: '978-0547928197' }),
      this.server.create('identifier', { type: 'ISBN', subtype: 'Empty', id: '978-0547928227' }),
      this.server.create('identifier', { type: 'Mid', subtype: 'someothersubtype', id: 'someothertypeofid' })
    ].map(m => m.toJSON());

    title.contributors = [
      this.server.create('contributor', { type: 'author', contributor: 'Writer, Sally' }),
      this.server.create('contributor', { type: 'author', contributor: 'Wordsmith, Jane' }),
      this.server.create('contributor', { type: 'illustrator', contributor: 'Artist, John' })
    ].map(m => m.toJSON());

    title.save();
  });

  describe('when the title show page is opened', () => {
    beforeEach(async function () {
      this.visit(`/eholdings/titles/${title.id}`);
    });

    describe('waiting for axe to run', () => {
      beforeEach(async () => {
        await TitleShowPage.whenLoaded();
        a11yResults = await axe.run();
      });

      it('should not have any a11y issues', () => {
        expect(a11yResults.violations).to.be.empty;
      });
    });

    describe('and the package filter modal is opened', () => {
      beforeEach(async () => {
        await TitleShowPage.clickSearchBadge();
      });

      describe('waiting for axe to run', () => {
        beforeEach(async () => {
          a11yResults = await axe.run();
        });

        it('should not have any a11y issues', () => {
          expect(a11yResults.violations).to.be.empty;
        });
      });

      it('should display the package filter modal', () => {
        expect(PackageFilterModal.modalIsDisplayed).to.be.true;
      });

      it('the package filter select should be empty by default', () => {
        expect(PackageFilterModal.packageMultiSelect.values()).to.deep.equal([]);
      });

      describe('and one package was selected', () => {
        beforeEach(async () => {
          await PackageFilterModal.packageMultiSelect.options(0).clickOption();
        });

        describe('and reset all was clicked', () => {
          beforeEach(async () => {
            await PackageFilterModal.clickResetAll();
          });

          it('should close the modal', () => {
            expect(PackageFilterModal.modalIsDisplayed).to.be.false;
          });

          it('should display all of the packages that the titles has', () => {
            expect(TitleShowPage.packageList().length).to.equal(title.resources.length);
          });
        });

        describe('and search button was clicked', () => {
          beforeEach(async () => {
            await PackageFilterModal.clickSearch();
          });

          it('should close the modal', () => {
            expect(PackageFilterModal.modalIsDisplayed).to.be.false;
          });

          it('should display one package in the package list', () => {
            expect(TitleShowPage.packageList().length).to.equal(1);
          });

          it('should contain the package filter in the url', function () {
            expect(this.location.search).to.equal(`?filteredPackages%5B0%5D=${title.resources.models[0].id}`);
          });
        });
      });
    });
  });

  describe('when the URL contains package filter', () => {
    beforeEach(function () {
      this.visit(`/eholdings/titles/${title.id}?filteredPackages%5B0%5D=${title.resources.models[0].id}`);
    });

    it('the package list should contain one package', () => {
      expect(TitleShowPage.packageList().length).to.equal(1);
    });
  });
});
