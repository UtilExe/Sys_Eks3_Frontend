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
  SongLookup,
  AdminPage,
  SavedSongs
} from './Components';
import apiFacade from './apiFacade';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';


function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState('');
  const [username, setUserName] = useState("");
  const [signUpMsg, setSignUpMsg] = useState("");
  const [savedSongs, setSavedSongs] = useState([]);
  const [isSignedUp, setIsSignedUp] = useState("");

  const logout = () => {
    apiFacade.logout()
    setLoggedIn(false)
  }

  const login = (user, pass) => {
    setError("");
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
        setSignUpMsg("Your account has been created!");
        setIsSignedUp(true);
      })
      .catch(err => {
        setIsSignedUp(false);
        setSignUpMsg("Couldn't register, please try again later.");
        console.log(err);
        Promise.resolve(err.fullError).then(function(value) {
          setSignUpMsg(value.message);
        })
      })
  }

  const bookmark = (name, artist, album) => {
    apiFacade.bookmarkSong(name, artist, album)
      .then(res => {
        setSavedSongs(res);
        console.log("Song successfully saved!", res)
      })
      .catch(err => {
        console.log(err);
      })
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="lg">
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
                <SongLookup bookmark={bookmark} />
              </Route>

              <Route path="/admin-page">
                <AdminPage />
              </Route>

              <Route path="/my-songs">
                <SavedSongs savedSongs={savedSongs} />
              </Route>

              <Route path="/sign-up">
                <Signup signup={signup} />
                { !isSignedUp ? (<p className="errMsg">{signUpMsg}</p>) :
                  (<p className="sucsMsg">{signUpMsg}</p>)}
              </Route>

              <Route path="/login-out">
                <div>
                  {!loggedIn ? (<Login login={login} />) :
                  (<div>
                    <LoggedIn username={username}/>
                    <button onClick={logout} className="btn btn-black btnBorder">Logout</button>
                  </div>)}
                  <p className="errMsg">{error}</p>
                </div>
              </Route>

              <Route component={NoMatch}></Route>

            </Switch>
          </div>
        </Router>
      </Container>
    </React.Fragment>
  );
}

function Header({ isLoggedIn, loginMsg }) {
  return (
    <ul className="header">
      <li><NavLink exact activeClassName="active" to="/">Home</NavLink></li>
      {
        isLoggedIn &&
        (
          <React.Fragment>
            <li><NavLink activeClassName="active" to="/song-lookup">Song Lookup</NavLink></li>
            <li><NavLink exact activeClassName="active" to="/my-songs">My Songs</NavLink></li>
            <li><NavLink exact activeClassName="active" to="/admin-page">Admin Page</NavLink></li>
          </React.Fragment>
        )
      }
      <li><NavLink activeClassName="active" to="/login-out">{loginMsg}</NavLink></li>
    </ul>
  );
}

export default App;
