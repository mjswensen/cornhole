import React from 'react';
import QRLink from './QRLink';

const OfferLink: React.FC<{
  pc: RTCPeerConnection;
  offerUrl: string;
  title: string;
}> = ({ pc, offerUrl, title }) => {
  return (
    <div className="ui form">
      <h2>{title}</h2>
      <QRLink url={offerUrl} />
      <p>Paste answer here:</p>
      <textarea
        onChange={evt => {
          const answer = JSON.parse(atob(evt.target.value));
          pc.setRemoteDescription(answer);
        }}
      ></textarea>
    </div>
  );
};

export default OfferLink;
