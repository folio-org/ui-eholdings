export default function fillOffsetWithNull(offset, resources = []) {
  const resourcesArray = new Array(offset);

  resourcesArray.splice(offset, 0, ...resources);

  return resourcesArray;
}
