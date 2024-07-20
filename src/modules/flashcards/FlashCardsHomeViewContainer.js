import { compose, withState } from 'recompose';

import FlashCardsHomeScreen from './FlashCardsHomeView';

export default compose(withState('isExtended', 'setIsExtended', false))(
  FlashCardsHomeScreen,
);
