import React, { useEffect, useState } from 'react';
import { Prompt, Link } from 'react-router-dom';
import apiFacade from './apiFacade';
import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css';
import jwt_decode from "jwt-decode";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Pagination from 'react-paginate';


export function Home() {
    return (
        <div>
            <div>
                <h2>Welcome!</h2>
                <hr></hr>
            </div>
            <div>
                <h5>How to use our API?</h5>
                    <ul>
                    <li>For all visitors of the website:</li>
                        <ul>
                            <li>The "Home" tab:</li>
                            <ul>
                                <li>This page!</li>
                            </ul>
                            <li>The "Address Info" tab:</li>
                            <ul>
                                <li>Enter an address and find the nearest postal box as well as a weather report from the city you entered.</li>
                            </ul>
                            <li>The "Login" tab:</li>
                            <ul>
                                <li>Login and gain access to more content!</li>
                            </ul>
                        </ul>

                        <br></br>

                        <li>If you're logged in (more content):</li>
                        <ul>
                            <li>As user:</li>
                            <ul>
                                <li>The "Movies" tab:</li>
                                <ul>
                                    <li>Enter a movie title, and get a corresponding review summary and a link to the full review from the New York Times.</li>
                                </ul>
                            </ul>
                            <li>As admin:</li>
                            <ul>
                                <li>The "Digital Ocean Info" tab:</li>
                                <ul>
                                    <li>Lookup information about the Droplets that the hoster has.</li>
                                </ul>
                            </ul>
                        </ul>

                    </ul>
            </div>
        </div>
    );
}

export function MySongs(){
    return (
        <div>
            <p>halløj</p>
        </div>
    )
}

export function AdminPage(){
    
    const [users, setUsers] = useState([]);

    function handleSubmit(event) {
        event.preventDefault();
        apiFacade.getAllUsers()
        .then(array => {
           setUsers(array)
        })
    }

    function handleDelete(username) {
        apiFacade.deleteUser(username)
        .then(updateUsers());
    }

    function updateUsers() {
        apiFacade.getAllUsers()
        .then(array => {
           setUsers(array)
           
        })
    }
    
    var displayUsers = users.map((user) => (
        <li key={user.username}>Username: {user.username} <br/>
        <button className="btn btn-black btnBorder" onClick={() => handleDelete(user.username)}>Delete</button></li>

    )) 

    return (
        <div>
            <h2> All Users</h2>
             <button className="btn btn-black btnBorder" onClick={handleSubmit}>Get Users</button>
             <p>{displayUsers}</p>
             <Pagination count={10} />
        </div>
    )
}

export function BookmarkSong({trackName, artistName, releaseDate, collectionName, bookmark}) {
    const song = trackName;
    const artist = artistName;
    const album = collectionName;

    function bookmarkSong(event) {
        event.preventDefault();
        bookmark(song, artist, album);
    }

    return (
        <div>
            <button className="btn btn-black btnBorder" onClick={bookmarkSong}>Load</button>
        </div>
    )
}

export function SongLookup({bookmark}) {

    const init = { song: "", artist: "" };
    const [search, setSearch] = useState(init);
    const [itunes, setItunes] = useState([]);
    const [lyrics, setLyrics] = useState('');
    const [similar, setSimilar] = useState([]);

    const printItunes = itunes.map((song, index) => (
        <div key={index}>
            <p><b>Song Name:</b> {song.trackName}</p>
            <p><b>Artist Name:</b> {song.artistName}</p>
            <p><b>Release Date:</b> {song.releaseDate}</p>
            <p><b>Price:</b> {song.trackPrice}</p>
            <p><b>Country:</b> {song.country}</p>
            <p><b>Currency:</b> {song.currency}</p>
            <p><b>Collection Name:</b> {song.collectionName}</p>
            <hr/>
            <BookmarkSong bookmark={bookmark} trackName={song.trackName} artistName={song.artistName} releaseDate={song.releaseDate} collectionName={song.collectionName} />
        </div>
    ))

    const similarArtistData = similar.map((song, index) => (
        <div key={index}>
            <p><b>Similar artist:</b> {song.Name}</p>
            <p><b>Teaser:</b> {song.wTeaser}</p>
            <p><b>Wikipedia URL:</b> {song.wUrl}</p>
           
            <hr/>
        </div>
    ))

    const printLyrics = lyrics;

    function handleSubmit(event) {
        event.preventDefault();
        apiFacade.getSongInformation(search)
        .then(data => {
            setLyrics(data.lyrics.lyrics);
            setItunes(data.itunes.results);
            setSimilar(data.similar.Similar.Results);
        })
    }

    function handleChange(event) {
        setSearch({...search, [event.target.id]: event.target.value});
    };

    return (
        <div>
            <h2>Song Lookup</h2>
            <hr/>
            <div className="wrapper">
                <form onChange={handleChange}>
                    <div className="row">
                        <div className="one">
                            <p>Song title</p>
                            <input placeholder="Song title..." id="song" />
                        </div>
                        <div className="two">
                            <p>Song artist</p>
                            <input placeholder="Song artist..." id="artist" />
                        </div>
                    </div>
                    <div className="one">
                        <button type="button" onClick={handleSubmit} className="btn btn-black btnBorder">Go!</button>
                    </div>
                </form>
            </div>
                
            <hr/>
            <h3>Information received goes here...</h3>

            <Tabs>
                <TabList>
                    <Tab>iTunes Price</Tab>
                    <Tab>Song Lyrics</Tab>
                    <Tab>Similar Artist</Tab>
                </TabList>

                <TabPanel>
                    <div>
                        {printItunes}
                    </div>
                </TabPanel>
                <TabPanel>
                    <div>
                        {printLyrics}
                    </div>
                </TabPanel>
                <TabPanel>
                    <div>
                        {similarArtistData}
                    </div>
                </TabPanel>
            </Tabs>
        </div>
    )
}

export function Login({ login }) {

    const init = { username: "", password: "" };
    const [loginCredentials, setLoginCredentials] = useState(init);

    const performLogin = (evt) => {
        evt.preventDefault();
        login(loginCredentials.username, loginCredentials.password);
    }
    const onChange = (evt) => {
        setLoginCredentials({ ...loginCredentials, [evt.target.id]: evt.target.value })
    }
    return (
        <div>
            <h2>Login here</h2>
            <form onChange={onChange}>
                <input placeholder="Username" id="username" /> 
                <br/>
                <input placeholder="Password" id="password" />
                <br/>
                <button onClick={performLogin} type="button" className="btn btn-black btnBorder">Login</button>
            </form>
            
            <br/>
            <hr/>
            <h2>Don't have an account?</h2>
            <Link to={"/sign-up"}>
                <button type="button" className="btn btn-black btnBorder">Sign Up</button>
            </Link>
            <hr/>
        </div>
    )
}

export function Signup({signup}) {

    const init = { username: "", password: "", passwordCheck: ""};
    const [signUpAcc, setSignUp] = useState(init);

    const performSignup = (evt) => {
        evt.preventDefault();
        signup(signUpAcc.username, signUpAcc.password, signUpAcc.passwordCheck);
    }
    const onChange = (evt) => {
        setSignUp({ ...signUpAcc, [evt.target.id]: evt.target.value })
    }

    return (
        <div>
            <h2>Sign up</h2>
            <form onChange={onChange}>
                <input placeholder="Username" id="username" /> 
                <br/>
                <input placeholder="Password" id="password" />
                <br/>
                <input placeholder="Password Checked" id="passwordCheck" />
                <br/>
                <button onClick={performSignup} type="button" className="btn btn-black btnBorder">Signup</button>
            </form>
        </div>
    )

}

export function LoggedIn({username}) {

const  token = apiFacade.getToken();
const  decoded = jwt_decode(token); // jwt_decode is an external library
    return (
        <div>
            <h2>You are now logged in!</h2>
            <p>Welcome {username}, your role is: {decoded.roles}</p>
        </div>
    )
}


const Log = ({ value, replacer = null, space = 2 }) => (
    <pre>
        <code>{JSON.stringify(value, replacer, space)}</code>
    </pre>
)

export function NoMatch() {
    return (
        <div>
            <h2>Sorry, we couldn't find that page...</h2>
        </div>
    );
}