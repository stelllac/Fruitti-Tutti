function fetchOrders() {
    ordersRef.get()
      .then((querySnapshot) => {
        const orderList = document.getElementById('orderList');
        orderList.innerHTML = '';  // Clear existing list
  
        querySnapshot.forEach((doc) => {
          const orderData = doc.data();
          const listItem = document.createElement('li');
          listItem.textContent = `Name: ${orderData.name}, Order: ${orderData.order}`;
          orderList.appendChild(listItem);
        });
      })
      .catch((error) => {
        console.error("Error fetching orders: ", error);
      });
  }
  