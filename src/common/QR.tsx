import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';

const QR: React.FC<{ data: string; alt: string; className?: string }> = ({
  data,
  alt,
  className,
}) => {
  const [dataUrl, setDataUrl] = useState<string>();
  useEffect(() => {
    QRCode.toDataURL(data).then(dataUrl => {
      setDataUrl(dataUrl);
    });
  }, [data]);
  return <img className={className} src={dataUrl} alt={alt} />;
};

export default QR;
