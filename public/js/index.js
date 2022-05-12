let loginButton = document.getElementById("login")
let username = document.getElementById("username")
let password = document.getElementById("password")
let messageCont = document.getElementById("messageCont");
let invalidUsername = document.getElementById("invalidUsername");
let invalidPassword = document.getElementById("invalidPassword")

function login(event){
    event.preventDefault();
    let xhr = new XMLHttpRequest()
    xhr.addEventListener("load", responseHandler)
    query=`username=${username.value}&password=${password.value}`
    url = `/attempt_login`
    xhr.responseType = "json";   
    xhr.open("POST", url)
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
    xhr.send(query)
}

function responseHandler(){
    if (this.response) {
        if (this.response.success){    
            document.cookie = "true";
            document.location = "/main";
            message.innerText = this.response.message + " Loading your recipes..."
            message.style.color = "green";
            messageCont.classList.remove("d-none");
        } else {
            if (this.response.message == "Server error") {
                message.innerText = this.response.message
                message.style.color = "red";
                messageCont.classList.remove("d-none");
            }
            else {
                invalidUsername.classList.add("d-none");
                invalidPassword.classList.add("d-none");
                if (this.response.message == "This username does not exist!") {
                    invalidUsername.classList.remove("d-none");
                    invalidUsername.innerText = this.response.message;
                } else if (this.response.message == "This password is incorrect!") {
                    invalidPassword.classList.remove("d-none");
                    invalidPassword.innerText = this.response.message;
                }
                if (username.value.length == 0 && password.value.length == 0) {
                    invalidUsername.classList.remove("d-none");
                    invalidPassword.classList.remove("d-none");
                    invalidUsername.innerText = "Please enter your username!";
                    invalidPassword.innerText = "Please enter your password!";
                }
                else if (username.value.length == 0) {
                    invalidUsername.classList.remove("d-none");
                    invalidUsername.innerText = "Please enter your username!";
                } else if (password.value.length == 0) {
                    invalidPassword.classList.remove("d-none");
                    invalidPassword.innerText = "Please enter your password!";
                }
            }
        }
    }
}

function passwordInput(event) {
    invalidPassword.classList.add("d-none");
}

loginButton.addEventListener("click", login);
password.addEventListener("input", passwordInput);