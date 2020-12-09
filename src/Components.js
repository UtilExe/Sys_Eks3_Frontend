import React, { useEffect, useState } from 'react';
import { Prompt, Link } from 'react-router-dom';
import apiFacade from './apiFacade';
import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css';
import jwt_decode from "jwt-decode";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Pagination from './Test/Pagination';
import Grid from '@material-ui/core/Grid';
import AudiotrackIcon from '@material-ui/icons/Audiotrack';
import AlbumIcon from '@material-ui/icons/Album';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import Users from './Test/Users';
import Modal from 'react-modal';

export function Home() {
    return (
        <div>
            <div>
                <h2>Welcome!</h2>
                <hr className="ownHr"></hr>
            </div>
            <div className="list-group">
                <h5>How to use our API?</h5>
                <ol>
                    <li>Login.</li>
                    <li>Go to 'Song Lookup'.</li>
                    <li>Enter a song title and artist name.</li>
                    <li>Get the price, lyrics, and a similar artist.</li>
                    <li>Save all the songs you like to your account.</li>
                </ol>
                <h5>You're done!</h5>
            </div>
        </div>
    );
}



export function SavedSongs({ savedSongs }) {

    const { song, artist, album } = savedSongs;
    const [songs, setSongs] = useState([]);
    const [error, setError] = useState('');


    function handleSubmit(event) {
        event.preventDefault();
        apiFacade.getAllSongs()
            .then(array => {
                setSongs(array)
            })
            .catch(err => {
                Promise.resolve(err.fullError).then(function (value) {
                    setError(value.message);
                })
            })
    }

    let displaySongs = songs.map((songA) => (
        <ul className="list-group mb-4" key={songA.song}>
            <Grid container spacing={0}>
                <Grid item xs={3}>
                    <li className="list-group-item ownList">
                        <div className="mb-1">
                            <PeopleAltIcon /> {songA.artist}
                        </div>
                        <div className="mb-1">
                            <AudiotrackIcon/> {songA.song}
                        </div>
                        <div className="mb-1">
                            <AlbumIcon /> {songA.album}
                        </div>
                    </li>
                </Grid>
            </Grid>
        </ul>
    ))

    return (
        <div>
            <h2> All Songs</h2>
            <hr className="ownHr"/>
            <button className="btn btn-black btnBorder btnSongs" onClick={handleSubmit}>Get Songs</button>
            <br />
            <br />
            {displaySongs}
            <hr className="ownHr"/>
            {error}
        </div>
    )
}



export function AdminPage() {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage, setUsersPerPage] = useState(5);


    function handleSubmit(event) {
        event.preventDefault();
        apiFacade.getAllUsers()
            .then(array => {
                setUsers(array)
            })
    }

    function handleDelete(username) {
        apiFacade.deleteUser(username)
            .then(updateUsers);
    }

    function updateUsers() {
        apiFacade.getAllUsers()
            .then(array => {
                setUsers(array)
            })
    }

    // Get current page posts
    const indexOfLastPost = currentPage * usersPerPage;
    const indexOfFirstPost = indexOfLastPost - usersPerPage;
    const currentUsers = users.slice(indexOfFirstPost, indexOfLastPost);

    const paginate = pageNumber => setCurrentPage(pageNumber)

    return (
        <div>
            <h2> All Users</h2>
            <hr className="ownHr"/>
            <button className="btn btn-black btnBorder" onClick={handleSubmit}>Get Users</button> <br/> <br/>
            <hr className="ownHr"/>
            <Users users={currentUsers} loading={loading} handleDelete={handleDelete} />
            <Pagination 
            usersPerPage={usersPerPage} 
            totalUsers={users.length} 
            paginate={paginate} />
        </div>
    )
}



export function BookmarkSong({ trackName, artistName, releaseDate, collectionName, bookmark }) {
    const song = trackName;
    const artist = artistName;
    const album = collectionName;

    function bookmarkSong(event) {
        event.preventDefault();
        bookmark(song, artist, album);
    }

    return (
        <div>
            <button className="btn btn-black btnBorder" onClick={bookmarkSong}>Save Song</button>
        </div>
    )
}



export function SongLookup({ bookmark }) {

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
            <hr className="ownHr" />
            <BookmarkSong bookmark={bookmark} trackName={song.trackName} artistName={song.artistName} releaseDate={song.releaseDate} collectionName={song.collectionName} />
        </div>
    ))

    const similarArtistData = similar.map((song, index) => (
        <div key={index}>
            <p><b>Similar artist:</b> {song.Name}</p>
            <p><b>Teaser:</b> {song.wTeaser}</p>
            <p><b>Wikipedia URL:</b> {song.wUrl}</p>

            <hr className="ownHr" />
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
        setSearch({ ...search, [event.target.id]: event.target.value });
    };

    return (
        <React.Fragment>
            <div>
                <h2>Song Lookup</h2>
                <hr className="ownHr"/>
                <form onChange={handleChange}>
                    
                    <div>
                        
                            <Grid item xs={2} className="mb-2">
                                <input className="form-control ownInputs" id="song" placeholder="Song title" />
                            </Grid>
                        
                            <Grid item xs={2} className="mb-2">
                                <input className="form-control ownInputs" id="artist" placeholder="Song artist..." />
                            </Grid>

                            <Grid item xs={2} className="mb-2">
                                <button type="button" onClick={handleSubmit} className="btn btn-black btnBorder">Go!</button>
                            </Grid>

                            <Grid item xs={6}></Grid>
                        
                    </div>

                </form>

            </div>
                
            <div>

                <Tabs>
                    <TabList>
                        <div className="d-flex justify-content-center">
                            <Tab>iTunes Price</Tab>
                            <Tab>Song Lyrics</Tab>
                            <Tab>Similar Artist</Tab>
                        </div>
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
        </React.Fragment>
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
                    <Grid item xs={2} className="mb-2">
                        <input className="form-control ownInputs" placeholder="Username" id="username" />
                    </Grid>

                    <Grid item xs={2} className="mb-2">
                        <input type="password" className="form-control ownInputs" placeholder="Password" id="password" />
                    </Grid>
                    
                    <button onClick={performLogin} type="button" className="btn btn-black btnBorder">Login</button>
            </form>

            <br />
            <hr className="ownHr" />
            <h2>Don't have an account?</h2>
            <Link to={"/sign-up"}>
                <button type="button" className="btn btn-black btnBorder">Sign Up</button>
            </Link>
            <hr className="ownHr" />
        </div>
    )
}



export function Signup({ signup }) {

    const init = { username: "", password: "", passwordCheck: "" };
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
            <hr className="ownHr" />
            <form onChange={onChange}>
                    <Grid item xs={2} className="mb-2">
                        <input className="form-control ownInputs" placeholder="Username..." id="username" />
                    </Grid>
                    <Grid item xs={2} className="mb-2">
                        <input type="password" className="form-control ownInputs" placeholder="Password..." id="password" />
                    </Grid>

                    <Grid item xs={2} className="mb-2">
                        <input type="password" className="form-control ownInputs" placeholder="Re-enter password..." id="passwordCheck" />
                    </Grid>

                    <Grid item xs={2} className="mb-2">
                        <button onClick={performSignup} type="button" className="btn btn-black btnBorder">Signup</button>
                    </Grid>
            </form>
            <hr className="ownHr" />
        </div>
    )

}



export function LoggedIn({ username }) {

    const token = apiFacade.getToken();
    const decoded = jwt_decode(token); // jwt_decode is an external library
    username = decoded.username;
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