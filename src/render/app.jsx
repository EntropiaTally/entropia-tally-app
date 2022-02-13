import React, { useEffect, useState } from 'react';
import {
  MemoryRouter as Router,
  useNavigate,
  Routes,
  Route,
  NavLink,
} from 'react-router-dom';

import Hunting from './pages/hunting';
import Settings from './pages/settings';

const Nav = () => {
  const navigate = useNavigate();
  const [isDevelopment, setIsDevelopment] = useState(false);

  useEffect(() => {
    const removeGotoListener = window.api.on('goto', location => {
      navigate(`/${location}`);
    });

    window.api.get('development-mode').then(isDevelopmentMode => {
      setIsDevelopment(isDevelopmentMode);
    });

    return () => removeGotoListener();
  }, [navigate]);

  return (
    <nav className="navbar is-fixed-top top-menu">
      <div className="navbar-brand">
        <div className="navbar-item">
          {isDevelopment && (<small className="has-text-danger">DEV&nbsp;</small>)}Entropia Tally
        </div>
      </div>
      <div className="navbar-menu">
        <div className="navbar-start">
          <NavLink to="/" className="navbar-item">
            Hunting
          </NavLink>
        </div>
      </div>
      <div className="navbar-end">
        <NavLink to="/settings" className="navbar-item">
          <i className="ri-settings-4-fill" />
        </NavLink>
      </div>
    </nav>
  );
};

const App = () => (
  <Router>
    <div className="wrapper is-flex">
      <Nav />
      <Routes>
        <Route path="/settings" element={<Settings />} />
        <Route exact path="/" element={<Hunting />} />
      </Routes>
    </div>
  </Router>
);

export default App;
