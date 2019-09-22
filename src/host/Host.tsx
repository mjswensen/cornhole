import React from 'react';
import useConnection from '../common/useConnection';
import Setup from './Setup';

const Host: React.FC = () => {
  const [pc1, channel1, connected1] = useConnection();
  const [pc2, channel2, connected2] = useConnection();

  return (
    <Setup
      pc1={pc1}
      pc2={pc2}
      connected1={connected1}
      connected2={connected2}
    />
  );
};

export default Host;
