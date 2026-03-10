
// Recuperar o crear carrito
let CART_ID = localStorage.getItem("cartId");

async function ensureCart() {
  try {
    if (!CART_ID) {
      const res = await fetch("/api/carts", { method: "POST" });
      const data = await res.json();

      if (data.status === "success") {
        CART_ID = data.payload._id;
        localStorage.setItem("cartId", CART_ID);
        console.log("🛒 Nuevo carrito creado:", CART_ID);
      } else {
        console.error("Error al crear carrito:", data);
      }
    }
  } catch (err) {
    console.error("❌ Error al asegurar carrito:", err);
  }
}

ensureCart();

//   botón "Agregar al carrito"
document.getElementById("addToCart")?.addEventListener("click", async (e) => {
  const productId = e.target.dataset.id;

  if (!CART_ID) {
    alert("⚠️ No hay carrito activo. Recargá la página e intentá de nuevo.");
    return;
  }

  try {
    const res = await fetch(`/api/carts/${CART_ID}/products/${productId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (!res.ok) {
      alert("❌ No se pudo agregar el producto.");
      console.error(data);
      return;
    }

    alert("🛒 Producto agregado al carrito.");
  } catch (err) {
    console.error("❌ Error al agregar al carrito:", err);
    alert("Error al comunicarse con el servidor.");
  }
});
