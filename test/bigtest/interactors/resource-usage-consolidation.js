import {
  interactor,
  isPresent,
} from '@bigtest/interactor';

import { AccordionInteractor } from '@folio/stripes-components/lib/Accordion/tests/interactor';

import UsageConsolidationFilters from './usage-consolidation-filters';
import UsageConsolidationInfoPopover from './usage-consolidation-info-popover';
import UsageConsolidationContent from './usage-consolidation-content-resource';

export default @interactor class ResourceUsageConsolidation {
  accordion = new AccordionInteractor('#resourceShowUsageConsolidation');
  isAccordionPresent = isPresent('#resourceShowUsageConsolidation');

  filters = new UsageConsolidationFilters();
  infoPopover = new UsageConsolidationInfoPopover();
  content = new UsageConsolidationContent();

  whenLoaded() {
    return this.when(() => this.isAccordionPresent).timeout(1000);
  }
}
