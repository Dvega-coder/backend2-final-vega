
const socket = io();
const productForm = document.getElementById("productForm");
const productList = document.getElementById("productList");

//  Agregar producto
productForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value.trim();
  const price = Number(document.getElementById("price").value);
  const category = document.getElementById("category").value.trim();
  const description = document.getElementById("description")?.value.trim() || "";
  const stock = Number(document.getElementById("stock")?.value) || 0;

  if (!title || isNaN(price) || !category) {
    return alert("⚠️ Completá los campos obligatorios: título, precio y categoría.");
  }

  try {
    const response = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, price, category, description, stock }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Error al crear producto:", data);
      return alert(`❌ Error: ${data.error || "No se pudo crear el producto"}`);
    }

    alert("✅ Producto agregado correctamente");
    productForm.reset();
  } catch (err) {
    console.error("Error de red o fetch:", err);
    alert("❌ Error al conectar con el servidor");
  }
});

// Eliminar producto
productList.addEventListener("click", async (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const li = e.target.closest("li");
    const id = li.dataset.id;

    if (!confirm("¿Seguro que querés eliminar este producto?")) return;

    try {
      const response = await fetch(`/api/products/${id}`, { method: "DELETE" });
      const data = await response.json();

      if (!response.ok) {
        console.error("Error al eliminar producto:", data);
        return alert(`❌ Error: ${data.error || "No se pudo eliminar"}`);
      }

      alert("🗑️ Producto eliminado correctamente");
    } catch (err) {
      console.error("Error de red o fetch:", err);
      alert("❌ Error al conectar con el servidor");
    }
  }
});

//  Actualizar lista en tiempo real
socket.on("products", (products) => {
  productList.innerHTML = "";
  products.forEach((p) => {
    const li = document.createElement("li");
    li.dataset.id = p._id;
    li.innerHTML = `
      <strong>${p.title}</strong> - $${p.price} (${p.category})
      <button class="delete-btn">Eliminar</button>
    `;
    productList.appendChild(li);
  });
});


