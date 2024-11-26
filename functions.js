
  
  // Function to fetch and display names
  function displayNames() {
    const names = [];
    const container = document.getElementById('namesContainer');
    db.collection("Orders")
      .get()
      .then((querySnapshot) => {
        container.innerHTML = ''; // Clear previous content
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          names.push(data.Name);
          const nameElement = document.createElement('p');
          nameElement.textContent = `Name: ${data.Name}`;
          container.appendChild(nameElement);
        });
        console.log("Names array:", names);
      })
      .catch((error) => {
        console.error("Error fetching documents:", error);
      });
  }

  function displayData() {
    const tableBody = document.querySelector("#dataTable tbody");
  
    db.collection("Orders")
      .get()
      .then((querySnapshot) => {
        console.log("Fetched Data:", querySnapshot.docs.map(doc => doc.data()));

        tableBody.innerHTML = ""; // Clear previous table content
  
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const row = document.createElement("tr");
  
          row.innerHTML = `
            <td>${data.order}</td>
            <td>${data.name}</td>
            <td>${data.total}</td>
            <td>${data.timestamp?.toDate().toLocaleString() || "N/A"}</td>
            <td>${data.status}</td>
              <button onclick="editData('${doc.id}', '${data.order}','${data.name}', '${data.total}', '${data.timestamp}','${data.status}')">Edit</button>
              <button onclick="removeData('${doc.id}')">Delete</button>
            </td>
          `;
          tableBody.appendChild(row);
        });
      })
      .catch((error) => {
        console.error("Error fetching documents:", error);
      });
  }

  function editData(id, currentOrder, currentName, currentTotal, currentTimestamp, currentStatus) {
    
    const newName = prompt("Edit Name:", currentName);
    const newOrder = prompt("Edit Order:", currentOrder);
  
    if (newName && newOrder) {
      db.collection("Orders").doc(id).update({
        name: newName,
        order: newOrder,
      })
      .then(() => {
        alert("Data updated successfully!");
        displayData(); // Refresh the table
      })
      .catch((error) => {
        console.error("Error updating document:", error);
      });
    }
  }

  function removeData(id) {
    if (confirm("Are you sure you want to delete this data?")) {
      db.collection("Orders").doc(id).delete()
      .then(() => {
        alert("Data deleted successfully!");
        displayData(); // Refresh the table
      })
      .catch((error) => {
        console.error("Error deleting document:", error);
      });
    }
    loadData();
  }

  // Function to fetch and display data
function loadData() {
  const tableBody = document.querySelector("#dataTable tbody");

  db.collection("Orders")
    .orderBy("timestamp", "desc") // Fetch in descending order
    .get()
    .then((querySnapshot) => {
      alert("Data added successfully!");
      console.log("Fetched documents:", querySnapshot.docs.map(doc => doc.data())); // Debugging
      tableBody.innerHTML = ""; // Clear the table before updating

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const row = document.createElement("tr");

        row.innerHTML = `
          <td>${data.order}</td>
          <td>${data.name}</td>
          <td>${data.total}</td>
          <td>${data.status}</td>
          <td>${data.timestamp ? data.timestamp.toDate().toLocaleString():"N/A"}</td>
          <td>

            <button onclick="editData('${doc.id}', '${data.order}', '${data.name}', '${data.total}', '${data.status}')">Edit</button>
            <button onclick="removeData('${doc.id}')">Delete</button>
          </td>
        `;

        tableBody.appendChild(row); // Add the row to the table
      });
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
  }

// Function to add data
function addData(event) {
  event.preventDefault();
  console.log("addData function called");

  const order = document.getElementById("order").value.trim();
  const name = document.getElementById("name").value.trim();
  const total = parseFloat(document.getElementById("total").value.trim());
  const status = document.getElementById("status").value.trim();



  if (!name || !order || isNaN(total)||!status) {
    alert("Please fill in all fields.");
    return;
  }

  const data = {
    order:order,
    name: name,
    total: total,
    status: status,
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
  };

  db.collection("Orders")
    .add(data)
    .then(() => {
      alert("Data added successfully!");
      document.getElementById("addDataForm").reset(); // Clear the form
      loadData(); // Refresh the table to include new data
      console.log("HULLO");
    })
    .catch((error) => {
      console.error("Error adding data:", error);
    });

}



  
  // Automatically call the function when the DOM is fully loaded


  // document.getElementById("addDataForm").addEventListener("submit", addData);

  document.addEventListener("DOMContentLoaded", () => {

    loadData();
    //displayNames();
    document.getElementById("addDataForm").addEventListener("submit", addData);

    
  });
  