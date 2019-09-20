import React from 'react';
import { HashRouter, Route } from 'react-router-dom';
import Host from './Host';
import './App.css';

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="App">
        <Route exact path="/" component={() => <Host />} />
        <Route path="/player" component={() => <p>Player!</p>} />
      </div>
    </HashRouter>
  );
};

export default App;
