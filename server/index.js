const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const port = 1337;
const userFile = path.join(__dirname, "user.json");

let students = [];

function logStudentData(action, student) {
    console.log(`${action} Student:`);
    Object.entries(student).forEach(([key, value]) => console.log(`  ${key}: ${value}`));
    console.log();
}

app.get("/", (req, res) => {
    res.send("User Management API");
});

app.get("/fetchstudents", (req, res) => {
    res.json(students);
});

app.post("/addstudents", (req, res) => {
    const newStudent = req.body;
    students.push(newStudent);
    logStudentData("Added", newStudent);
    res.status(201).json(newStudent);
});

app.put("/updatestudent/:idnumber", (req, res) => {
    const studentIndex = students.findIndex(s => s.idnumber === req.params.idnumber);
    if (studentIndex === -1) {
        return res.status(404).json({ error: "Student not found" });
    }

    students[studentIndex] = { ...students[studentIndex], ...req.body };
    logStudentData("Updated", students[studentIndex]);
    res.json(students[studentIndex]);
});

app.delete("/deletestudent/:idnumber", (req, res) => {
    const studentIndex = students.findIndex(s => s.idnumber === req.params.idnumber);
    if (studentIndex === -1) {
        return res.status(404).json({ error: "Student not found" });
    }

    const deletedStudent = students[studentIndex];
    students.splice(studentIndex, 1);
    logStudentData("Deleted", deletedStudent);
    res.json({ message: "Student deleted successfully" });
});

// User Management
function loadUsers() {
    try {
        return fs.existsSync(userFile) ? JSON.parse(fs.readFileSync(userFile)) : [];
    } catch (error) {
        console.error("Error reading user data:", error);
        return [];
    }
}

function saveUsers(data) {
    try {
        fs.writeFileSync(userFile, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Error saving user data:", error);
    }
}

app.get("/fetchusers", (req, res) => {
    const users = loadUsers();
    res.json(users);
});

app.post("/adduser", (req, res) => {
    const users = loadUsers();
    const newUser = { ...req.body };

    users.push(newUser);
    saveUsers(users);
    res.status(201).json(newUser);
});

app.put("/updateuser/:id", (req, res) => {
    const users = loadUsers();
    const index = users.findIndex(user => user.id === req.params.id);

    if (index === -1) {
        return res.status(404).json({ error: "User not found" });
    }

    users[index] = { ...users[index], ...req.body };
    saveUsers(users);
    res.json(users[index]);
});

app.delete("/deleteuser/:id", (req, res) => {
    let users = loadUsers();
    const index = users.findIndex(user => user.id === req.params.id);

    if (index === -1) {
        return res.status(404).json({ error: "User not found" });
    }

    users.splice(index, 1);
    saveUsers(users);
    res.json({ message: "User deleted successfully" });
});

app.post("/login", (req, res) => {
    const { username, password } = req.body;
    const users = loadUsers();

    const user = users.find(user => user.username === username && user.password === password);
    
    if (user) {
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

