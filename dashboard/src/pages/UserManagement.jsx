import React, { useState, useRef, useEffect } from "react";
import Sidebar from "./Sidebar";
import "./UserManagement.css";
import {
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [openModalAdd, setOpenModalAdd] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const idRef = useRef();
  const fnameRef = useRef();
  const mnameRef = useRef();
  const lnameRef = useRef();
  const username = useRef();
  const password = useRef();
  const roleRef = useRef();

  const [editFormData, setEditFormData] = useState({
    id: "",
    fname: "",
    mname: "",
    lname: "",
    username: "",
    password: "",
    role: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const response = await axios.get("http://localhost:1337/fetchusers");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }

  async function handleAddUser() {
    const newUser = {
      id: idRef.current.value,
      fname: fnameRef.current.value,
      mname: mnameRef.current.value,
      lname: lnameRef.current.value,
      username: username.current.value,
      password: password.current.value,
      role: roleRef.current.value,
    };

    try {
      await axios.post("http://localhost:1337/adduser", newUser);
      fetchUsers();
      resetForm();
      setOpenModalAdd(false);
    } catch (error) {
      console.error("Error adding user:", error);
    }
  }

  async function handleEditUser() {
    if (!selectedUser) return;

    try {
      await axios.put(`http://localhost:1337/updateuser/${selectedUser.id}`, editFormData);
      fetchUsers();
      setOpenModalEdit(false);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  }

  async function handleDeleteUser() {
    if (!selectedUser) return;

    try {
      await axios.delete(`http://localhost:1337/deleteuser/${selectedUser.id}`);
      fetchUsers();
      setOpenModalDelete(false);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  }

  function resetForm() {
    if (idRef.current) idRef.current.value = "";
    if (fnameRef.current) fnameRef.current.value = "";
    if (mnameRef.current) mnameRef.current.value = "";
    if (lnameRef.current) lnameRef.current.value = "";
    if (username.current) username.current.value = "";
    if (password.current) password.current.value = "";
    if (roleRef.current) roleRef.current.value = "";
  }

  function handleOpenEditModal(user) {
    setSelectedUser(user);
    setEditFormData(user);
    setOpenModalEdit(true);
  }

  function handleEditInputChange(e) {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleOpenDeleteModal(user) {
    setSelectedUser(user);
    setOpenModalDelete(true);
  }

  return (
    <div className="user-management-container">
      <Sidebar />
      <main className="content">
        
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", alignItems: 'center', marginTop: '40px', marginBottom: '20px' }}>
          <Typography variant="h4">User Management</Typography>
          <Button variant="contained" color="primary" onClick={() => setOpenModalAdd(true)}>
            Add User
          </Button>
        </div>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>ID</strong></TableCell>
                <TableCell><strong>FisrtName</strong></TableCell>
                <TableCell><strong>MiddleName</strong></TableCell>
                <TableCell><strong>LastName</strong></TableCell>
                <TableCell><strong>Username</strong></TableCell>
                <TableCell><strong>Password</strong></TableCell>
                <TableCell><strong>Role</strong></TableCell>
                <TableCell><strong>Settings</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.length > 0 ? (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.fname}</TableCell>
                    <TableCell>{user.mname}</TableCell>
                    <TableCell>{user.lname}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.password}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <IconButton color="primary" onClick={() => handleOpenEditModal(user)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleOpenDeleteModal(user)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">No users found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={openModalAdd} onClose={() => setOpenModalAdd(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Add New User</DialogTitle>
          <DialogContent>
            <TextField inputRef={idRef} label="ID" variant="outlined" margin="normal" fullWidth required />
            <TextField inputRef={fnameRef} label="FirstName" variant="outlined" margin="normal" fullWidth required />
            <TextField inputRef={mnameRef} label="MiddleName" variant="outlined" margin="normal" fullWidth required />
            <TextField inputRef={lnameRef} label="LastName" variant="outlined" margin="normal" fullWidth required />
            <TextField inputRef={username} label="Username" variant="outlined" margin="normal" fullWidth required />
            <TextField inputRef={password} label="Password" variant="outlined" margin="normal" fullWidth required />
            <TextField inputRef={roleRef} label="Role" variant="outlined" margin="normal" fullWidth required />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenModalAdd(false)} color="secondary">
              Cancel
            </Button>
            <Button variant="contained" onClick={handleAddUser}>
              Add User
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openModalEdit} onClose={() => setOpenModalEdit(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Edit User</DialogTitle>
          <DialogContent>
            <TextField name="id" label="ID" variant="outlined" margin="normal" fullWidth value={editFormData.id} disabled />
            <TextField name="fname" label="FirstName" variant="outlined" margin="normal" fullWidth value={editFormData.fname} onChange={handleEditInputChange} />
            <TextField name="mname" label="MiddleName" variant="outlined" margin="normal" fullWidth value={editFormData.mname} onChange={handleEditInputChange} />
            <TextField name="lname" label="LastName" variant="outlined" margin="normal" fullWidth value={editFormData.lname} onChange={handleEditInputChange} />
            <TextField name="username" label="Username" variant="outlined" margin="normal" fullWidth value={editFormData.username} onChange={handleEditInputChange} />
            <TextField name="password" label="Password" variant="outlined" margin="normal" fullWidth value={editFormData.password} onChange={handleEditInputChange}/>
            <TextField name="role" label="Role" variant="outlined" margin="normal" fullWidth value={editFormData.role} onChange={handleEditInputChange} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenModalEdit(false)} variant="contained" color="error">
              Cancel
            </Button>
            <Button variant="contained" onClick={handleEditUser}>
              Update User
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openModalDelete} onClose={() => setOpenModalDelete(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Delete Confirmation</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete this user?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenModalDelete(false)} variant="contained">
              Cancel
            </Button>
            <Button variant="contained" color="error" onClick={handleDeleteUser}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </main>
    </div>
  );
};

export default UserManagement;
