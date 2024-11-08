const userTable = document.getElementById('user-table');
    const userForm = document.getElementById('user-form');
    const submitButton = document.getElementById('submitButton');

    async function fetchUsers() {
      try {
        const response = await fetch('https://672de864fd89797156443b54.mockapi.io/bilal');
        const users = await response.json();
        return users;
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    }

    function renderUsers(users) {
      const tableBody = userTable.getElementsByTagName('tbody')[0];
      tableBody.innerHTML = '';
      users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${user.Name}</td>
          <td>${user.degree}</td>
          <td>${user.Cgpa.toFixed(2)}</td>
          <td>
            <button class="btn btn-primary" onclick="startEditUser('${user.id}')">Edit</button>
            <button class="btn btn-danger" onclick="deleteUser('${user.id}')">Delete</button>
          </td>
        `;
        tableBody.appendChild(row);
      });
    }

    async function addUser(event) {
      event.preventDefault();
      const name = document.getElementById('name').value;
      const degree = document.getElementById('degree').value;
      const cgpa = parseFloat(document.getElementById('cgpa').value);
      const userId = document.getElementById('userId').value;

      if (userId) {
        await updateUser(userId, name, degree, cgpa);
      } else {
        await createUser(name, degree, cgpa);
      }

      const users = await fetchUsers();
      renderUsers(users);
      userForm.reset();
      submitButton.textContent = 'Add User';
    }

    async function createUser(name, degree, cgpa) {
      try {
        await fetch('https://672de864fd89797156443b54.mockapi.io/bilal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ Name: name, degree, Cgpa: cgpa }),
        });
      } catch (error) {
        console.error('Error adding user:', error);
      }
    }

    async function updateUser(id, name, degree, cgpa) {
      try {
        await fetch(`https://672de864fd89797156443b54.mockapi.io/bilal/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ Name: name, degree, Cgpa: cgpa }),
        });
      } catch (error) {
        console.error('Error updating user:', error);
      }
    }

    async function deleteUser(id) {
      try {
        await fetch(`https://672de864fd89797156443b54.mockapi.io/bilal/${id}`, {
          method: 'DELETE',
        });
        const users = await fetchUsers();
        renderUsers(users);
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }

    function startEditUser(id) {
      const userRow = document.querySelector(`button[onclick="startEditUser('${id}')"]`).closest('tr');
      document.getElementById('userId').value = id;
      document.getElementById('name').value = userRow.cells[0].textContent;
      document.getElementById('degree').value = userRow.cells[1].textContent;
      document.getElementById('cgpa').value = parseFloat(userRow.cells[2].textContent);
      submitButton.textContent = 'Update User';
    }

    (async () => {
      const users = await fetchUsers();
      renderUsers(users);
    })();

    userForm.addEventListener('submit', addUser);