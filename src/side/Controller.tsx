import React from 'react';
import {
  Side,
  State,
  beginVolley,
  updateVolley,
  commitVolley,
  cancelVolley,
} from '../common/state';
import ColorIndicator from '../common/ColorIndicator';

const Controller: React.FC<{
  side: Side;
  state: State;
  channel: RTCDataChannel;
}> = ({ side, state, channel }) => {
  const oppositeSide = side === 'side1' ? 'side2' : 'side1';
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
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">
                {state.names[oppositeSide].teamA}
                <ColorIndicator color={state.colors.teamA} />
              </h2>
              <p>
                On the board:{' '}
                <button
                  className="btn btn-light"
                  onClick={() =>
                    state.ephemeralVolley
                      ? channel.send(
                          JSON.stringify(
                            updateVolley({
                              ...state.ephemeralVolley,
                              teamA: {
                                ...state.ephemeralVolley.teamA,
                                onBoard: Math.max(
                                  state.ephemeralVolley.teamA.onBoard - 1,
                                  0,
                                ),
                              },
                            }),
                          ),
                        )
                      : null
                  }
                >
                  -
                </button>{' '}
                {state.ephemeralVolley.teamA.onBoard}{' '}
                <button
                  className="btn btn-light"
                  onClick={() =>
                    state.ephemeralVolley
                      ? channel.send(
                          JSON.stringify(
                            updateVolley({
                              ...state.ephemeralVolley,
                              teamA: {
                                ...state.ephemeralVolley.teamA,
                                onBoard:
                                  state.ephemeralVolley.teamA.onBoard + 1,
                              },
                            }),
                          ),
                        )
                      : null
                  }
                >
                  +
                </button>
              </p>
              <p>
                In the hole:{' '}
                <button
                  className="btn btn-light"
                  onClick={() =>
                    state.ephemeralVolley
                      ? channel.send(
                          JSON.stringify(
                            updateVolley({
                              ...state.ephemeralVolley,
                              teamA: {
                                ...state.ephemeralVolley.teamA,
                                inHole: Math.max(
                                  state.ephemeralVolley.teamA.inHole - 1,
                                  0,
                                ),
                              },
                            }),
                          ),
                        )
                      : null
                  }
                >
                  -
                </button>{' '}
                {state.ephemeralVolley.teamA.inHole}{' '}
                <button
                  className="btn btn-light"
                  onClick={() =>
                    state.ephemeralVolley
                      ? channel.send(
                          JSON.stringify(
                            updateVolley({
                              ...state.ephemeralVolley,
                              teamA: {
                                ...state.ephemeralVolley.teamA,
                                inHole: state.ephemeralVolley.teamA.inHole + 1,
                              },
                            }),
                          ),
                        )
                      : null
                  }
                >
                  +
                </button>
              </p>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">
                {state.names[oppositeSide].teamB}
                <ColorIndicator color={state.colors.teamB} />
              </h2>
              <p>
                On the board:{' '}
                <button
                  className="btn btn-light"
                  onClick={() =>
                    state.ephemeralVolley
                      ? channel.send(
                          JSON.stringify(
                            updateVolley({
                              ...state.ephemeralVolley,
                              teamB: {
                                ...state.ephemeralVolley.teamB,
                                onBoard: Math.max(
                                  state.ephemeralVolley.teamB.onBoard - 1,
                                  0,
                                ),
                              },
                            }),
                          ),
                        )
                      : null
                  }
                >
                  -
                </button>{' '}
                {state.ephemeralVolley.teamB.onBoard}{' '}
                <button
                  className="btn btn-light"
                  onClick={() =>
                    state.ephemeralVolley
                      ? channel.send(
                          JSON.stringify(
                            updateVolley({
                              ...state.ephemeralVolley,
                              teamB: {
                                ...state.ephemeralVolley.teamB,
                                onBoard:
                                  state.ephemeralVolley.teamB.onBoard + 1,
                              },
                            }),
                          ),
                        )
                      : null
                  }
                >
                  +
                </button>
              </p>
              <p>
                In the hole:{' '}
                <button
                  className="btn btn-light"
                  onClick={() =>
                    state.ephemeralVolley
                      ? channel.send(
                          JSON.stringify(
                            updateVolley({
                              ...state.ephemeralVolley,
                              teamB: {
                                ...state.ephemeralVolley.teamB,
                                inHole: Math.max(
                                  state.ephemeralVolley.teamB.inHole - 1,
                                  0,
                                ),
                              },
                            }),
                          ),
                        )
                      : null
                  }
                >
                  -
                </button>{' '}
                {state.ephemeralVolley.teamB.inHole}{' '}
                <button
                  className="btn btn-light"
                  onClick={() =>
                    state.ephemeralVolley
                      ? channel.send(
                          JSON.stringify(
                            updateVolley({
                              ...state.ephemeralVolley,
                              teamB: {
                                ...state.ephemeralVolley.teamB,
                                inHole: state.ephemeralVolley.teamB.inHole + 1,
                              },
                            }),
                          ),
                        )
                      : null
                  }
                >
                  +
                </button>
              </p>
            </div>
          </div>
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
        </>
      )}
    </section>
  );
};

export default Controller;
