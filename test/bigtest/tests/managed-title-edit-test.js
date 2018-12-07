import { expect } from 'chai';
import { describe, beforeEach, it } from '@bigtest/mocha';

import setupApplication from '../helpers/setup-application';
import TitleShowPage from '../interactors/title-show';

describe('ManagedTitleEdit', () => {
  setupApplication();
  let title;

  beforeEach(function () {
    title = this.server.create('title', {
      name: 'Best Title Ever',
      isTitleCustom: false
    });
  });

  describe('trying to edit a managed title', () => {
    beforeEach(function () {
      this.visit(`/eholdings/titles/${title.id}/edit`);
    });

    it('redirects to the title show page', () => {
      expect(TitleShowPage.$root).to.exist;
    });
  });
});
