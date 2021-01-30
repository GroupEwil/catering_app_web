var category;

firebase.auth().onAuthStateChanged(function(_user) {
  if (_user) {
    // User is signed in.
	user = _user;
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	category = urlParams.get('category');
	
		PopulateProducts();
  } else {
    // No user is signed in.
	window.location.href = "../../index.html";
  }
});


function PopulateProducts()
{
	if(user)
	{
		var database = firebase.database();
		var userId = firebase.auth().currentUser.uid;
		var dropdown = document.getElementById("rowProducts");
		console.log("Category: " + category);
		document.getElementById("breadCrumbCategory").innerText = category;
		document.getElementById("categoryHeading").innerText = category;

		return firebase.database().ref('/products').once('value').then(function(snapshot) 
		{
			snapshot.forEach((_child) => 
			{
				var _category;
				var isValid = false;
				var name;
				var price;
				var productId;
				var url = "images/products/";;
				_child.forEach((child) =>
				{
					
					//console.log(child.key);
					if((child.key).includes("productCategory"))
					{
						if((child.val()).includes(category))
						{
							isValid = true;
						}
					}
					
					isValid = true;
					if(child.key === "productUrl")
					{
						//url = child.val();
						//console.log(url);
					}
					if(child.key === "productName")
					{
						name = child.val();
					}
					if((child.key).includes("productPrice"))
					{
						price = child.val();
					}
					if((child.key).includes("productID"))
					{
						productId = child.val();
					}

					
				});
				if(isValid)
				{
					var divLink = document.createElement('a');
					divLink.href = "../../product.html?product="+productId;
				var newdiv = document.createElement('div');   //create a div
				newdiv.id = productId;                      //add an id
				newdiv.classList.add("col-sm-6");
				newdiv.classList.add("col-md-4");
				newdiv.classList.add("item");
				newdiv.classList.add("item");
				newdiv.classList.add("center");
				newdiv.width = "200";
				newdiv.height = "200";
				var secondDiv = document.createElement('div');
				secondDiv.classList.add("box");
				
				var storage = firebase.storage();
				var pathReference = storage.ref(url + productId + ".png");
				var icon = document.createElement('img');
				var source = pathReference.getDownloadURL().then(function(_url) {
					console.log("Source: " + _url);
				icon.src = _url;
				icon.width = "150";
				icon.height = "150";
				icon.classList.add("center");
				icon.classList.add("img-fluid");
				});
				
				
				var h3 = document.createElement('h3');
				h3.classList.add("name");
				h3.classList.add("center");
				h3.innerText = name;
				
				var p = document.createElement('p');
				p.classList.add("description");
				p.classList.add("center");
				p.innerText = "R" + price;
				

				
				secondDiv.appendChild(icon);
				secondDiv.appendChild(h3);
				secondDiv.appendChild(p);
				divLink.appendChild(secondDiv);
				newdiv.appendChild(divLink);
				dropdown.appendChild(newdiv);
				}
				
				
				
			});         
			
	  // ...
		});
	}
	else
	{
		window.location.href = "../../index.html";
	}
	
}