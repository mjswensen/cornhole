import React from 'react';
import { State } from '../common/state';

const Scoreboard: React.FC<{
  state: State;
}> = ({ state }) => {
  return (
    <section>
      <p>score board</p>
      <pre>{JSON.stringify(state, null, 2)}</pre>
    </section>
  );
};

export default Scoreboard;

// TODO: use vibration API for something
