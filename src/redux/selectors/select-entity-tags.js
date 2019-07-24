export default function selectEntityTags(entityName, entityId, store) {
  return store[entityName].records[entityId].tags.tagList || [];
}
