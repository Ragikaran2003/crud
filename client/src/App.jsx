import axios from 'axios';
import './App.css';
import {useEffect, useState} from "react";

function App() {
  const [users, setUsers] = useState([]);
  const [fillterUsers, setfillterUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState({name:"",age:"",city:""});
  const [flashMessage, setFlashMessage] = useState("");


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
        showFlashMessage("User Data Deleted Successfully");
      });
    }
  };

  useEffect(() => {
    getAllUsers(); 
  },[]);

  //close modal
  const closeModal = () => {
    setIsModalOpen(false);
    getAllUsers(); 
  }

  const handleSubmit  = async (e) => {
    e.preventDefault();
    if (userData.id) {
      await axios.patch(`http://localhost:8080/users/${userData.id}`,userData).then(() => {
        showFlashMessage("User Data Updated Successfully");
      });
    }else {
      await axios.post("http://localhost:8080/users",userData).then(() => {
        showFlashMessage("User Data Added Successfully");
        });
      }
      closeModal();
      setUserData({name:"",age:"",city:""});
  };

  const handleData = (e) => {
    setUserData({...userData,[e.target.name]:e.target.value});
  }

  //Add Users

  const HandleAddRecord = () => {
    setUserData({name:"",age:"",city:""});
    setIsModalOpen(true);
  }

  //Update User Data

  const handleUpdateRecord = (user) => {
    setUserData(user);
    setIsModalOpen(true);
  }
//flash message
  const showFlashMessage = (message) => {
    setFlashMessage(message);
    setTimeout(() => {
      setFlashMessage("");
    }, 3000); // Clear after 3 seconds
  };
  

  return (
    <>
      <div className="container">
        <h3>Crud Application Use React and Node Js</h3>
        <div className="input-search">
          <input type="search" placeholder='Search text Here....' onChange={handleSearchChange}/>
          <button className = "btn green" onClick={HandleAddRecord}>Add Users</button>
        </div>
        {flashMessage && <div className="flash-message">{flashMessage}</div>}
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
                <td><button className = "btn green" onClick={() => handleUpdateRecord(user)}>Edit</button></td>
                <td><button className = "btn red" onClick={() => handleDelete(user.id)}>Delete</button></td>
              </tr>
              )
            })}
            
          </tbody>
        </table>
        {isModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={closeModal}>&times;</span>
              <h2>{userData.id ? "Update Record" : "Add Record"}</h2>
      
              <div className="input-group">
                <label htmlFor="name">Full Name</label>
                <input type="text" name="name" id="name" value={userData.name} onChange={handleData}/>
              </div>
              <div className="input-group">
                <label htmlFor="age">Age</label>
                <input type="number" name="age" id="age"  value={userData.age} onChange={handleData}/>
              </div>
              <div className="input-group">
                <label htmlFor="city">City</label>
                <input type="text" name="city" id="city"  value={userData.city} onChange={handleData}/>
              </div>
              <button className='btn green' onClick={handleSubmit}>{userData.id ? "Update User" : "Add User"}</button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default App
