import React from 'react';
import QRLink from './QRLink';

const OfferLink: React.FC<{
  pc: RTCPeerConnection;
  offerUrl: string;
  title: string;
}> = ({ pc, offerUrl, title }) => {
  return (
    <div className="rounded border border-gray-7 bg-gray-1">
      <QRLink url={offerUrl} />
      <div className="p-3">
        <h2 className="text-xl">{title}</h2>
        <p className="mt-2">Paste response code here:</p>
        <textarea
          className="bg-gray-0 mt-2 border border-gray-7 rounded w-full"
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
