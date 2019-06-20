import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
  serialize(x) {
    return x.models
      ? x.models.reduce((response, noteType) => {
        return {
          noteTypes: [
            ...response.noteTypes,
            { ...noteType.attrs },
          ],
          totalRecords: ++response.totalRecords
        };
      }, { noteTypes: [], totalRecords: 0 })
      : x.attrs;
  }
});
