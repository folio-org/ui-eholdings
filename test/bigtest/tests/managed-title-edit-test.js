import { expect } from 'chai';
import { describe, beforeEach, it } from '@bigtest/mocha';

import setupApplication from '../helpers/setup-application';
import TitleShowPage from '../interactors/title-show';

describe.skip('ManagedTitleEdit', () => {
  setupApplication();
  let title;

  beforeEach(async function () {
    title = await this.server.create('title', {
      name: 'Best Title Ever',
      isTitleCustom: false
    });
  });

  describe('trying to edit a managed title', () => {
    beforeEach(async function () {
      await this.visit(`/eholdings/titles/${title.id}/edit`);
    });

    it('redirects to the title show page', () => {
      expect(TitleShowPage.$root).to.exist;
    });
  });
});
