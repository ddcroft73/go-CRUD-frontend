
window.onload = function() {
    getUsers();
};

// Function to create a new user
function createUser(event) {
    event.preventDefault(); // Prevent form submission

    // Get form values
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const fullname = document.getElementById('fullname').value;
    const message = document.getElementById('message').value;

    // Send POST request to create user endpoint
    fetch('http://localhost:8080/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, fullname, message })
    })
    .then(response => response.json())
    .then(data => {
        // Clear form fields
        document.getElementById('create-form').reset();
        // Refresh user list
        getUsers();
    })
    .catch(error => console.error('Error') 
)}

function getUsers() {
    // Send GET request to retrieve users
    fetch('http://localhost:8080/', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector('#users-table tbody');
            tableBody.innerHTML = ''; // Clear existing table rows

            // Iterate over the retrieved users and create table rows
            data.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.username}</td>
                    <td>${user.email}</td>
                    <td>${user.fullname}</td>
                    <td>${user.message}</td>
                    <td>
                       <div id="btn-container">
                          <button id="edit-btn" class="edit-btn" data-user='${JSON.stringify(user)}'>Edit</button>
                           <button id="delete-btn" onclick="deleteUser(${user.id})">Delete</button>
                       </div>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error retrieving users:', error));
}



// Get the modal and close button elements
const editModal = document.getElementById('edit-modal');
const closeBtn = document.getElementsByClassName('close')[0];

// Function to handle the edit button click event
function openEditModal(user) {
  document.getElementById('edit-id').value = user.id;
  document.getElementById('edit-username').value = user.username;
  document.getElementById('edit-email').value = user.email;
  document.getElementById('edit-fullname').value = user.fullname;
  document.getElementById('edit-message').value = user.message;
  editModal.style.display = 'block';
}

// Event delegation for edit buttons
document.addEventListener('click', function(event) {
  if (event.target.classList.contains('edit-btn')) {
    const user = JSON.parse(event.target.getAttribute('data-user'));
    openEditModal(user);
  }
});

// Close the modal when the close button is clicked
closeBtn.addEventListener('click', function() {
  editModal.style.display = 'none';
});

// Function to handle the edit form submission
function editUser(event, userId) {
    event.preventDefault();
  
    const id = userId //document.getElementById('edit-id').value;
    const username = document.getElementById('edit-username').value;
    const email = document.getElementById('edit-email').value;
    const fullname = document.getElementById('edit-fullname').value;
    const message = document.getElementById('edit-message').value;
    
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('email', email);
    formData.append('fullname', fullname);
    formData.append('message', message);
  
    fetch(`http://localhost:8080/update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData.toString()
    })
    .then(response => response.json())
    .then(data => {
      editModal.style.display = 'none';
      getUsers();
    })
    .catch(error => console.error('Error updating user:', error));
  
  }
  
  // Event listener for edit form submission
  document.getElementById('edit-form').addEventListener('submit', editUser);




const deleteUser = (userID) => {

    if (confirm("Are you sure you want to delete this record?")) {
        fetch(`http://localhost:8080/delete/${userID}`, {
            method: 'POST'
        })
            .then(response => {
            if (response.ok) {
                // User deleted successfully
                getUsers(); // Refresh the user list
            } else {
                // Handle the error case
                console.error('Error deleting user:', response.statusText);
            }
            })
            .catch(error => console.error('Error deleting user:', error));
    }
}

const deleteAllUsers = () => {

    if (confirm("This action will delete all records in the database. \n Continue?")) {
        // User clicked "OK", perform the action
        fetch(`http://localhost:8080/delete-all`, {
        method: 'POST'
        })
        .then(response => {
          if (response.ok) {
            // User deleted successfully
            getUsers(); // Refresh the user list
          } else {
            // Handle the error case
            console.error('Error deleting user:', response.statusText);
          }
        })
        .catch(error => console.error('Error deleting user:', error));
      } else {
        // User clicked "Cancel", do nothing or handle accordingly
        console.log("Deletion canceled");
      }
    
}

