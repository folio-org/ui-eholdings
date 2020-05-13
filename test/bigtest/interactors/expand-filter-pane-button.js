import {
  interactor,
  text,
  isPresent,
  clickable,
} from '@bigtest/interactor';

export default interactor(class ExpandFilterPaneButtonInteractor {
  static defaultScope = '[data-test-expand-filter-pane-button]';
  clickIcon = clickable();
  badgeIsPresent = isPresent('[class^="badge---"]');
  badgeText = text('[class^="badge---"]');
});
