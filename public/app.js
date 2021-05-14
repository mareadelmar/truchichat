let btnIn = document.getElementById("login");
let btnOut = document.getElementById("logout");
let userName = document.querySelector(".name");
let userImg = document.querySelector(".login-img");
let userEmail = document.querySelector(".email");
let btnEnviar = document.getElementById("btn-push");
let listaMensajes = document.querySelector(".messages");
let inputMensaje = document.querySelector(".input-message");
let messageContainer = document.querySelector(".message-container");

let userInfo = {};

btnIn.addEventListener("click", (e) => {
    console.log("entranding");
    googleLogIn();
});

btnOut.addEventListener("click", (e) => {
    console.log("saliending");
    logOut();
});

btnEnviar.addEventListener("click", () => {
    console.log("click en enviar");
    pushMessage();
});

function googleLogIn() {
    console.log("logueando congoogle");

    const provider = new firebase.auth.GoogleAuthProvider();

    firebase
        .auth()
        .signInWithPopup(provider)
        .then((response) => {
            console.log("logueó", response.user.email);
            userInfo = response; // le asigno a mi objeto la info que me devuelve firebase sobre le usuarix logueadx
            console.log(userInfo, "lo que trae el objeto sobre el usuario");
            userCustom();
        })
        .catch((error) => console.log(error.message));
}

function logOut() {
    firebase
        .auth()
        .signOut()
        .then(() => unCustom())
        .catch((error) => console.log(error));
}

function userCustom() {
    userName.innerHTML = `Bienvenide ${userInfo.user.displayName}`;
    userImg.src = userInfo.user.photoURL;
    userEmail.textContent = userInfo.user.email;
    btnIn.style.display = "none";
    btnOut.style.display = "block";
    messageContainer.style.display = "block";
    showMessages();
}

function unCustom() {
    userName.innerHTML = "Bienvenide";
    userImg.src = "images/avatar.png";
    userEmail.textContent = "";
    btnOut.style.display = "none";
    btnIn.style.display = "block";
    messageContainer.style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            userInfo = { user: user };
            userCustom();
        }
    });
});

function pushMessage() {
    const record = {
        avatar: userInfo.user.photoURL,
        name: userInfo.user.displayName,
        text: inputMensaje.value,
    };

    const db = firebase.database();
    const dbRef = db.ref("mensajes");
    const newMessage = dbRef.push();
    newMessage.set(record);

    inputMensaje.value = "";
}

function showMessages() {
    const db = firebase.database();
    const dbRef = db.ref("mensajes");

    dbRef.on("child_added", (snapshot) => {
        console.log(snapshot, "lo que trae el snapshot");
        let item = document.createElement("li");
        item.innerHTML = `<strong class="message-name">${
            snapshot.val().name
        }: </strong> ${snapshot.val().text}`;
        listaMensajes.appendChild(item);

        let items = document.querySelectorAll("li");
        let lastItem = items[items.length - 1];
        lastItem.scrollIntoView();
    });
}
