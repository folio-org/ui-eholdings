export const handleSaveKeyFormSubmit = (event, formRef) => {
  const submitEvent = new Event("submit");

  event.preventDefault();
  formRef.current.dispatchEvent(submitEvent);
};
