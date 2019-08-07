export default function updateEntityTagsFailure(request, { errors }, data) {
  return {
    type: '@@ui-eholdings/db/REJECT',
    request,
    errors,
    data,
  };
}
