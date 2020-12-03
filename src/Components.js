import React, { useEffect, useState } from 'react';
import { Prompt, Link } from 'react-router-dom';
import apiFacade from './apiFacade';
import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css';
import jwt_decode from "jwt-decode";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';


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

export function SongLookup() {

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
        </div>
    ))

    console.log(similar)
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

    console.log("test", similar)
    const printSimiliar = similar.Info;

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

export function DigitalOcean() {

    const [droplets, setDroplets] = useState([]);
    const display = droplets.map((droplet, index) => {
        const network = droplet.networks.v4[0];
        return (
            <React.Fragment>
                <tr>
                    <th>Droplet Name</th>
                    <td>{droplet.name}</td>
                </tr>
                <tr>
                    <th>Created At</th>
                    <td>{droplet.created_at}</td>
                </tr>
                <tr>
                    <th>Memory</th>
                    <td>{droplet.memory} MB</td>
                </tr>
                <tr>
                    <th>Status</th>
                    <td>{droplet.status}</td>
                </tr>
                <tr>
                    <th>Location</th>
                    <td>{droplet.region.name}</td>
                </tr>
                <tr>
                    <th>Monthly price</th>
                    <td>${droplet.size.price_monthly}</td>
                </tr>
                <tr>
                    <th>Gateway</th>
                    <td>{network.gateway}</td>
                </tr>
                <tr>
                    <th>IP Address</th>
                    <td>{network.ip_address}</td>
                </tr>
                <tr>
                    <th>Netmask</th>
                    <td>{network.netmask}</td>
                </tr>
            </React.Fragment>
        )
    })
    
    useEffect (() => {
               apiFacade.getDigitalOceanInfo()
               .then(data => setDroplets(data.droplets))
    }, [])


    return (
        <div>
            <Table striped bordered hover>
                {display}
            </Table>
        </div>
    )
}

export function Movies() {

    const [movieSearchWord, setMovieSearchWord] = useState("");
    const [movieArray, setMovieArray] = useState([]);

    const handleSubmit = event => {
        event.preventDefault();
        apiFacade.getMovieReviews(movieSearchWord)
        .then(data => {
            const array = data.results;
            setMovieArray(array);
        })
      };


      const allMovies = movieArray.map((movie, index)=> (
        <div>
            <ul key={index+1}>
                <li>{movie.display_title} - <a href={movie.link.url}>Details</a></li>
                <p>Review Summary: {movie.summary_short}</p>
            </ul>
            <hr></hr>
        </div>
        )
    );

    return (
        <div>
            <div>
                <input placeholder="Enter movie title" onChange={(event) => setMovieSearchWord(event.target.value)}/>
                <button onClick={handleSubmit}>Submit</button>
            </div>
            <br></br>
            <div>
                {allMovies}
            </div>
        </div>
    );
}

export function Address() {
    const initialWeather = {
        Sunrise: "",
        Sunset: "",
        Datetime: "",
        Cityname: "",
        Temperature: "",
        ApparentTemperature: "",
        Description: ""
      }
      const [weather, setWeather] = useState(initialWeather);
    
      const initialValue = {
        city: "",
        postalCode: "",
        streetName: "",
        streetNumber: ""
      }
    
      const [address, setAddress] = useState(initialValue);
      const [servicePoints, setServicePoints] = useState([]);
      let [isBlocking, setIsBlocking] = useState(false);
    
      const handleChange = event => {
        const { id, value } = event.target;
        setIsBlocking(event.target.value.length > 0);
        setAddress({ ...address, [id]: value })
      };
    
      const handleSubmit = event => {
        event.preventDefault();
        apiFacade.getServicePoints(address)
        .then(data => {
          const temp = data.weather.data[0];
          setServicePoints(data.postnord.servicePointInformationResponse.servicePoints);
          setWeather({
            Sunrise: temp.sunrise,
            Sunset: temp.sunset,
            Datetime: temp.datetime,
            Cityname: temp.city_name,
            Temperature: temp.temp,
            ApparentTemperature: temp.app_temp,
            Description: temp.weather.description
          })
        })
      };

      return (
          <div>
            <AddressInfo isBlocking={isBlocking} handleChange={handleChange} handleSubmit={handleSubmit} servicePoints={servicePoints} />
            <WeatherInfo weather={weather} />
          </div>
      )
}

export function AddressInfo({isBlocking, handleChange, handleSubmit, servicePoints }) {
    

    const allServicePoints = servicePoints.map(servicePoint => (
        <ul key={servicePoint.servicePointId}>
            <li>{servicePoint.servicePointId}</li>
            <li>{servicePoint.name}</li>
        </ul>
        )
    );

    return (
        <div>
            <h2>What's the address?</h2>
            <div>
                <form onChange={handleChange}>
                    <Prompt when={isBlocking} message={() => "You have unsaved data. Press \"Cancel\" to keep your changes."} />
                    <input type="text" id="city" placeholder="City..." />
                    <br></br>
                    <input type="text" id="postalCode" placeholder="Zip..." />
                    <br></br>
                    <input type="text" id="streetName" placeholder="Street..." />
                    <br></br>
                    <input type="text" id="streetNumber" placeholder="Street number..." />
                    <br></br>
                    <input type="submit" value="Enter" onClick={handleSubmit} />
                </form>
            </div>
            {allServicePoints}
        </div>
    );
}

export function WeatherInfo({ weather }) {
    return (
        <div>
            <h2>Weather goes here</h2>
            <Log value={weather} />
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