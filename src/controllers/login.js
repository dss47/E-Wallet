import Loading from "/src/controllers/index.js";
import { finsuserbymail } from "/src/controllers/database.js";

let emailInp = document.getElementById("mail");
let passInp = document.getElementById("password");
let connectBtn = document.getElementById("submitbtn");
let resultMsg = document.getElementById("result");
let togglePass = document.querySelector(".toggle-password");

const handleLogin = () => {
    if (connectBtn.disabled) return; //We need to make sure its clicked first

    resultMsg.textContent = ""; //To remove previous errors

    let e = emailInp?.value;
    let p = passInp?.value;

    if (e === "" || p === "") {
        connectBtn.disabled = false;
        return resultMsg.textContent = "Veuillez remplir tous les champs ";
    }

    connectBtn.disabled = true; //The button is clicked, we need to lock it
    Loading(".", connectBtn, "Connexion en cours");

    if (finsuserbymail(e, p)) {
        const dbUser = finsuserbymail(e, p);
        const savedUser = localStorage.getItem("userData_" + e);
        sessionStorage.setItem("userSession", savedUser ? savedUser : JSON.stringify(dbUser));
        setTimeout(() => document.location = "/src/views/dashboard.html", 2000);
    }
    else {
        setTimeout(() => {
            if (resultMsg) resultMsg.textContent = "Email ou Mot de Passe incorrect !"
            connectBtn.disabled = false;
            connectBtn.textContent = "Se connecter";
        }, 2000);

    }
}


if (connectBtn) connectBtn.addEventListener("click", handleLogin);

togglePass.addEventListener("click", () => {
    if (passInp.type === "password") {
        passInp.type = "text";//Changing the type to a regular text input 
    } else {
        passInp.type = "password";//Bringing it back to a crypted password input
    }
});
