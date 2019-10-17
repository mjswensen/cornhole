import React from 'react';
import {
  Side,
  State,
  beginVolley,
  updateVolley,
  commitVolley,
  cancelVolley,
  Team,
} from '../common/state';
import ColorIndicator from '../common/ColorIndicator';
import Stepper from './Stepper';

const Controller: React.FC<{
  side: Side;
  state: State;
  channel: RTCDataChannel;
}> = ({ side, state, channel }) => {
  const oppositeSide = side === 'side1' ? 'side2' : 'side1';
  function sendUpdatedVolley(
    team: Team,
    countKey: 'onBoard' | 'inHole',
    value: number,
  ) {
    if (state.ephemeralVolley) {
      channel.send(
        JSON.stringify(
          updateVolley({
            ...state.ephemeralVolley,
            [team]: {
              ...state.ephemeralVolley[team],
              [countKey]: Math.min(Math.max(value, 0), 4),
            },
          }),
        ),
      );
    }
  }
  return (
    <section className="container">
      <div className="jumbotron">
        <h1 className="display-4">Side {side === 'side1' ? '1' : '2'}</h1>
      </div>
      {state.ephemeralVolley === null ? (
        <button
          className="btn btn-primary btn-lg"
          onClick={() => {
            channel.send(JSON.stringify(beginVolley(oppositeSide)));
          }}
        >
          Start recording volley
        </button>
      ) : state.ephemeralVolley.throwingSide === side ? (
        <p>Your side is currently throwing.</p>
      ) : (
        <>
          <div className="row">
            <div className="col-12 col-md-6">
              <div className="card">
                <div className="card-body">
                  <h2 className="card-title">
                    {state.names[oppositeSide].teamA}
                    <ColorIndicator color={state.colors.teamA} />
                  </h2>
                  <p>
                    On the board:
                    <Stepper
                      value={state.ephemeralVolley.teamA.onBoard}
                      onChange={v => sendUpdatedVolley('teamA', 'onBoard', v)}
                    />
                  </p>
                  <p>
                    In the hole:
                    <Stepper
                      value={state.ephemeralVolley.teamA.inHole}
                      onChange={v => sendUpdatedVolley('teamA', 'inHole', v)}
                    />
                  </p>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="card">
                <div className="card-body">
                  <h2 className="card-title">
                    {state.names[oppositeSide].teamB}
                    <ColorIndicator color={state.colors.teamB} />
                  </h2>
                  <p>
                    On the board:
                    <Stepper
                      value={state.ephemeralVolley.teamB.onBoard}
                      onChange={v => sendUpdatedVolley('teamB', 'onBoard', v)}
                    />
                  </p>
                  <p>
                    In the hole:
                    <Stepper
                      value={state.ephemeralVolley.teamB.inHole}
                      onChange={v => sendUpdatedVolley('teamB', 'inHole', v)}
                    />
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-4">
            <div className="col">
              <button
                className="btn btn-secondary btn-lg"
                onClick={() => {
                  if (
                    window.confirm(
                      'Are you sure you want to cancel recording this volley?',
                    )
                  ) {
                    channel.send(JSON.stringify(cancelVolley()));
                  }
                }}
              >
                Cancel
              </button>
              <button
                className="btn btn-success btn-lg"
                onClick={() => channel.send(JSON.stringify(commitVolley()))}
              >
                Complete Volley
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default Controller;
