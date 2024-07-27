import { connect } from 'react-redux';
import { compose, withState } from 'recompose';
import { isDefinitionFirstSet, loadCards, loadCardsAsync  } from './FlashCardsState';

import FlashCardsHomeScreen from './FlashCardsHomeView';

export default compose(
  connect(
    state => ({
      isDefinitionFirst: state.flashcards.isDefinitionFirst,
    }),
    dispatch => ({
      isDefinitionFirstSet: (isDefinitionFirst) => dispatch(isDefinitionFirstSet(isDefinitionFirst)),
      loadCards: (cards) => dispatch(loadCards(cards)),
      loadCardsAsync: (cards) => loadCardsAsync(cards)(dispatch),
    }),
  ),
  withState('isExtended', 'setIsExtended', false))(
  FlashCardsHomeScreen,
);
