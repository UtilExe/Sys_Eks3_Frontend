import React, { useEffect, useState } from 'react';
import { Prompt, Link } from 'react-router-dom';
import apiFacade from './apiFacade';
import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css';
import jwt_decode from "jwt-decode";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Pagination from 'react-paginate';
import Grid from '@material-ui/core/Grid';
import AudiotrackIcon from '@material-ui/icons/Audiotrack';
import AlbumIcon from '@material-ui/icons/Album';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';


import Modal from 'react-modal';

export function Home() {
    return (
        <div>
            <div>
                <h2>Welcome!</h2>
                <hr className="ownHr"></hr>
            </div>
            <div class="list-group">
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

    let displayUsers = users.map((user) => (
        <ul className="list-group">
      <li className="list-group-item list-group-test">
      <div className="btn-toolbar">
      <ul key={user.username}>Username: {user.username} <br/>
        <button className="btn btn-black btnBorder btn-sm mr-2" onClick={() => handleDelete(user.username)}>Delete</button> 
         <button className="btn btn-black btnBorder btn-sm mr-2" onClick={() => openModal(user.username)}>Edit </button> 
        </ul>
        </div>
        </li>
        </ul>
    ))

    Modal.setAppElement('#root')
    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            background: "#1b103a"
        }
    };

    const [username, setName] = useState('');
    const [editedPassword, setEditedPassword] = useState('');
    const [editMsg, setEditMsg] = useState("");
    const editStyleColor = <p className="sucsMsg">{editMsg}</p>

    function openModal(username) {
        setIsOpen(true);
        setName(username);
    }

    var subtitle;
    const [modalIsOpen, setIsOpen] = useState(false);

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
        subtitle.style.color = '#FFFFFF';
    }

    function closeModal(username) {
        setIsOpen(false);
    }

    function editUserSubmit(event) {
        event.preventDefault();
        apiFacade.editUser(username, editedPassword)
        .then(res => {
            closeModal();
            setEditMsg("The password has been updated!");
          })
    }

    function handleEditChange(event) {
        setEditedPassword(event.target.value);
    };

    function modalShow() {
        return (
            <div>
                <Modal
                    isOpen={modalIsOpen}
                    onAfterOpen={afterOpenModal}
                    onRequestClose={closeModal}
                    style={customStyles}
                    contentLabel="Example Modal">

                    <h2 ref={_subtitle => (subtitle = _subtitle)}>Edit {username}</h2>
                    <form onChange={handleEditChange}>
                        <div>
                            <input placeholder="Edit password..." id="editPassword" type="password"/>
                        </div>
                        <div>
                            <button onClick={editUserSubmit} className="btn btn-black btnBorder">Submit</button>
                            <button onClick={closeModal} className="btn btn-black btnBorder btnBorderTwo">Close</button>
                        </div>
                    </form>
                </Modal>
            </div>
        )
    }

    return (
        <div>
            <h2> All Users</h2>
            <hr className="ownHr"/>
            <button className="btn btn-black btnBorder" onClick={handleSubmit}>Get Users</button> <br/> <br/>
            {displayUsers}
            <hr className="ownHr"/>
            {editStyleColor}
            <Pagination count={10} variant="outlined" />
            {modalShow()}
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