import React from 'react';

const Users = ({ users, loading, handleDelete }) => {

    if(loading) {
        return <h2>Loading... </h2>;
    }

    let displayUsers = users.map((user) => (
        <ul className="list-group">
            <li className="list-group-item list-group-test">
                <div className="btn-toolbar">
                    <ul key={user.username}>Username: {user.username} <br/>
                        <button className="btn btn-black btnBorder btn-sm mr-2" onClick={() => handleDelete(user.username)}>Delete</button> 
                        <button className="btn btn-black btnBorder btn-sm mr-2">Edit </button> 
                    </ul>
                </div>
            </li>
        </ul>
    ))

    return (
        <div>
            {displayUsers}
        </div>
    )
}

export default Users;