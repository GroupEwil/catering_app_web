var user;
firebase.auth().onAuthStateChanged(function(_user) {
  if (_user) {
	window.location.href = "../../home.html";
  } else {
  }
});
document.getElementById('loginLink').onclick = function() { 
    LoadSignIn();
    return false;
};
document.getElementById('signupLink').onclick = function() { 
    LoadSignUp();
    return false;
};

window.onload = function(e){ 
    Authenticate();
	if(user)
	{
		console.log("User");
		window.location.href = "../../home.html";
	}
	else
	{
		console.log("No User");
	}
}
function LoadSignIn()
{
	window.location.href = "../../login.html";
}

function LoadSignUp()
{
	window.location.href = "../../signup.html";
}
function Authenticate()
{
	user = firebase.auth().currentUser;
}