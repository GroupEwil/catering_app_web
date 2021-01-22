var pageCount = 0;
var user;
var featured = [];

firebase.auth().onAuthStateChanged(function(_user) {
  if (_user) {
    // User is signed in.
	user = _user;
	console.log("User " +user.uid + " logged in");
	VerifyUser();
	PopulateFeatured();
	PopulateProducts();
  } else {
    // No user is signed in.
	window.location.href = "../../index.html";
  }
});


function Authenticate()
{
	user = firebase.auth().currentUser;
}

function VerifyUser()
{
	var ref = firebase.database().ref('users/');
	ref.once('value', function(snapshot) 
	{
	  if (!snapshot.hasChild(user.uid)) 
	  {
			firebase.database().ref('users/' + user.uid).set({
				username: user.displayName,
				email: user.email,
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
				  alert("User succeessfully created.");
				}
		  });
	  }
  
	});
}
function PopulateFeatured()
{
	var database = firebase.database();
		featured = [];
		return firebase.database().ref('/featured').once('value').then(function(snapshot) 
		{
			snapshot.forEach((_child) => 
			{
				featured.push(_child.val());
			});         
			
	  // ...
		});
}
function PopulateProducts()
{
	Authenticate();
	if(user)
	{
		var database = firebase.database();
		var userId = firebase.auth().currentUser.uid;
		var dropdown = document.getElementById("rowFeatured");
		return firebase.database().ref('/products').once('value').then(function(snapshot) 
		{
			snapshot.forEach((_child) => 
			{
				var _category;
				var isValid = false;
				var name;
				var price;
				var productId;
				var url = "images/products/";
				_child.forEach((child) =>
				{
					if((child.key).includes("productID"))
					{
						productId = child.val();
						if(featured.includes(productId))
						{
							isValid = true;
						}
					}
					if(child.key === "productUrl")
					{
						//url = child.val();
						//console.log(url);
					}
					if((child.key).includes("price"))
					{
						price = child.val();
					}
					if(child.key === "name")
					{
						name = child.val();
					}

					
				});
				if(isValid)
				{
					var record = _child.key;
					var divLink = document.createElement('a');
					divLink.href = "../../product.html?product="+record;
				var newdiv = document.createElement('div');   //create a div
				newdiv.id = record;                      //add an id
				newdiv.classList.add("col-sm-6");
				newdiv.classList.add("col-md-5");
				newdiv.classList.add("col-lg-4");
				newdiv.classList.add("item");
				newdiv.classList.add("center");
				newdiv.width = "200";
				newdiv.height = "200";
				var secondDiv = document.createElement('div');
				secondDiv.classList.add("box");
				
				var storage = firebase.storage();
				var pathReference = storage.ref(url + productId + ".png");
				var icon = document.createElement('img');
				icon.classList.add("center");
				var source = pathReference.getDownloadURL().then(function(_url) {
					console.log("Source: " + _url);
				icon.src = _url;
				icon.width = "150";
				icon.height = "150";
				});
				
				
				var h3 = document.createElement('h5');
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




