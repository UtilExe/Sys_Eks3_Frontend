import React from 'react';
import { useState } from 'react';
import apiFacade from '../apiFacade';
import Modal from 'react-modal';

const Users = ({ users, loading, handleDelete, handleEditChange }) => {

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
    const [editMsg, setEditMsg] = useState('');
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

                    <h2 className="mb-0" ref={_subtitle => (subtitle = _subtitle)}>Edit {username}</h2>
                    <hr className="ownHr mt-1"></hr>
                    <form onChange={handleEditChange}>
                        <div>
                            <input className="form-control ownInputs mb-3" placeholder="Edit password.." id="editPassword" type="password"/>
                        </div>
                        <div>
                            <button onClick={editUserSubmit} className="btn btn-black btnBorder">Submit</button>
                            <button onClick={closeModal} Style="" className="btn btn-black btnBorder btnBorderClose">Close</button>
                        </div>
                    </form>
                </Modal>
            </div>
        )
    }

    if(loading) {
        return <h2>Loading... </h2>;
    }

    let displayUsers = users.map((user, index) => (
        <ul key={index} className="list-group">
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

    return (
        <div>
            {displayUsers}
            {modalShow()}
            {editStyleColor}
        </div>
    )
}

export default Users;