import { expect } from 'chai';
import { describe, beforeEach, it } from '@bigtest/mocha';

import { describeApplication } from './helpers';
import TitleShowPage from './pages/title-show';
import TitleEditPage from './pages/title-edit';

describeApplication('CustomTitleEdit', () => {
  let provider,
    providerPackage,
    title;

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

    title = this.server.create('title', {
      name: 'Best Title Ever',
      edition: 'Test Edition',
      publicationType: 'Streaming Video',
      publisherName: 'Amazing Publisher',
      isPeerReviewed: false,
      contributors: [
        {
          id: '001',
          contributor: 'Foo',
          type: 'author'
        }
      ],
      isTitleCustom: true
    });

    title.save();

    this.server.create('resource', {
      package: providerPackage,
      isSelected: true,
      title,
      url: 'frontside.io',
      isTitleCustom: true
    });
  });

  describe('visiting the title edit page', () => {
    beforeEach(function () {
      return this.visit(`/eholdings/titles/${title.id}/edit`, () => {
        expect(TitleEditPage.$root).to.exist;
      });
    });

    it('shows a field for edition', () => {
      expect(TitleEditPage.editionValue).to.equal('Test Edition');
    });

    it('shows a field for publisher', () => {
      expect(TitleEditPage.publisherValue).to.equal('Amazing Publisher');
    });

    it('shows a description field', () => {
      expect(TitleEditPage.descriptionField).to.equal('');
    });

    it('shows a contributor field', () => {
      expect(TitleEditPage.contributorValue).to.equal('Foo');
      expect(TitleEditPage.contributorType).to.equal('author');
    });

    it('shows unchecked peer review box', () => {
      expect(TitleEditPage.isPeerReviewed).to.be.false;
    });

    it('disables the save button', () => {
      expect(TitleEditPage.isSaveDisabled).to.be.true;
    });

    describe('clicking cancel', () => {
      beforeEach(() => {
        return TitleEditPage.clickCancel();
      });

      it('goes to the title show page', () => {
        expect(TitleShowPage.$root).to.exist;
      });
    });

    describe('entering a long contributor name', () => {
      beforeEach(() => {
        return TitleEditPage
          .fillContributor(new Array(255 + 1).join('a'))
          .clickSave();
      });

      it('displays the correct validation message', () => {
        expect(TitleEditPage.contributorHasError).to.be.true;
        expect(TitleEditPage.contributorError).to.equal('A contributor must be less than 250 characters');
      });
    });

    describe('Removing all contributors when they were previously set', () => {
      beforeEach(() => {
        return TitleEditPage
          .removeContributorCollection(0)
          .remove();
      });

      it('displays a message saying they will be removed on save', () => {
        expect(TitleEditPage.contributorsWillBeRemoved).to
          .equal('No contributors set. Saving will remove any previously set.');
      });
    });

    describe('entering invalid data', () => {
      beforeEach(() => {
        return TitleEditPage
          .name('')
          .fillEdition(`In the realm of narrative psychology, a person’s life story is not a Wikipedia biography of the facts and
            events of a life, but rather the way a person integrates those facts and events internally—picks them apart and weaves them back
            together to make meaning. `)
          .fillContributor('')
          .fillPublisher(`The only prerequisite is that it makes you happy.
            If it makes you happy then it's good. All kinds of happy little splashes.
            I started painting as a hobby when I was little. I didn't know I had any talent.
            I believe talent is just a pursued interest. Anybody can do what I do.
            We'll put some happy little leaves here and there. Go out on a limb - that's where the fruit is.
            God gave you this gift of imagination. Use it.`)
          .fillDescription(`Trees cover up a multitude of sins. If you don't think every day is a good day - try missing a few. You'll see. Put light against light - you have nothing. Put dark against dark - you have nothing. It's the contrast of light and dark that each give the other one meaning. Water's like me. It's laaazy. Boy, it always looks for the easiest way to do things We might as well make some Almighty mountains today as well, what the heck.
            You have to make these big decisions. Just take out whatever you don't want. It'll change your entire perspective. We artists are a different breed of people. We're a happy bunch.
            All you need to paint is a few tools, a little instruction, and a vision in your mind. Exercising the imagination, experimenting with talents, being creative; these things, to me, are truly the windows to your soul. I guess that would be considered a UFO. A big cotton ball in the sky.
            La-da-da-da-dah. Just be happy. Clouds are free. They just float around the sky all day and have fun. Let your heart take you to wherever you want to be. Anyone can paint. You don't have to be crazy to do this but it does help. Everyone needs a friend. Friends are the most valuable things in the world.
            Every time you practice, you learn more. This is a happy place, little squirrels live here and play. Each highlight must have it's own private shadow. If what you're doing doesn't make you happy - you're doing the wrong thing. At home you have unlimited time. Nice little fluffy clouds laying around in the sky being lazy.`)
          .clickSave();
      });

      it('displays a validation error for the name', () => {
        expect(TitleEditPage.nameHasError).to.be.true;
      });

      it('displays a validation error for the edition field', () => {
        expect(TitleEditPage.editionHasError).to.be.true;
      });

      it('displays a validation error for contributor', () => {
        expect(TitleEditPage.contributorHasError).to.be.true;
        expect(TitleEditPage.contributorError).to.equal('You must provide a contributor');
      });

      it('displays a validation error for the publisher field', () => {
        expect(TitleEditPage.publisherHasError).to.be.true;
      });
    });

    describe('entering empty spaces for edition', () => {
      beforeEach(() => {
        return TitleEditPage
          .name('some name')
          .fillEdition('        ')
          .fillPublisher('some publisher')
          .fillDescription('some description')
          .clickSave();
      });

      it('displays a validation error for the edition field', () => {
        expect(TitleEditPage.editionHasError).to.be.true;
      });
    });

    describe('entering valid data', () => {
      beforeEach(() => {
        return TitleEditPage
          .fillEdition('testing edition again')
          .fillPublisher('Not So Awesome Publisher')
          .fillContributor('Awesome Author')
          .selectContributorType('Editor')
          .fillDescription('What a super helpful description. Wow.')
          .checkPeerReviewed();
      });

      describe('clicking cancel', () => {
        beforeEach(() => {
          return TitleEditPage.clickCancel();
        });

        it('shows a navigation confirmation modal', () => {
          expect(TitleEditPage.navigationModal.$root).to.exist;
        });
      });

      describe('clicking save', () => {
        beforeEach(() => {
          return TitleEditPage.clickSave();
        });

        it('goes to the title show page', () => {
          expect(TitleShowPage.$root).to.exist;
        });

        it('reflects the new edition', () => {
          expect(TitleShowPage.edition).to.equal('testing edition again');
        });

        it('reflects the new publisher', () => {
          expect(TitleShowPage.publisherName).to.equal('Not So Awesome Publisher');
        });

        it('reflects the new contributor', () => {
          expect(TitleShowPage.contributorsList(0).text).to.equal('Awesome Author');
        });

        it('shows the new description', () => {
          expect(TitleShowPage.descriptionText).to.equal('What a super helpful description. Wow.');
        });

        it('shows YES for peer reviewed', () => {
          expect(TitleShowPage.peerReviewedStatus).to.equal('Yes');
        });
      });
    });
  });

  describe('visiting the title edit page', () => {
    beforeEach(function () {
      return this.visit(`/eholdings/titles/${title.id}/edit`, () => {
        expect(TitleEditPage.$root).to.exist;
      });
    });

    it('disables the save button', () => {
      expect(TitleEditPage.isSaveDisabled).to.be.true;
    });

    it('shows unchecked peer review box', () => {
      expect(TitleEditPage.isPeerReviewed).to.be.false;
    });

    describe('clicking cancel', () => {
      beforeEach(() => {
        return TitleEditPage.clickCancel();
      });

      it('goes to the title show page', () => {
        expect(TitleShowPage.$root).to.exist;
      });

      it('shows NO for peer reviewed', () => {
        expect(TitleShowPage.peerReviewedStatus).to.equal('No');
      });
    });

    describe('entering invalid data', () => {
      beforeEach(() => {
        return TitleEditPage
          .name('')
          .clickSave();
      });

      it('displays a validation error for the name', () => {
        expect(TitleEditPage.nameHasError).to.be.true;
      });
    });

    describe('entering valid data', () => {
      beforeEach(() => {
        return TitleEditPage
          .name('A Different Name')
          .fillEdition('A Different Edition')
          .selectPublicationType('Web Site')
          .checkPeerReviewed();
      });

      describe('clicking cancel', () => {
        beforeEach(() => {
          return TitleEditPage.clickCancel();
        });

        it('shows a navigation confirmation modal', () => {
          expect(TitleEditPage.navigationModal.$root).to.exist;
        });
      });

      describe('clicking save', () => {
        beforeEach(() => {
          return TitleEditPage.clickSave();
        });

        it('goes to the title show page', () => {
          expect(TitleShowPage.$root).to.exist;
        });

        it('reflects the new name', () => {
          expect(TitleShowPage.titleName).to.equal('A Different Name');
        });

        it('shows the new edition', () => {
          expect(TitleEditPage.editionValue).to.equal('A Different Edition');
        });

        it('shows the new publication type', () => {
          expect(TitleEditPage.publicationTypeValue).to.equal('Web Site');
        });

        it('shows YES for peer reviewed', () => {
          expect(TitleShowPage.peerReviewedStatus).to.equal('Yes');
        });
      });
    });
  });

  describe('encountering a server error when GETting', () => {
    beforeEach(function () {
      this.server.get('/titles/:id', {
        errors: [{
          title: 'There was an error'
        }]
      }, 500);

      return this.visit(`/eholdings/titles/${title.id}/edit`, () => {
        expect(TitleEditPage.$root).to.exist;
      });
    });

    it('dies with dignity', () => {
      expect(TitleEditPage.hasErrors).to.be.true;
    });
  });

  describe('encountering a server error when PUTting', () => {
    beforeEach(function () {
      this.server.put('/resources/:id', {
        errors: [{
          title: 'There was an error'
        }]
      }, 500);

      return this.visit(`/eholdings/titles/${title.id}/edit`, () => {
        expect(TitleEditPage.$root).to.exist;
      });
    });

    describe('entering valid data and clicking save', () => {
      beforeEach(() => {
        return TitleEditPage
          .checkPeerReviewed()
          .name('A Different Name')
          .fillEdition('A Different Edition')
          .clickSave();
      });

      it('pops up an error', () => {
        expect(TitleEditPage.toast.errorText).to.equal('There was an error');
      });
    });
  });

  describe('visiting the title show page', () => {
    beforeEach(function () {
      return this.visit(`/eholdings/titles/${title.id}`, () => {
        expect(TitleShowPage.$root).to.exist;
      });
    });

    describe('clicking the edit button', () => {
      beforeEach(() => {
        return TitleShowPage.clickEditButton();
      });

      it('should display the back button in pane header', () => {
        expect(TitleEditPage.hasBackButton).to.be.true;
      });
    });
  });
});
