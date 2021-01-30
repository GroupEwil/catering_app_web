var pageCount = 0;
var user;
var featured = [];

firebase.auth().onAuthStateChanged(function(_user) {
  if (_user) {
    // User is signed in.
	user = _user;
	console.log("User " +user.uid + " logged in");
	VerifyUser();
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





