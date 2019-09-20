import React from 'react';
import { HashRouter, Route } from 'react-router-dom';
import Host from './Host';
import Player from './Player';
import './App.css';

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="App">
        <Route exact path="/" component={Host} />
        <Route
          path="/player/:offer"
          render={({ match }) => <Player encodedOffer={match.params.offer} />}
        />
      </div>
    </HashRouter>
  );
};

export default App;
