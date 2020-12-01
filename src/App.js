import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  NavLink,
  useParams,
  useRouteMatch,
  Prompt,
} from "react-router-dom";
import React, { useState } from 'react';
import {
  Home,
  NoMatch,
  Login,
  Signup,
  LoggedIn,
  Address,
  Movies,
  DigitalOcean,
  SongLookup
} from './Components';
import apiFacade from './apiFacade';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState('');
  const [username, setUserName] = useState("");
  const [signUpMsg, setSignUpMsg] = useState("");

  const logout = () => {
    apiFacade.logout()
    setLoggedIn(false)
  }

  const login = (user, pass) => {
    setUserName(user);
    apiFacade.login(user, pass)
      .then(res => {
        setLoggedIn(true)
        setError('');
      })
      .catch(err => {
        setError("Couldn't log you in, see error in console for further information");
        console.log(err);
      })
  }

  const signup = (user, pass, passChecked) => {
    apiFacade.signup(user, pass, passChecked)
      .then(res => {
        setError('');
        setSignUpMsg("Works!");
      })
      .catch(err => {
        setError("Couldn't register, see error in console for further information");
        console.log(err);
        Promise.resolve(err.fullError).then(function(value) {
          setSignUpMsg(value.message);
        })
      })
  }

  return (
    <Router>
      <div>
        <Header
          loginMsg={loggedIn ? "Logout" : "Login"}
          isLoggedIn={loggedIn}
        />
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/song-lookup">
            <SongLookup />
          </Route>
          <Route path="/address-info">
           <Address />
           </Route>
          <Route path="/sign-up">
           <Signup signup={signup} />
           <br/>
          {signUpMsg}
           </Route>
          <Route path="/movie-reviews">
           <Movies />
          </Route>
          <Route path ="/digitalocean-info">
            <DigitalOcean />
          </Route>
          <Route path="/login-out">
          <div>
            {!loggedIn ? (<Login login={login} />) :
            (<div>
              <LoggedIn username={username}/>
              <button onClick={logout} className="btn btn-black btnBorder">Logout</button>
            </div>)}
            {error}
          </div>
         
          </Route>
          <Route component={NoMatch}></Route>
        </Switch>
      </div>
    </Router>
  );
}

function Header({ isLoggedIn, loginMsg }) {
  return (
    <ul className="header">
      <li><NavLink exact activeClassName="active" to="/">Home</NavLink></li>
      <li><NavLink activeClassName="active" to="/song-lookup">Song Lookup</NavLink></li>
      {
        isLoggedIn &&
        (
          <React.Fragment>
            <li><NavLink activeClassName="active" to="/movie-reviews">Movies</NavLink></li>
            <li><NavLink activeClassName="active" to="/digitalocean-info">Digital Ocean Info</NavLink></li>
          </React.Fragment>
        )
      }
      <li><NavLink activeClassName="active" to="/login-out">{loginMsg}</NavLink></li>
    </ul>
  );
}

export default App;
