import { setupStripesCore } from '@folio/stripes/core/test';
import mirageOptions from '../network';

export default function setupApplication({
  scenarios
} = {}) {
  setupStripesCore({
    mirageOptions,
    scenarios
  });
}
