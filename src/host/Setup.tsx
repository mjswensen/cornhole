import React, { useState } from 'react';
import ColorPicker, { Color } from './ColorPicker';
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

function descriptionUrl(description: RTCSessionDescription | null): string {
  return `${window.location.origin}/#/player/${btoa(
    JSON.stringify(description),
  )}`;
}

const Setup: React.FC<{
  pc1: RTCPeerConnection;
  pc2: RTCPeerConnection;
  connected1: boolean;
  connected2: boolean;
}> = ({ pc1, pc2, connected1, connected2 }) => {
  const [initializing, setInitializing] = useState(false);
  const [offerUrl1, setOfferUrl1] = useState<string>();
  const [offerUrl2, setOfferUrl2] = useState<string>();
  const [teamAColor, setTeamAColor] = useState<Color>(Color.BLUE);
  const [teamBColor, setTeamBColor] = useState<Color>(Color.GREY);
  const [player1AName, setPlayer1AName] = useState<string>('');
  const [player2AName, setPlayer2AName] = useState<string>('');
  const [player1BName, setPlayer1BName] = useState<string>('');
  const [player2BName, setPlayer2BName] = useState<string>('');

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
                <ColorPicker value={teamAColor} onChange={setTeamAColor} />
              </td>
              <td>
                <div className="ui labeled input">
                  <span className={`ui ${teamAColor} label`}></span>
                  <input
                    type="text"
                    placeholder="Player name..."
                    value={player1AName}
                    onChange={evt => setPlayer1AName(evt.target.value)}
                  />
                </div>
              </td>
              <td>
                <div className="ui labeled input">
                  <span className={`ui ${teamAColor} label`}></span>
                  <input
                    type="text"
                    placeholder="Player name..."
                    value={player2AName}
                    onChange={evt => setPlayer2AName(evt.target.value)}
                  />
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <ColorPicker value={teamBColor} onChange={setTeamBColor} />
              </td>
              <td>
                <div className="ui labeled input">
                  <span className={`ui ${teamBColor} label`}></span>
                  <input
                    type="text"
                    placeholder="Player name..."
                    value={player1BName}
                    onChange={evt => setPlayer1BName(evt.target.value)}
                  />
                </div>
              </td>
              <td>
                <div className="ui labeled input">
                  <span className={`ui ${teamBColor} label`}></span>
                  <input
                    type="text"
                    placeholder="Player name..."
                    value={player2BName}
                    onChange={evt => setPlayer2BName(evt.target.value)}
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
            init(pc1).then(desc => setOfferUrl1(descriptionUrl(desc)));
            init(pc2).then(desc => setOfferUrl2(descriptionUrl(desc)));
            setInitializing(true);
          }}
        >
          Start game
        </button>
      </section>
    );
  } else {
    return (
      <section>
        {offerUrl1 &&
          (connected1 ? (
            'Side 1 connected!'
          ) : (
            <OfferLink pc={pc1} offerUrl={offerUrl1} title="Side 1" />
          ))}
        {offerUrl2 &&
          (connected2 ? (
            'Side 2 connected!'
          ) : (
            <OfferLink pc={pc2} offerUrl={offerUrl2} title="Side 2" />
          ))}
      </section>
    );
  }
};

export default Setup;
