import { handleSaveKeyFormSubmit } from './utilities';

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
