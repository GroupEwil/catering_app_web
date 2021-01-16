firebase.auth().onAuthStateChanged(function(_user) {
  if (_user) {
    // User is signed in.
	window.location.href = "../../home.html";
  } else {
    // No user is signed in.
  }
});

document.getElementById('loginForm').onsubmit = function() { 
    SignIn();
    return false;
};
function SignIn()
{
	var email = document.getElementById('email').value;
	var password = document.getElementById('password').value;
	  firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
	  // Handle Errors here.
	  var errorCode = error.code;
	  var errorMessage = error.message;
	  console.log("ERROR: " + errorCode +"/" + errorMessage);
	  // ...
	});
}

function LoginWithGoogle()
{
	var provider = new firebase.auth.GoogleAuthProvider();
	provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
		firebase.auth().signInWithPopup(provider).then(function(result) 
		{
			// This gives you a Google Access Token. You can use it to access the Google API.
			var token = result.credential.accessToken;
			// The signed-in user info.
			var user = result.user;
	  // ...
		}).catch(function(error) 
		{
			// Handle Errors here.
			var errorCode = error.code;
			var errorMessage = error.message;
			// The email of the user's account used.
			var email = error.email;
			// The firebase.auth.AuthCredential type that was used.
			var credential = error.credential;
	  // ...
	});
}
function LoginWithFacebook()
{
	var provider = new firebase.auth.FacebookAuthProvider();
	//provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
		firebase.auth().signInWithPopup(provider).then(function(result) {
			  // This gives you a Facebook Access Token. You can use it to access the Facebook API.
			  var token = result.credential.accessToken;
			  // The signed-in user info.
			  var user = result.user;
			  // ...
		}).catch(function(error) 
		{
			  // Handle Errors here.
			  var errorCode = error.code;
			  var errorMessage = error.message;
			  // The email of the user's account used.
			  var email = error.email;
			  // The firebase.auth.AuthCredential type that was used.
			  var credential = error.credential;
			  // ...
		});
}
