import React, { useState } from 'react';
import {
  Side,
  State,
  Action,
  setTeamColor,
  setPlayerName,
} from '../common/state';
import ColorPicker from './ColorPicker';
import OfferLink from './OfferLink';

async function init(
  pc: RTCPeerConnection,
): Promise<RTCSessionDescription | null> {
  const ICE_GATHERING_TIMEOUT = 2000;

  const iceGatheringComplete = new Promise(resolve => {
    pc.addEventListener('icegatheringstatechange', () => {
      if (pc.iceGatheringState === 'complete') {
        resolve();
      }
    });
  });

  const iceGatheringTimeout = new Promise(resolve => {
    setTimeout(() => resolve(), ICE_GATHERING_TIMEOUT);
  });

  const signalingStatusComplete = new Promise(resolve => {
    pc.addEventListener('signalingstatechange', () => {
      if (pc.signalingState === 'have-local-offer') {
        resolve();
      }
    });
  });

  pc.createOffer().then(offer => {
    pc.setLocalDescription(offer);
  });

  await Promise.all([
    Promise.race([iceGatheringComplete, iceGatheringTimeout]),
    signalingStatusComplete,
  ]);

  return pc.localDescription;
}

function descriptionUrl(
  side: Side,
  channel: RTCDataChannel,
  description: RTCSessionDescription | null,
): string {
  return `${window.location.origin}/#/player/${side}/${channel.id}/${btoa(
    JSON.stringify(description),
  )}`;
}

const Setup: React.FC<{
  pc1: RTCPeerConnection;
  pc2: RTCPeerConnection;
  channel1: RTCDataChannel;
  channel2: RTCDataChannel;
  connected1: boolean;
  connected2: boolean;
  state: State;
  dispatch: React.Dispatch<Action>;
}> = ({
  pc1,
  pc2,
  channel1,
  channel2,
  connected1,
  connected2,
  state,
  dispatch,
}) => {
  const [initializing, setInitializing] = useState(false);
  const [offerUrl1, setOfferUrl1] = useState<string>();
  const [offerUrl2, setOfferUrl2] = useState<string>();

  const initialized = !!offerUrl1 && !!offerUrl2;
  if (!initialized) {
    return (
      <section className="ui center aligned text container">
        <h1 className="ui center aligned icon header">
          <i className="circular target icon"></i>
          Cornhole
        </h1>
        <table className="ui very basic collapsing celled table">
          <thead>
            <tr>
              <th></th>
              <th>Side 1</th>
              <th>Side 2</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <ColorPicker
                  value={state.colors.teamA}
                  onChange={color => dispatch(setTeamColor('teamA', color))}
                />
              </td>
              <td>
                <div className="ui labeled input">
                  <span className={`ui ${state.colors.teamA} label`}></span>
                  <input
                    type="text"
                    placeholder="Player name..."
                    value={state.names.side1.teamA}
                    onChange={evt =>
                      dispatch(
                        setPlayerName('side1', 'teamA', evt.target.value),
                      )
                    }
                  />
                </div>
              </td>
              <td>
                <div className="ui labeled input">
                  <span className={`ui ${state.colors.teamA} label`}></span>
                  <input
                    type="text"
                    placeholder="Player name..."
                    value={state.names.side2.teamA}
                    onChange={evt =>
                      dispatch(
                        setPlayerName('side2', 'teamA', evt.target.value),
                      )
                    }
                  />
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <ColorPicker
                  value={state.colors.teamB}
                  onChange={color => dispatch(setTeamColor('teamB', color))}
                />
              </td>
              <td>
                <div className="ui labeled input">
                  <span className={`ui ${state.colors.teamB} label`}></span>
                  <input
                    type="text"
                    placeholder="Player name..."
                    value={state.names.side1.teamB}
                    onChange={evt =>
                      dispatch(
                        setPlayerName('side1', 'teamB', evt.target.value),
                      )
                    }
                  />
                </div>
              </td>
              <td>
                <div className="ui labeled input">
                  <span className={`ui ${state.colors.teamB} label`}></span>
                  <input
                    type="text"
                    placeholder="Player name..."
                    value={state.names.side2.teamB}
                    onChange={evt =>
                      dispatch(
                        setPlayerName('side2', 'teamB', evt.target.value),
                      )
                    }
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <button
          className={`massive primary ui ${
            initializing ? 'loading' : ''
          } button`}
          disabled={initializing}
          onClick={() => {
            init(pc1).then(desc =>
              setOfferUrl1(descriptionUrl('side1', channel1, desc)),
            );
            init(pc2).then(desc =>
              setOfferUrl2(descriptionUrl('side2', channel2, desc)),
            );
            setInitializing(true);
          }}
        >
          Start game
        </button>
      </section>
    );
  } else {
    return (
      <section className="ui two column stackable grid">
        <div className="ui vertical divider"></div>
        <div className="middle aligned row">
          {offerUrl1 &&
            (connected1 ? (
              <div className="column">
                <div className="ui success icon message">
                  <i className="check icon"></i>
                  <div className="content">
                    <div className="header">Side 1 connected!</div>
                    <p>
                      {state.names.side1.teamA} and {state.names.side1.teamB}{' '}
                      are ready.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="center aligned column">
                <OfferLink pc={pc1} offerUrl={offerUrl1} title="Side 1" />
              </div>
            ))}
          {offerUrl2 &&
            (connected2 ? (
              <div className="column">
                <div className="ui success icon message">
                  <i className="check icon"></i>
                  <div className="content">
                    <div className="header">Side 2 connected!</div>
                    <p>
                      {state.names.side2.teamA} and {state.names.side2.teamB}{' '}
                      are ready.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="center aligned column">
                <OfferLink pc={pc2} offerUrl={offerUrl2} title="Side 2" />
              </div>
            ))}
        </div>
      </section>
    );
  }
};

export default Setup;
