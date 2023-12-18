const urlLogin = "http://localhost:5678/api/users/login";




deconnexion();
function deconnexion() {
    if (localStorage.getItem("token")) {
        localStorage.removeItem("token");
    }
}


function login(email, password) {
    fetch(urlLogin, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
        .then(response => {
            if (response.ok) {
                // window.location.href = '../index.html';
                return response.json()
            } else {
                console.error("Erreur dans l’identifiant ou le mot de passe");
                alert("Erreur dans l’identifiant ou le mot de passe")
            }
        })
        .then(data => {
            if (!data) return
            localStorage.setItem("token", data.token)
            window.location.href = '../index.html';
        })
};
document.getElementById('bouton').addEventListener('click', function (e) {
    e.preventDefault();

    const email = document.querySelector(".email").value;
    const password = document.querySelector(".motdepasse").value;


    login(email, password);
});