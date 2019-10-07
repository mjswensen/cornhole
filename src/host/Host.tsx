import React from 'react';
import { useHostConnection } from '../common/useConnection';
import Setup from './Setup';
import Scoreboard from './Scoreboard';

const Host: React.FC = () => {
  const [pc1, channel1, connected1] = useHostConnection();
  const [pc2, channel2, connected2] = useHostConnection();

  const connected = connected1 && connected2;

  if (!connected) {
    return (
      <Setup
        pc1={pc1}
        pc2={pc2}
        connected1={connected1}
        connected2={connected2}
      />
    );
  } else {
    return <Scoreboard channel1={channel1} channel2={channel2} />;
  }
};

export default Host;
