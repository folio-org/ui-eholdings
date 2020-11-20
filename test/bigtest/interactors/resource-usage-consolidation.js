import {
  interactor,
  isPresent,
} from '@bigtest/interactor';

import { AccordionInteractor } from '@folio/stripes-components/lib/Accordion/tests/interactor';

export default @interactor class ResourceUsageConsolidation {
  accordion = new AccordionInteractor('#resourceShowUsageConsolidation');
  isAccordionPresent = isPresent('#resourceShowUsageConsolidation');

  whenLoaded() {
    return this.when(() => this.isAccordionPresent).timeout(1000);
  }
}
