import React from 'react';
import { CombinedState } from '../common/state/combined';

const Controller: React.FC<{
  state: CombinedState;
}> = ({ state }) => {
  return (
    <section>
      <div>Controller</div>
      <div>My identity is {state.identity}</div>
    </section>
  );
};

export default Controller;

/*

message that come in:

- turn status, including game over

*/
