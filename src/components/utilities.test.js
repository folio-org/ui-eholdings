import {
  handleSaveKeyFormSubmit,
  getAccessTypeIdsAndNames,
} from './utilities';

describe('utilities', () => {
  describe('handleSaveKeyFormSubmit', () => {
    it('should dispatch Submit event', () => {
      const formRef = {
        dispatchEvent: jest.fn((event) => event),
      };
      const event = {
        preventDefault: jest.fn(),
      };

      handleSaveKeyFormSubmit(formRef)(event);

      expect(event.preventDefault).toHaveBeenCalledTimes(1);
      expect(formRef.dispatchEvent).toHaveBeenCalledTimes(1);
    });
  });

  describe('getAccessTypeIdsAndNames', () => {
    const accessStatusTypes = [{
      id: 'id1',
      attributes: {
        name: 'name1',
      },
    }];
    const expectedAccessStatusTypes = [{
      id: 'id1',
      name: 'name1',
    }];

    expect(getAccessTypeIdsAndNames(accessStatusTypes)).toEqual(expectedAccessStatusTypes);
  });
});
