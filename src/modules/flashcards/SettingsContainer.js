import { connect } from 'react-redux';
import { compose, withState } from 'recompose';
import { isDefinitionFirstSet, isShuffledSet } from './FlashCardsState';

import Settings from './Settings';

export default compose(
  connect(
    state => ({
      isDefinitionFirst: state.flashcards.isDefinitionFirst,
      isShuffled: state.flashcards.isShuffled,
    }),
    dispatch => ({
      isDefinitionFirstSet: (isDefinitionFirst) => dispatch(isDefinitionFirstSet(isDefinitionFirst)),
      isShuffledSet: (isShuffled) => dispatch(isShuffledSet(isShuffled)),
    }),
  ),
  withState('isExtended', 'setIsExtended', false))(
  Settings,
);
