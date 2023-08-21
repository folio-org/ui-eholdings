import {
  fireEvent,
  render,
} from '@folio/jest-config-stripes/testing-library/react';
import noop from 'lodash/noop';

import SettingsKnowledgeBase from './settings-knowledge-base';
import Harness from '../../../../test/jest/helpers/harness';

const config = {
  attributes: {
    apiKey: 'apiKey',
    customerId: 'customerId',
    name: 'kbName',
    url: 'url.com',
  },
  id: 'kbId',
  metadata: {
    createdByUserId: '4a599ce7-95e7-4305-9188-7f946e084296',
    createdByUsername: 'SYSTEM',
    createdDate: '2021-08-30T01:53:26.081+00:00',
    updatedByUserId: '3c0b9d19-925f-55e4-84bb-e07a8f0c2ca3',
    updatedByUsername: 'diku_admin',
    updatedDate: '2021-08-30T01:53:26.081+00:00',
  },
  type: 'kbCredentials',
};

const kbCredentials = {
  errors: [],
  hasFailed: false,
  hasKeyLoaded: true,
  hasLoaded: true,
  hasUpdated: false,
  isKeyLoading: false,
  isLoading: false,
  isUpdating: false,
  items: [config, {
    attributes: {
      apiKey: 'apiKey2',
      customerId: 'customerId2',
      name: 'kb name',
      url: 'url.com',
    },
    id: 'kbId2',
    metadata: {
      createdByUserId: '4a599ce7-95e7-4305-9188-7f946e084296',
      createdByUsername: 'SYSTEM',
      createdDate: '2021-09-30T01:53:26.081+00:00',
      updatedByUserId: '3c0b9d19-925f-55e4-84bb-e07a8f0c2ca3',
      updatedByUsername: 'diku_admin',
      updatedDate: '2021-09-30T01:53:26.081+00:00',
    },
    type: 'kbCredentials',
  }],
};

const getSettingsKnowledgeBase = (props = {}) => (
  <Harness>
    <SettingsKnowledgeBase
      config={config}
      currentKBName="Knowledge Base"
      kbCredentials={kbCredentials}
      kbId="kbId"
      onDelete={noop}
      onSubmit={noop}
      {...props}
    />
  </Harness>
);

const renderSettingsKnowledgeBase = (props = {}) => render(getSettingsKnowledgeBase(props));

describe('Given SearchKnowledgeBase', () => {
  it('should show delete button', () => {
    const { getByText } = renderSettingsKnowledgeBase();

    expect(getByText('ui-eholdings.settings.kb.delete')).toBeDefined();
  });

  it('should show edit kb credentials title', () => {
    const { getByText } = renderSettingsKnowledgeBase();

    expect(getByText('ui-eholdings.settings.kb.edit')).toBeDefined();
  });

  describe('when fill name field with empty value', () => {
    it('should show validation error', () => {
      const {
        getByTestId,
        getByText,
      } = renderSettingsKnowledgeBase();

      fireEvent.change(getByTestId('kb-name-field'), { target: { value: '' } });
      fireEvent.blur(getByTestId('kb-name-field'));

      expect(getByText('ui-eholdings.validate.errors.settings.kb.name')).toBeDefined();
    });
  });

  describe('when fill name field with value more than 255 characters', () => {
    it('should show validation error', () => {
      const {
        getByTestId,
        getByText,
      } = renderSettingsKnowledgeBase();

      fireEvent.change(getByTestId('kb-name-field'), { target: { value: new Array(256).fill('a').join('') } });
      fireEvent.blur(getByTestId('kb-name-field'));

      expect(getByText('ui-eholdings.validate.errors.settings.kb.name.length')).toBeDefined();
    });
  });

  describe('when fill customer id field with empty value', () => {
    it('should show validation error', () => {
      const {
        getByTestId,
        getByText,
      } = renderSettingsKnowledgeBase();

      fireEvent.change(getByTestId('customer-id-field'), { target: { value: '' } });
      fireEvent.blur(getByTestId('customer-id-field'));

      expect(getByText('ui-eholdings.validate.errors.settings.customerId')).toBeDefined();
    });
  });

  describe('when fill api key field with empty value', () => {
    it('should show validation error', () => {
      const {
        getByTestId,
        getByText,
      } = renderSettingsKnowledgeBase();

      fireEvent.change(getByTestId('api-key-field'), { target: { value: '' } });
      fireEvent.blur(getByTestId('api-key-field'));

      expect(getByText('ui-eholdings.validate.errors.settings.apiKey')).toBeDefined();
    });
  });

  describe('when click on delete button', () => {
    it('should show delete confirmation modal', () => {
      const { getByText } = renderSettingsKnowledgeBase();

      fireEvent.click(getByText('ui-eholdings.settings.kb.delete'));

      expect(getByText('ui-eholdings.settings.kb.delete.modalHeading')).toBeDefined();
    });

    describe('when click on delete button', () => {
      it('should handle onDelete action', () => {
        const mockOnDelete = jest.fn();
        const {
          getByText,
          getByTestId,
        } = renderSettingsKnowledgeBase({
          onDelete: mockOnDelete,
        });

        fireEvent.click(getByText('ui-eholdings.settings.kb.delete'));
        fireEvent.click(getByTestId('confirm-delete-button'));

        expect(mockOnDelete).toHaveBeenCalledWith('kbId');
      });
    });
  });

  describe('when config is null', () => {
    it('should not render settings knowledge base form', () => {
      const { container } = renderSettingsKnowledgeBase({
        config: null,
      });

      expect(container.querySelector('form')).toBeNull();
    });
  });

  describe('when active create mode', () => {
    it('should show new kb credentials title', () => {
      const { getByText } = renderSettingsKnowledgeBase({
        isCreateMode: true,
      });

      expect(getByText('ui-eholdings.settings.kb.new')).toBeDefined();
    });

    it('should not show delete button', () => {
      const { queryByText } = renderSettingsKnowledgeBase({
        isCreateMode: true,
        kbCredentials: {
          ...kbCredentials,
          items: [
            ...kbCredentials.items,
            {
              ...config,
              attributes: {
                ...config.attributes,
                name: 'ui-eholdings.settings.kb (1)',
              },
            }, {
              ...config,
              attributes: {
                ...config.attributes,
                name: 'ui-eholdings.settings.kb',
              },
            },
          ],
        },
      });

      expect(queryByText('ui-eholdings.settings.kb.delete')).toBeNull();
    });
  });

  describe('when kb credentials are loading', () => {
    it('should show spinner', () => {
      const { container } = renderSettingsKnowledgeBase({
        kbCredentials: {
          ...kbCredentials,
          isLoading: true,
        },
      });

      expect(container.querySelector('.icon-spinner-ellipsis')).toBeDefined();
    });
  });

  describe('when kb credetials has been updated', () => {
    it('should show success toast notification', () => {
      const { getByText } = renderSettingsKnowledgeBase({
        kbCredentials: {
          ...kbCredentials,
          hasUpdated: true,
        },
      });

      expect(getByText('ui-eholdings.settings.kb.updated')).toBeDefined();
    });
  });

  describe('when kb credetials has been saved', () => {
    it('should show success toast notification', () => {
      const { getByText } = renderSettingsKnowledgeBase({
        kbCredentials: {
          ...kbCredentials,
          hasSaved: true,
        },
      });

      expect(getByText('ui-eholdings.settings.kb.saved')).toBeDefined();
    });
  });

  describe('when kb credentials return error', () => {
    it('should show error notification', () => {
      const {
        getByText,
        rerender,
      } = renderSettingsKnowledgeBase();

      rerender(getSettingsKnowledgeBase({
        kbCredentials: {
          ...kbCredentials,
          errors: [{
            title: 'Error title',
          }],
        },
      }));

      expect(getByText('Error title')).toBeDefined();
    });
  });
});
