let dataLoaded = false;

// Function to search for a student
async function searchStudent() {
    const input = document.getElementById("searchInput").value.trim();
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = ""; // Clear previous results

    if (input === '') {
        alert("Please enter a search query.");
        return;
    }

    try {
        const response = await fetch(`/api/students/search?query=${encodeURIComponent(input)}`);
        if (!response.ok) {
            if (response.status === 404) {
                resultDiv.innerHTML = "<p>No student found with that ID or name.</p>";
            } else {
                resultDiv.innerHTML = "<p>An error occurred while searching.</p>";
            }
            return;
        }

        const data = await response.json();

        let studentDetails = `<h3>Student Details</h3>`;
        studentDetails += `<p><strong>ID:</strong> ${data.student.studentID}</p>`;
        studentDetails += `<p><strong>Name:</strong> ${data.student.name}</p>`;

        if (data.classes && data.classes.length > 0) {
            studentDetails += `<h4>Classes Enrolled</h4>`;
            data.classes.forEach(c => {
                studentDetails += `<p><strong>Subject:</strong> ${c.subject}, <strong>Date:</strong> ${c.date}, <strong>Tutor:</strong> ${c.tutor}</p>`;
            });
        } else {
            studentDetails += `<p>No classes found for this student.</p>`;
        }

        resultDiv.innerHTML = studentDetails;

    } catch (error) {
        console.error('Error searching for student:', error);
        resultDiv.innerHTML = "<p>An error occurred while searching.</p>";
    }
}

