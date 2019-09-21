import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';

const QRLink: React.FC<{ url: string }> = ({ url }) => {
  const [dataUrl, setDataUrl] = useState<string>();
  useEffect(() => {
    QRCode.toDataURL(url).then(dataUrl => {
      setDataUrl(dataUrl);
    });
  }, [url]);
  return dataUrl ? (
    <a href={url} target="_blank" rel="noopener noreferrer">
      <img src={dataUrl} alt="Join game" />
    </a>
  ) : null;
};

export default QRLink;
