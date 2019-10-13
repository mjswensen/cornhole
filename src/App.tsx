import React from 'react';
import { HashRouter, Route } from 'react-router-dom';
import Host from './host/Host';
import Side from './side/Side';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Route exact path="/" component={Host} />
      <Route path="/player/:side/:channelId/:offer" component={Side} />
    </HashRouter>
  );
};

export default App;
