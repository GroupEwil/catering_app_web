var tableExp;
var showingEditor = false;
var finalTotal;
var cartTable;
document.getElementById('btnDownload').onclick = function() { 
    DownloadQuote();
    return false;
};
firebase.auth().onAuthStateChanged(function(_user) {
  if (_user) {
    // User is signed in.
	PopulateCart("normal");
  } else {
    // No user is signed in.
	window.location.href = "../../index.html";
  }
});

function PopulateCart(type)
{
	cartTable = document.getElementById("tableBody");
	
	return firebase.database().ref('/users/' + user.uid).once('value').then(function(snapshot) 
		{
			
			if (snapshot.hasChild("cart"))
			{
				cartTable.innerHTML = "";
				var isValid = false;
				var total = 0;
				var lastID = 0;
				var count = parseInt(snapshot.child("cart").numChildren());
				snapshot.child("cart").forEach((objectID) =>
				{
					var product = objectID.key;
					var name;
					var quantity = 1;
					var price = 0;
					
					
					isValid = true;
					
						objectID.forEach((child) =>
						{
							if(child.key === "quantity")
							{
								
								quantity = child.val();
								return firebase.database().ref('/products/' + product).once('value').then(function(snapshot) 
								{
									if(snapshot.exists)
									{
										price = parseFloat(snapshot.child("productPrice").val());
										total = total + (price * quantity);
										name = snapshot.child("productName").val();
										lastID++;
										Add(product, name,quantity, price, lastID, type);
										
									}
									else
									{
										console.log("Does not exist");
									}
									
									if(lastID == count)
									{
										finalTotal = total;
										AddFooter(total, lastID);
										
									}
									
								});
								
								
							}
							
							
						});
						
					
					
				});
				
			}
			else
			{
				console.log("Does not exist");
			}
		});
}

function Add(id, product, quantity, price, lastID, type)
{
	var tableBody = document.getElementById("tableBody");
	var newRow = document.createElement('tr');
	newRow.id = lastID;
	
	var col1 = document.createElement('td');
	var col2 = document.createElement('td');
	var col3 = document.createElement('td');
	var col4 = document.createElement('td');
	var col5 = document.createElement('td');
	var col6 = document.createElement('td');
	var col7 = document.createElement('td');
	
	col1.innerText = "("+ product + ")";
	col2.innerText = "R" + price;
	//col3.innerText = quantity;
	
	/*
	var quantityLink = document.createElement('a');
	quantityLink.innerText = quantity;
	quantityLink.onclick  = function() { 
		ShowEditor(col3, id, quantity);
    return false;
	};
	col3.appendChild(quantityLink);
	*/
	var quantityLink = document.createElement('div');
	quantityLink.classList.add("dropdown");
	quantityLink.innerText = quantity;
	var toggleLink = document.createElement('a');
	toggleLink.classList.add('dropdown-toggle');
	toggleLink.setAttribute("data-toggle", "dropdown");
	var menuLink = document.createElement("div");
	menuLink.classList.add("dropdown-menu");
	var i = 1;
	while(i <= 10)
	{
		var item = document.createElement("a");
		item.setAttribute("id",i);
		item.classList.add("dropdown-item");
		item.innerText = i;
		item.onclick  = function() 
		{ 
			quantityLink.innerText = this.id;
			ReduceQuantity(id, this.id, price, price*quantity, col3, col4, col5, col6);
			return false;
		};
		menuLink.appendChild(item);
		i++;
	}
	/*quantityLink.onclick  = function() { 
	
		ShowEditor(col3, id, quantity);
    return false;
	};*/
	quantityLink.appendChild(toggleLink);
	quantityLink.appendChild(menuLink);
	col3.appendChild(quantityLink);
	
	//col3.innerText = quantity;
	col4.innerText = "R" + ((price * quantity)-(price * 15/115)).toFixed(2);
	col5.innerText = "R" + ((price * quantity) * 15/115).toFixed(2);
	col6.innerText = "R" + (price * quantity).toFixed(2);
	var totalPrice = price * quantity;
	
	
	if(id != "" && type === "normal")
	{
		var btn = document.createElement('button');
		btn.classList.add("btn");
		btn.classList.add("btn-primary");
		btn.innerText = "X";
		btn.onclick  = function() { 
		DeleteFromCart(id, newRow, totalPrice);
    return false;
	};
		col7.appendChild(btn);
	}
	
	
	
	newRow.appendChild(col1);
	newRow.appendChild(col2);
	newRow.appendChild(col3);
	newRow.appendChild(col4);
	newRow.appendChild(col5);
	newRow.appendChild(col6);
	newRow.appendChild(col7);
	tableBody.appendChild(newRow);
	
	
	
}
function ShowEditor(column, name, quantity)
{
	if(!showingEditor)
	{
		console.log("Appending");
	var quantityInput = document.createElement('input');
	quantityInput.setAttribute("type", "text");
	quantityInput.value = quantity;
	quantityInput.style.width = "50px";
	quantityInput.addEventListener("keyup", function(event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    
	quantity = quantityInput.value;
	if(quantity === "0")
	{
		DeleteFromCart(name);
	}
	else
	{
		ReduceQuantity(name, quantity);
	}
  }
});
	column.appendChild(quantityInput);
	showingEditor = true;
	}
	
}
function AddFooter(total, lastID)
{
	var tableBody = document.getElementById("tableBody");
	var newRow = document.createElement('tr');
	
	var col1 = document.createElement('td');
	var col2 = document.createElement('td');
	var col3 = document.createElement('td');
	var col4 = document.createElement('td');
	var col5 = document.createElement('td');
	var col6 = document.createElement('td');
	
	col1.innerText = "Total";
	col2.innerText = "";
	col3.innerText = "";
	col6.innerText = "R" + total;
	col6.id = "footer";
	
	
	
	newRow.appendChild(col1);
	newRow.appendChild(col2);
	newRow.appendChild(col3);
	newRow.appendChild(col4);
	newRow.appendChild(col5);
	newRow.appendChild(col6);
	tableBody.appendChild(newRow);
	
}
function  DeleteFromCart(product, newRow, price)
{
	return firebase.database().ref('/users/' + user.uid).once('value').then(function(snapshot) 
		{
			
			if (snapshot.hasChild("cart"))
			{
				var isValid = false;
				var quantity = snapshot.child("cart").child(product).child("quantity").val();
				firebase.database().ref('/users/' + user.uid+"/cart/"+product).remove();
				newRow.remove();
				var footer = document.getElementById("footer");
				footer.innerText = "R" + (finalTotal-price);
					
			}
			else
			{
				console.log("Does not exist");
			}
		});
	
	
	
	
}
function ReduceQuantity(name, quantity, price, previousTotal, col3, col4, col5, col6)
{
	firebase.database().ref('users/' + user.uid +"/cart/"+name).set(
			{
				quantity: quantity
			}, function(error) 
			{
				if (error) 
				{
				  // The write failed...
				  console.log("Failed: " + error);
				} 
				else 
				{
				  // Data saved successfully!
					console.log("Product successfully updated: " + name + " " + quantity);
					col3.innerHTML = "";
					var quantityLink = document.createElement('div');
	quantityLink.classList.add("dropdown");
	quantityLink.innerText = quantity;
	var toggleLink = document.createElement('a');
	toggleLink.classList.add('dropdown-toggle');
	toggleLink.setAttribute("data-toggle", "dropdown");
	var menuLink = document.createElement("div");
	menuLink.classList.add("dropdown-menu");
	var i = 1;
	while(i <= 10)
	{
		var item = document.createElement("a");
		item.setAttribute("id",i);
		item.classList.add("dropdown-item");
		item.innerText = i;
		item.onclick  = function() 
		{ 
			quantityLink.innerText = this.id;
			ReduceQuantity(name, this.id, price, price*quantity, col3, col4, col5, col6);
			return false;
		};
		menuLink.appendChild(item);
		i++;
	}
	/*quantityLink.onclick  = function() { 
	
		ShowEditor(col3, id, quantity);
    return false;
	};*/
	quantityLink.appendChild(toggleLink);
	quantityLink.appendChild(menuLink);
	col3.appendChild(quantityLink);
	
	
					col4.innerText = "R" + ((price * quantity)-(price * 15/115)).toFixed(2);
					col5.innerText = "R" + ((price * quantity) * 15/115).toFixed(2);
					col6.innerText = "R" + (price * quantity).toFixed(2);
					
					var minusTotal = finalTotal - previousTotal;
					var footer = document.getElementById("footer");
					finalTotal = minusTotal + (price*quantity);
					footer.innerText = "R" + (finalTotal-price);
				}
				//location.reload();
			});
}

function DownloadQuote()
{
	//if(tableExp == null)
	//{
			var dropdowns = document.getElementsByClassName("dropdown-menu");
			Array.from(document.getElementsByClassName("dropdown-menu")).forEach(
		function(element, index, array) 
		{
			// do stuff
			if(index > 0)
			{
				element.innerHTML = "";
			}

		}
		);
		
		var buttons = document.getElementsByTagName("caption")[0];
		if(buttons != null)
		{
			buttons.remove();
		}
		tableExp = new TableExport(document.getElementById("cartTable"));
		var btn = document.getElementsByClassName("xlsx")[0];
		btn.onclick  = function() 
		{
			buttons = document.getElementsByTagName("caption")[0];
			if(buttons != null)
			{
				buttons.remove();
			}
			//tableExp = new TableExport(document.getElementById("cartTable"));
			PopulateCart("");
			return false;
		};
		
		/*tableExp.getElementsByTagName("caption").children(0).onclick  = function() 
		{ 
			var dropdowns = document.getElementsByClassName("dropdown-menu");
			var i = 0;
			Array.prototype.forEach.call(dropdowns, function(el) 
			{
				// Do stuff here
				if(a != 0)
				{
					el.remove();
				}
				a++;
			});
			
			return false;
		};*/
	//}
	
}

function ProccessQuote()
{
	
}