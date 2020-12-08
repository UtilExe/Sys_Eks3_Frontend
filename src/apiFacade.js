import URLS, {servicepointsURL, movieReviewURL, digitaloceanURL, loginURL, signUpURL, songLookupURL, songBookmarkURL, getUsersURL, deleteUsersURL, getSongURL, editUserURL} from './Settings';

function getServicePoints(address) {
    const options = makeOptions("POST", true, address);
    return fetch(servicepointsURL, options)
        .then(handleHttpErrors);
}

function getMovieReviews(query) {
    const options = makeOptions("POST", true, {query});
    console.log(options);
    return fetch(movieReviewURL, options)
        .then(handleHttpErrors);
}

function getDigitalOceanInfo() {
    const options = makeOptions("GET", true);
    return fetch (digitaloceanURL, options)
        .then(handleHttpErrors);
}

function getSongInformation(songInput) {
    const options = makeOptions("POST", true, songInput);
    return fetch(songLookupURL, options)
        .then(handleHttpErrors);
}

function deleteUser(username) {
    const options = makeOptions("POST", true, {username: username});
    return fetch (deleteUsersURL, options)
    .then(handleHttpErrors)
}

function bookmarkSong(song, artist, album) {
    const options = makeOptions("POST", true, {song: song, artist: artist, album: album});
    return fetch(songBookmarkURL, options)
        .then(handleHttpErrors);
}

function editUser(username, editedPassword) {
    const options = makeOptions("PUT", true, {username: username, editedPassword: editedPassword});
    return fetch (editUserURL, options)
    .then(handleHttpErrors)
}

function getAllUsers() {
    const options = makeOptions("GET", true);
    return fetch (getUsersURL, options)
    .then(handleHttpErrors);
}

function getAllSongs() {
    const options = makeOptions("GET", true);
    return fetch (getSongURL, options)
    .then(handleHttpErrors);
}

const setToken = (token) => {
    localStorage.setItem('jwtToken', token)
}
const getToken = () => {
    return localStorage.getItem('jwtToken')
}
const loggedIn = () => {
    const loggedIn = getToken() != null;
    return loggedIn;
}
const logout = () => {
    localStorage.removeItem("jwtToken");
}

const login = (user, password) => {
    const options = makeOptions("POST", true, { username: user, password: password });
    return fetch(loginURL, options)
        .then(handleHttpErrors)
        .then(res => { setToken(res.token) })
}

const signup = (user, password, passwordCheck) => {
    const options = makeOptions("POST", true, { username: user, password: password, passwordCheck: passwordCheck });
    return fetch(signUpURL, options)
        .then(handleHttpErrors);
}

const apiFacade = {
    getServicePoints,
    getMovieReviews,
    getDigitalOceanInfo,
    getSongInformation,
    bookmarkSong,
    setToken,
    getToken,
    loggedIn,
    logout,
    login,
    signup,
    getAllUsers,
    deleteUser,
    getAllSongs,
    editUser
}

function makeOptions(method, addToken, body) {
    var opts = {
        method: method,
        headers: {
            "Content-type": "application/json",
            'Accept': 'application/json',
        }
    }
    if (addToken && loggedIn()) {
        opts.headers["x-access-token"] = getToken();
    }
    if (body) {
        opts.body = JSON.stringify(body);
    }
    return opts;
}

function handleHttpErrors(res) {
    if (!res.ok) {
        return Promise.reject({ status: res.status, fullError: res.json() })
    }
    return res.json();
}

export default apiFacade;