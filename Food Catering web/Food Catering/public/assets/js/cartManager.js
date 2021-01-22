
firebase.auth().onAuthStateChanged(function(_user) {
  if (_user) {
    // User is signed in.
	user = _user;
	//PopulateCatalogue();
  } else {
    // No user is signed in.
	window.location.href = "../../index.html";
  }
});
function Authenticate()
{
	user = firebase.auth().currentUser;
}
function LoadCart()
{
	window.location.href = "../../cart.html";
}

function PopulateCatalogue()
{
	Authenticate();
	if(user)
	{
		var database = firebase.database();
		var userId = firebase.auth().currentUser.uid;
		var dropdown = document.getElementById("navMenu");
		return firebase.database().ref('/categories').once('value').then(function(snapshot) 
		{
			snapshot.forEach((child) => 
			{
				var record = child.key;
				var newdiv = document.createElement('a');   //create a div
				newdiv.id = record;                      //add an id
				newdiv.classList.add("dropdown-item");
				newdiv.classList.add("dropdown-items");
				newdiv.href = "../../products.html?category="+record;
				newdiv.innerText = record;
				dropdown.appendChild(newdiv);
			});          
			
	  // ...
		});
	}
	else
	{
		window.location.href = "../../index.html";
	}
	
}

