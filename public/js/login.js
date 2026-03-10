
// Interceptar el formulario de login para usar JWT
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      // Login API con JWT
      const res = await fetch("/api/sessions/api-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(`❌ Error: ${data.error}`);
        return;
      }

      // Guardar token en localStorage
      localStorage.setItem("jwtToken", data.token);
      
      // Redirigir a home
      window.location.href = "/home";
    } catch (err) {
      console.error(err);
      alert("❌ Error al conectar con el servidor");
    }
  });
}