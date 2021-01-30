var product;

firebase.auth().onAuthStateChanged(function(_user) {
  if (_user) {
    // User is signed in.
	user = _user;
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	product = urlParams.get('product');
	
		PopulateProducts();
  } else {
    // No user is signed in.
	window.location.href = "../../index.html";
  }
});
document.getElementById('btnAddToCart').onclick = function() { 
    AddToCart();
    return false;
};
document.getElementById('btnDownload').onclick = function() { 
    DownloadPDF();
    return false;
};
function PopulateProducts()
{
	if(user)
	{
		var database = firebase.database();
		var userId = firebase.auth().currentUser.uid;
		

		return firebase.database().ref('/products/' + product).once('value').then(function(snapshot) 
		{
			var _category;
				var name;
				var price;
				var productId;
				var description;
				var directions;
				var ingredients;
				var url = "images/products/";
			snapshot.forEach((_child) => 
			{
				if(_child.key === "productPrice")
				{
					price = _child.val();
				}
				if(_child.key === "productID")
				{
						productId = _child.val();
				}
				if(_child.key === "productCategory")
				{
						_category = _child.val();
				}
				if(_child.key === "productName")
				{
						name = _child.val();
				}
				//Replace below code
				if(_child.key === "description")
				{
						description = _child.val();
				}
				if(_child.key === "ingredients")
				{
						ingredients = _child.val();
				}
					
			});         
			
		document.getElementById("productTitle").innerText = name;
		document.getElementById("productDescription").innerText = description;
		document.getElementById("productIngredients").innerText = ingredients;
		document.getElementById("productPrice").innerText = "R" + price;
		document.getElementById("breadCrumbCategory").innerText = _category;
		document.getElementById("breadCrumbProduct").innerText = name;
		var storage = firebase.storage();
				var pathReference = storage.ref(url + productId + ".png");
				var source = pathReference.getDownloadURL().then(function(_url) {
					var productImage = document.getElementById("productImage");
				productImage.src = _url;
				productImage.width = "300";
				productImage.height = "300";
				});
				
		
					var divLink = document.createElement('a');
					divLink.href = "../../product.html?product="+name;
				var newdiv = document.createElement('div');   //create a div
				newdiv.id = name;                      //add an id
				newdiv.classList.add("col-sm-6");
				newdiv.classList.add("col-md-5");
				newdiv.classList.add("col-lg-4");
				newdiv.classList.add("item");
				
				var secondDiv = document.createElement('div');
				secondDiv.classList.add("box");
				
	  // ...
		});
	}
	else
	{
		window.location.href = "../../index.html";
	}
	
}

function AddToCart()

{
	var user = firebase.auth().currentUser;
	if(user)
	{
		return firebase.database().ref('/users/' + user.uid).once('value').then(function(snapshot) 
		{
			var quantity = 1;
			if (snapshot.hasChild("cart"))
			{
				var isValid = false;
				snapshot.child("cart").forEach((objectID) =>
				{
					if(objectID.key === product)
					{
						isValid = true;
						objectID.forEach((child) =>
						{
							if(child.key === "quantity")
							{
								quantity = child.val();
								console.log(quantity);
								quantity = quantity + 1;
								Add(product,quantity);
							}
						});
					}
					
					
				});
				if(!isValid)
				{
					Add(product,quantity);
				}
			}
			else
			{
				Add(product,quantity);
			}
		});
	}
	else
	{
		console.log("No User");
	}
}

function Add(name, quantity)
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
				  alert("Successfully added.");
				}
			});
}
function DownloadPDF()
{
	var storage = firebase.storage();
var pathReference = storage.ref('images/products/' + product + '.pdf');

pathReference.getDownloadURL().then(function(url) 
{
  window.open(url);

}).catch(function(error) {
  // Handle any errors
});
	
}
