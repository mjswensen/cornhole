import React, { useEffect, useReducer } from 'react';
import { initialState, reducer } from '../common/state';
import { useConnection } from '../common/useConnection';
import Scoreboard from './Scoreboard';
import Setup from './Setup';

const Host: React.FC = () => {
  const [pc1, channel1, connected1] = useConnection(1);
  const [pc2, channel2, connected2] = useConnection(2);

  const connected = connected1 && connected2;

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const serialized = JSON.stringify(state);
    if (connected) {
      channel1.send(serialized);
      channel2.send(serialized);
    }
  }, [connected, channel1, channel2, state]);

  useEffect(() => {
    function handleMessage(evt: MessageEvent) {
      dispatch(JSON.parse(evt.data));
    }
    channel1.addEventListener('message', handleMessage);
    channel2.addEventListener('message', handleMessage);
    return () => {
      channel1.removeEventListener('message', handleMessage);
      channel2.removeEventListener('message', handleMessage);
    };
  }, [channel1, channel2, dispatch]);

  if (!connected) {
    return (
      <Setup
        pc1={pc1}
        pc2={pc2}
        channel1={channel1}
        channel2={channel2}
        connected1={connected1}
        connected2={connected2}
        state={state}
        dispatch={dispatch}
      />
    );
  } else {
    return <Scoreboard state={state} />;
  }
};

export default Host;
