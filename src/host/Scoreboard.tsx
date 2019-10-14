import React from 'react';
import { State, currentScore } from '../common/state';

const Scoreboard: React.FC<{
  state: State;
}> = ({ state }) => {
  return (
    <section className="container">
      <div className="jumbotron">
        <h1 className="display-4">
          Scoreboard
          <span className="ml-3" role="img" aria-label="corn and hole emoji">
            🌽🕳
          </span>
        </h1>
      </div>
      <div className="d-flex justify-content-between p-2">
        <h2>
          {state.names.side1.teamA} and {state.names.side2.teamA} (
          {state.colors.teamA})
        </h2>
        <h2>
          {state.names.side1.teamB} and {state.names.side2.teamB} (
          {state.colors.teamB})
        </h2>
      </div>
      <div className="d-flex justify-content-between p-2">
        <span className="display-1">{currentScore(state).teamA}</span>
        <span className="display-1">{currentScore(state).teamB}</span>
      </div>
    </section>
  );
};

export default Scoreboard;

// TODO: use vibration API for something
