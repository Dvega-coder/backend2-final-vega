

let CART_ID = localStorage.getItem("cartId");

// Crear o recuperar carrito automáticamente
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
    } else {
      console.log("✅ Carrito existente:", CART_ID);
    }
  } catch (err) {
    console.error("❌ Error al asegurar carrito:", err);
  }
}

ensureCart();

//  Agregar producto al carrito
document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("add-to-cart")) {
    const card = e.target.closest(".product-card");
    const productId = card.dataset.id;

    // Obtener la cantidad elegida
    const qtyInput = card.querySelector(".qty-input");
    const qty = Number(qtyInput.value) || 1;

    try {
      const response = await fetch(`/api/carts/${CART_ID}/products/${productId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: qty }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Error al agregar producto:", data);
        alert(`❌ No se pudo agregar: ${data.error || "Error desconocido"}`);
      } else {
        alert(`🛒 Agregado: x${qty}`);
      }
    } catch (err) {
      console.error("❌ Error inesperado:", err);
    }
  }
});

