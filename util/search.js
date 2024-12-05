const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Path to the database file
const dbPath = path.join(__dirname, '../data/db.json');

// Helper function to read the database
function readDatabase() {
    const data = fs.readFileSync(dbPath, 'utf-8');
    return JSON.parse(data);
}

// GET endpoint to search for a student by ID or name
router.get('/students/search', (req, res) => {
    const { query } = req.query; // Query parameter

    if (!query) {
        return res.status(400).json({ error: "Query parameter is required" });
    }

    const db = readDatabase();

    // Search for the student
    const student = db.students.find(s =>
        s.studentID.toString() === query || s.name.toLowerCase().includes(query.toLowerCase())
    );

    if (!student) {
        return res.status(404).json({ error: "No student found with that ID or name" });
    }

    // Find classes the student is enrolled in
    const studentClasses = db.enrollment
        .filter(e => e.enrolledStudentID === student.studentID)
        .map(e => db.classes.find(c => c.classID === e.enrolledClassID))
        .filter(Boolean);

    res.status(200).json({
        student,
        classes: studentClasses
    });
});

module.exports = router;
