import {
  text,
} from '@bigtest/interactor';

import { interactor } from '../helpers/interactor';

export default @interactor class NoteDetailsField {
  value = text();
}
