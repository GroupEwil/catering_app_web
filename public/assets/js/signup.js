var country;
var isSignup = false;
var user;
firebase.auth().onAuthStateChanged(function(_user) {
  if (_user) {
    // User is signed in.
	user = _user;
	if(isSignup)
	{
		VerifyUser();
	}
	
	else
	{
		window.location.href = "../../home.html";
	}
		
  } else {
    // No user is signed in.
  }
});
document.getElementById('signupForm').onsubmit = function() { 
    SignUp();
    return false;
};

function VerifyUser()
{
	var ref = firebase.database().ref('users/');
	ref.once('value', function(snapshot) 
	{
	  if (!snapshot.hasChild(user.uid)) 
	  {
			firebase.database().ref('users/' + user.uid).set({
				country: country
			}, function(error) 
			{
				if (error) 
				{
				  // The write failed...
				  alert("Something went wrong: " + error);
				  isSignup = false;
				}
				else 
				{
				  // Data saved successfully!
				  isSignup = false;
				  alert("User succeessfully created.");
				  window.location.href = "../../home.html";
				}
		  });
	  }
  
	});
}
function SignUp()
{
	isSignup = true;
	var email = document.getElementById('email').value;
	var password = document.getElementById('password').value;
	var dropdownCountry = document.getElementById('dropdownCountry');
	var opt = dropdownCountry.options[dropdownCountry.selectedIndex];
	country = opt.text;
	firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
	// Handle Errors here.
	var errorCode = error.code;
	var errorMessage = error.message;
	alert("An error occured: " + errorCode);
  // ...
	});
}