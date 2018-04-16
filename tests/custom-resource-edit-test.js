import { expect } from 'chai';
import { describe, beforeEach, it } from '@bigtest/mocha';

import { describeApplication } from './helpers';
import ResourceShowPage from './pages/resource-show';
import ResourceEditPage from './pages/resource-edit';
import ResourceCoverage from './pages/resource-custom-coverage';

describeApplication('CustomResourceEdit', () => {
  let provider,
    providerPackage,
    resource;

  beforeEach(function () {
    provider = this.server.create('provider', {
      name: 'Cool Provider'
    });

    providerPackage = this.server.create('package', 'withTitles', {
      provider,
      name: 'Cool Package',
      contentType: 'E-Book',
      titleCount: 5
    });

    let title = this.server.create('title', {
      name: 'Best Title Ever',
      publicationType: 'Streaming Video',
      publisherName: 'Amazing Publisher'
    });

    title.save();

    resource = this.server.create('resource', {
      package: providerPackage,
      isSelected: true,
      title,
      url: 'frontside.io',
      isTitleCustom: true
    });
  });

  describe('visiting the resource edit page without coverage dates or statements', () => {
    beforeEach(function () {
      return this.visit(`/eholdings/resources/${resource.titleId}/edit`, () => {
        expect(ResourceEditPage.$root).to.exist;
      });
    });

    it('shows a form with coverage statement', () => {
      expect(ResourceEditPage.coverageStatement).to.equal('');
    });

    it('shows a field for publisher', () => {
      expect(ResourceEditPage.publisherValue).to.equal('Amazing Publisher');
    });

    it('shows a form with embargo fields', () => {
      expect(ResourceEditPage.customEmbargoTextFieldValue).to.equal('0');
      expect(ResourceEditPage.customEmbargoSelectValue).to.equal('');
    });

    it('disables the save button', () => {
      expect(ResourceEditPage.isSaveDisabled).to.be.true;
    });

    it('shows unchecked peer review box', () => {
      expect(ResourceEditPage.isPeerReviewed).to.be.false;
    });

    describe('clicking cancel', () => {
      beforeEach(() => {
        return ResourceEditPage.clickCancel();
      });

      it('goes to the resource show page', () => {
        expect(ResourceShowPage.$root).to.exist;
      });
    });

    describe('entering invalid data', () => {
      beforeEach(() => {
        return ResourceEditPage
          .name('')
          .fillPublisher(`The only prerequisite is that it makes you happy.
            If it makes you happy then it's good. All kinds of happy little splashes.
            I started painting as a hobby when I was little. I didn't know I had any talent.
            I believe talent is just a pursued interest. Anybody can do what I do.
            We'll put some happy little leaves here and there. Go out on a limb - that's where the fruit is.
            God gave you this gift of imagination. Use it.`)
          .clickAddRowButton()
          .once(() => ResourceEditPage.dateRangeRowList().length > 0)
          .do(() => ResourceEditPage.interaction
            .append(ResourceEditPage.dateRangeRowList(0).fillDates('12/18/2018', '12/16/2018'))
            .inputEmbargoValue('')
            .blurEmbargoValue()
            .selectEmbargoUnit('Weeks')
            .clickSave());
      });

      it('displays a validation error for the name', () => {
        expect(ResourceEditPage.nameHasError).to.be.true;
      });

      it('displays a validation error for the publisher field', () => {
        expect(ResourceEditPage.publisherHasError).to.be.true;
      });

      it('displays a validation error for coverage', () => {
        expect(ResourceEditPage.dateRangeRowList(0).beginDate.isInvalid).to.be.true;
      });

      it('displays a validation error for embargo', () => {
        expect(ResourceEditPage.validationErrorOnEmbargoTextField).to.equal('Value cannot be null');
      });
    });

    describe('entering valid data', () => {
      beforeEach(() => {
        return ResourceEditPage
          .clickAddRowButton()
          .once(() => ResourceEditPage.dateRangeRowList().length > 0)
          .do(() => ResourceEditPage.interaction
            .inputCoverageStatement('Only 90s kids would understand.')
            .fillPublisher('Not So Awesome Publisher')
            .checkPeerReviewed()
            .append(ResourceEditPage.dateRangeRowList(0).fillDates('12/16/2018', '12/18/2018'))
            .inputEmbargoValue('27')
            .blurEmbargoValue()
            .selectEmbargoUnit('Weeks')
            .blurEmbargoUnit());
      });

      describe('clicking cancel', () => {
        beforeEach(() => {
          return ResourceEditPage.clickCancel();
        });

        it('shows a navigation confirmation modal', () => {
          expect(ResourceEditPage.navigationModal.$root).to.exist;
        });
      });

      describe('clicking save', () => {
        beforeEach(() => {
          return ResourceEditPage.clickSave();
        });

        it('goes to the resource show page', () => {
          expect(ResourceShowPage.$root).to.exist;
        });

        it('reflects the new publisher', () => {
          expect(ResourceShowPage.publisherName).to.equal('Not So Awesome Publisher');
        });

        it('displays the saved date range', () => {
          expect(ResourceCoverage.displayText).to.equal('12/16/2018 - 12/18/2018');
        });

        it('shows the new statement value', () => {
          expect(ResourceShowPage.coverageStatement).to.equal('Only 90s kids would understand.');
        });

        it('shows the new embargo value', () => {
          expect(ResourceShowPage.customEmbargoPeriod).to.equal('27 Weeks');
        });

        it('shows YES for peer reviewed', () => {
          expect(ResourceShowPage.peerReviewedStatus).to.equal('Yes');
        });
      });
    });
  });

  describe('visiting the resource edit page with coverage dates, statements, and embargo', () => {
    beforeEach(function () {
      let customCoverages = [
        this.server.create('custom-coverage', {
          beginCoverage: '1969-07-16',
          endCoverage: '1972-12-19'
        })
      ];
      resource.update('customCoverages', customCoverages.map(item => item.toJSON()));
      resource.customEmbargoPeriod = this.server.create('embargo-period', {
        embargoUnit: 'Months',
        embargoValue: 6
      }).toJSON();
      resource.save();

      return this.visit(`/eholdings/resources/${resource.titleId}/edit`, () => {
        expect(ResourceEditPage.$root).to.exist;
      });
    });

    it('shows a form with embargo fields', () => {
      expect(ResourceEditPage.customEmbargoTextFieldValue).to.equal('6');
      expect(ResourceEditPage.customEmbargoSelectValue).to.equal('Months');
    });

    it('disables the save button', () => {
      expect(ResourceEditPage.isSaveDisabled).to.be.true;
    });

    it('shows unchecked peer review box', () => {
      expect(ResourceEditPage.isPeerReviewed).to.be.false;
    });

    describe('clicking cancel', () => {
      beforeEach(() => {
        return ResourceEditPage.clickCancel();
      });

      it('goes to the resource show page', () => {
        expect(ResourceShowPage.$root).to.exist;
      });

      it('displays the original date range', () => {
        expect(ResourceCoverage.displayText).to.equal('7/16/1969 - 12/19/1972');
      });

      it('shows NO for peer reviewed', () => {
        expect(ResourceShowPage.peerReviewedStatus).to.equal('No');
      });
    });

    describe('entering invalid data', () => {
      beforeEach(() => {
        return ResourceEditPage
          .name('')
          .append(ResourceEditPage.dateRangeRowList(0).fillDates('12/18/2018', '12/16/2018'))
          .inputCoverageStatement(`Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
            Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis
            dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec,
            pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo,
            fringilla vel, aliquet nec, vulputate e`)
          .inputEmbargoValue('')
          .blurEmbargoValue()
          .selectEmbargoUnit('Weeks')
          .clickSave();
      });

      it('displays a validation error for the name', () => {
        expect(ResourceEditPage.nameHasError).to.be.true;
      });

      it('displays a validation error for coverage', () => {
        expect(ResourceEditPage.dateRangeRowList(0).beginDate.isInvalid).to.be.true;
      });

      it('displays a validation error message for coverage statement', () => {
        expect(ResourceEditPage.validationErrorOnCoverageStatement).to.equal('Statement must be 350 characters or less.');
      });

      it('displays a validation error for embargo', () => {
        expect(ResourceEditPage.validationErrorOnEmbargoTextField).to.equal('Value cannot be null');
      });
    });

    describe('entering valid data', () => {
      beforeEach(() => {
        return ResourceEditPage
          .name('A Different Name')
          .selectPublicationType('Web Site')
          .checkPeerReviewed()
          .append(ResourceEditPage.dateRangeRowList(0).fillDates('12/16/2018', '12/18/2018'))
          .inputCoverageStatement('Refinance your home loans.')
          .inputEmbargoValue('27')
          .blurEmbargoValue()
          .selectEmbargoUnit('Weeks')
          .blurEmbargoUnit();
      });

      describe('clicking cancel', () => {
        beforeEach(() => {
          return ResourceEditPage.clickCancel();
        });

        it('shows a navigation confirmation modal', () => {
          expect(ResourceEditPage.navigationModal.$root).to.exist;
        });
      });

      describe('clicking save', () => {
        beforeEach(() => {
          return ResourceEditPage.clickSave();
        });

        it('goes to the resource show page', () => {
          expect(ResourceShowPage.$root).to.exist;
        });

        it('reflects the new name', () => {
          expect(ResourceShowPage.titleName).to.equal('A Different Name');
        });

        it('displays the saved date range', () => {
          expect(ResourceCoverage.displayText).to.equal('12/16/2018 - 12/18/2018');
        });

        it('shows the new statement value', () => {
          expect(ResourceShowPage.coverageStatement).to.equal('Refinance your home loans.');
        });

        it('shows the new embargo value', () => {
          expect(ResourceShowPage.customEmbargoPeriod).to.equal('27 Weeks');
        });

        it('shows the new publication type', () => {
          expect(ResourceEditPage.publicationTypeValue).to.equal('Web Site');
        });

        it('shows YES for peer reviewed', () => {
          expect(ResourceShowPage.peerReviewedStatus).to.equal('Yes');
        });
      });
    });
  });

  describe('encountering a server error when GETting', () => {
    beforeEach(function () {
      this.server.get('/resources/:id', {
        errors: [{
          title: 'There was an error'
        }]
      }, 500);

      return this.visit(`/eholdings/resources/${resource.id}/edit`, () => {
        expect(ResourceEditPage.$root).to.exist;
      });
    });

    it('dies with dignity', () => {
      expect(ResourceEditPage.hasErrors).to.be.true;
    });
  });

  describe('encountering a server error when PUTting', () => {
    beforeEach(function () {
      this.server.put('/resources/:id', {
        errors: [{
          title: 'There was an error'
        }]
      }, 500);

      return this.visit(`/eholdings/resources/${resource.id}/edit`, () => {
        expect(ResourceEditPage.$root).to.exist;
      });
    });

    describe('entering valid data and clicking save', () => {
      beforeEach(() => {
        return ResourceEditPage
          .inputCoverageStatement('10 ways to fail at everything')
          .checkPeerReviewed()
          .name('A Different Name')
          .inputEmbargoValue('27')
          .blurEmbargoValue()
          .selectEmbargoUnit('Weeks')
          .blurEmbargoUnit()
          .clickSave();
      });

      it('pops up an error', () => {
        expect(ResourceEditPage.toast.errorText).to.equal('There was an error');
      });
    });
  });
});
