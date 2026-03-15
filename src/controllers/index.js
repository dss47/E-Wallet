const Loading = (dot, btn, btnText) => {
    if (!btn.disabled) return;
    if (!btn.textContent.startsWith(btnText)) btn.textContent = btnText;
    if (btn.textContent.length < btnText.length + 3)//The size of btnText + "..."
    {
        btn.textContent += dot;
    } else {
        btn.textContent = btnText;
    }
    setTimeout(() => Loading(dot, btn, btnText), 200);
};//We use this to animate buttons text with dots

let LoginBtn = document?.getElementById("Loginbtn");
let SigninBtn = document?.getElementById("Signinbtn");


    LoginBtn?.addEventListener("click", () => {
        if (LoginBtn.disabled) return; //Prevent a second click after releasing the first (No double click)
        LoginBtn.disabled = true;
        Loading(".", LoginBtn, "Chargement");
        setTimeout(() => document.location = "/src/views/login.html"
            , 2000);
    }
    );


    SigninBtn?.addEventListener("click", () => {
        if (SigninBtn.disabled) return;
        SigninBtn.disabled = true;
        Loading(".", SigninBtn, "Chargement");
        setTimeout(() => document.location = "/src/views/signin.html"
            , 2000);
    }
    );


export default Loading;