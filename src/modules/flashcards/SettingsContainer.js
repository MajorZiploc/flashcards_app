import { connect } from 'react-redux';
import { compose, withState } from 'recompose';
import { isDefinitionFirstSet } from './FlashCardsState';

import Settings from './Settings';

export default compose(
  connect(
    state => ({
      isDefinitionFirst: state.flashcards.isDefinitionFirst,
    }),
    dispatch => ({
      isDefinitionFirstSet: (isDefinitionFirst) => dispatch(isDefinitionFirstSet(isDefinitionFirst)),
    }),
  ),
  withState('isExtended', 'setIsExtended', false))(
  Settings,
);
