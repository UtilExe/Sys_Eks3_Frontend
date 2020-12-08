
import { post } from 'jquery';
import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import apiFacade from '../apiFacade';

export function Posting({ posts, loading }) {

  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(3);

  const [username, setName] = useState('');
  const [editedPassword, setEditedPassword] = useState('');
  const [editMsg, setEditMsg] = useState("");
  const pStyle = { color: '#19d21f' };
  const editStyleColor = <p style={pStyle}>{editMsg}</p>
  const [modalIsOpen, setIsOpen] = useState(false);


  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const [postsNew, setPostsNew] = useState([...posts]);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  let totalData = [];
  totalData = (Object.assign(postsNew, posts))
  const [users, setUsers] = useState([]);

  useEffect(() => {
    setPostsNew(posts)
  }, [posts])

  if (loading) {
    return <h2>Loading...</h2>;
  }

  function handleDelete(username) {
    updateUsers(username)
    apiFacade.getAllUsers()
    .then(array => {
      setUsers(array)
  })

  }

  function updateUsers(deletedUsername) {
    console.log("hi")
    let index;
    for(var i = 0; i < totalData.length; i++) {
      console.log("im in")
      if(postsNew[i].username === deletedUsername) {
        postsNew.map((user) => { 
          if (user.username === deletedUsername) {
       
            console.log("inside map", user.username)
           index = users.findIndex(x => x.username === user.username[i])
           console.log("look", postsNew)
        }
        
        })
        
        console.log("index number", index)
        setPostsNew(postsNew.splice(index, 1))
        
    } else {
      console.log("didnt hit")
    }
  }
}
  

  /* Modal Shit */
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
  }

  function openModal(username) {
    setIsOpen(true);
    setName(username);
  }

  var subtitle;

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = '#FFFFFF';
  }

  function closeModal(username) {
    setIsOpen(false);
  }

  /* Modal end shit */


  let displayUsers = postsNew.map((user) => (
    <ul className="list-group">
      <li className="list-group-item list-group-test">
        <div className="btn-toolbar">
          <ul key={user.username}>Username: {user.username} <br />
            <button className="btn btn-black btnBorder btn-sm mr-2" onClick={() => handleDelete(user.username)}>Delete</button>
            <button className="btn btn-black btnBorder btn-sm mr-2" onClick={() => openModal(user.username)}>Edit </button>
          </ul>
        </div>
      </li>
    </ul>
  ))

  return (
    <div>
      {displayUsers}
    </div>
  );
};

export default Posting;