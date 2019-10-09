import React from 'react';
import { Side, State, beginVolley } from '../common/state';

const Controller: React.FC<{
  side: Side;
  state: State;
  channel: RTCDataChannel;
}> = ({ side, state, channel }) => {
  return (
    <section>
      <div>Controller - {side}</div>
      <pre>My state is {JSON.stringify(state, null, 2)}</pre>
      <button
        onClick={() => {
          channel.send(JSON.stringify(beginVolley(side)));
        }}
      >
        Start recording volley
      </button>
    </section>
  );
};

export default Controller;
