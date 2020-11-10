import {
  interactor,
  isPresent,
} from '@bigtest/interactor';

import { AccordionInteractor } from '@folio/stripes-components/lib/Accordion/tests/interactor';

export default @interactor class PackageUsageConsolidation {
  accordion = new AccordionInteractor('#packageShowUsageConsolidation');
  isAccordionPresent = isPresent('#packageShowUsageConsolidation');
}
