import React from 'react';
import QRLink from './QRLink';

const OfferLink: React.FC<{
  pc: RTCPeerConnection;
  offerUrl: string;
  title: string;
}> = ({ pc, offerUrl, title }) => {
  return (
    <div className="card bg-light">
      <QRLink url={offerUrl} />
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        <p>Paste answer here:</p>
        <textarea
          className="form-control"
          onChange={evt => {
            const answer = JSON.parse(atob(evt.target.value));
            pc.setRemoteDescription(answer);
          }}
        ></textarea>
      </div>
    </div>
  );
};

export default OfferLink;
