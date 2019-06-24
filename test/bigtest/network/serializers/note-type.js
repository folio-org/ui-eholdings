import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
  serialize(db) {
    return db.models
      ? db.models.reduce((response, noteType) => {
        return {
          noteTypes: [
            ...response.noteTypes,
            { ...noteType.attrs },
          ],
          totalRecords: ++response.totalRecords
        };
      }, { noteTypes: [], totalRecords: 0 })
      : db.attrs;
  }
});
