import { connect } from 'react-redux';
import { compose, withState } from 'recompose';
import { loadCards, loadCardsAsync  } from './FlashCardsState';

import FlashCardsHomeScreen from './FlashCardsHomeView';

export default compose(
  connect(
    state => ({}),
    dispatch => ({
      loadCards: (cards) => dispatch(loadCards(cards)),
      loadCardsAsync: (cards) => loadCardsAsync(cards)(dispatch),
    }),
  ),
  withState('isExtended', 'setIsExtended', false))(
  FlashCardsHomeScreen,
);
