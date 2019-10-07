import React, { useEffect, useReducer } from 'react';
import { CombinedState } from '../common/state/combined';
import { initialScoreState, scoreReducer } from '../common/state/score';
import { initialTurnState, turnReducer } from '../common/state/turn';

const Scoreboard: React.FC<{
  channel1: RTCDataChannel;
  channel2: RTCDataChannel;
}> = ({ channel1, channel2 }) => {
  const [turnState, turnDispatch] = useReducer(turnReducer, initialTurnState);
  const [scoreState, scoreDispatch] = useReducer(
    scoreReducer,
    initialScoreState,
  );

  useEffect(() => {
    function combined(identity: 'side1' | 'side2'): CombinedState {
      return { turnState, scoreState, identity };
    }
    channel1.send(JSON.stringify(combined('side1')));
    channel2.send(JSON.stringify(combined('side2')));
  }, [channel1, channel2, turnState, scoreState]);

  return (
    <section>
      <p>score board</p>
    </section>
  );
};

export default Scoreboard;

/*

messages that come in:

- request for turn
- cancel turn
- turn commit (score)
- ephemeral score

*/

// TODO: use vibration API for something
