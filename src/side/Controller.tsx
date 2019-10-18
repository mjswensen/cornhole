import React from 'react';
import {
  Side,
  State,
  beginFrame,
  updateFrame,
  commitFrame,
  cancelFrame,
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
  function sendUpdatedFrame(
    team: Team,
    countKey: 'onBoard' | 'inHole',
    value: number,
  ) {
    if (state.ephemeralFrame) {
      channel.send(
        JSON.stringify(
          updateFrame({
            ...state.ephemeralFrame,
            [team]: {
              ...state.ephemeralFrame[team],
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
      {state.ephemeralFrame === null ? (
        <button
          className="btn btn-primary btn-lg"
          onClick={() => {
            channel.send(JSON.stringify(beginFrame(oppositeSide)));
          }}
        >
          Start recording frame
        </button>
      ) : state.ephemeralFrame.throwingSide === side ? (
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
                      value={state.ephemeralFrame.teamA.onBoard}
                      onChange={v => sendUpdatedFrame('teamA', 'onBoard', v)}
                    />
                  </p>
                  <p>
                    In the hole:
                    <Stepper
                      value={state.ephemeralFrame.teamA.inHole}
                      onChange={v => sendUpdatedFrame('teamA', 'inHole', v)}
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
                      value={state.ephemeralFrame.teamB.onBoard}
                      onChange={v => sendUpdatedFrame('teamB', 'onBoard', v)}
                    />
                  </p>
                  <p>
                    In the hole:
                    <Stepper
                      value={state.ephemeralFrame.teamB.inHole}
                      onChange={v => sendUpdatedFrame('teamB', 'inHole', v)}
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
                      'Are you sure you want to cancel recording this frame?',
                    )
                  ) {
                    channel.send(JSON.stringify(cancelFrame()));
                  }
                }}
              >
                Cancel
              </button>
              <button
                className="btn btn-success btn-lg"
                onClick={() => channel.send(JSON.stringify(commitFrame()))}
              >
                Complete Frame
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default Controller;
