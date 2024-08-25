import axios from 'axios';
import './App.css';
import {useEffect, useState} from "react";

function App() {
  const [users, setUsers] = useState([]);
  const [fillterUsers, setfillterUsers] = useState([]);

  const getAllUsers = async () => {
    await axios.get("http://localhost:8080/users").then((res) => {
        setUsers(res.data)
        setfillterUsers(res.data)
    });
    
  };

  function handleSearchChange(e) {
    const searchText = e.target.value.toLowerCase();
    const fillteredUsers = users.filter((user)=>user.name.toLowerCase().includes(searchText) || user.city.toLowerCase().includes(searchText));
    setfillterUsers(fillteredUsers)
  }

  async function handleDelete (id) {
    const isConfirmed = window.confirm("Are you sure you want to delete this user ?");
    if (isConfirmed) {
      await axios.delete(`http://localhost:8080/users/${id}`).then((res) => {
        setUsers(res.data);
        setfillterUsers(res.data);
      });
    }
  };

  useEffect(() => {
    getAllUsers(); 
  },[])

  return (
    <>
      <div className="container">
        <h3>Crud Application Use React and Node Js</h3>
        <div className="input-search">
          <input type="search" placeholder='Search text Here....' onChange={handleSearchChange}/>
          <button className = "btn green">Add Users</button>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Age</th>
              <th>City</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {fillterUsers && fillterUsers.map((user,index) => {
              return (
                <tr key={user.id}>
                <td>{index+1}</td>
                <td>{user.name}</td>
                <td>{user.age}</td>
                <td>{user.city}</td>
                <td><button className = "btn green">Edit</button></td>
                <td><button className = "btn red" onClick={() => handleDelete(user.id)}>Delete</button></td>
              </tr>
              )
            })}
            
          </tbody>
        </table>
      </div>
    </>
  )
}

export default App
