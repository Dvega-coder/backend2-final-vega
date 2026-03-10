


const cartId = CART_ID;

//  Actualizar cantidad
document.querySelectorAll(".update-btn").forEach((btn) => {
  btn.addEventListener("click", async (e) => {
    const row = e.target.closest("tr");
    const productId = row.dataset.id;
    const qty = Number(row.querySelector(".quantity-input").value);

    if (!Number.isInteger(qty) || qty < 1) {
      return alert("⚠️ La cantidad debe ser un número mayor o igual a 1.");
    }

    try {
      const res = await fetch(`/api/carts/${cartId}/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: qty }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      location.reload();
    } catch (err) {
      console.error(err);
      alert("❌ No se pudo actualizar la cantidad.");
    }
  });
});

// Eliminar producto individual
document.querySelectorAll(".remove-btn").forEach((btn) => {
  btn.addEventListener("click", async (e) => {
    const row = e.target.closest("tr");
    const productId = row.dataset.id;

    if (!confirm("¿Eliminar este producto del carrito?")) return;

    try {
      const res = await fetch(`/api/carts/${cartId}/products/${productId}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      location.reload();
    } catch (err) {
      console.error(err);
      alert("❌ No se pudo eliminar el producto.");
    }
  });
});

//  Vaciar carrito
document.getElementById("clearCart")?.addEventListener("click", async () => {
  if (!confirm("¿Vaciar todo el carrito?")) return;

  try {
    const res = await fetch(`/api/carts/${cartId}`, {
      method: "DELETE",
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error);

    location.reload();
  } catch (err) {
    console.error(err);
    alert("❌ No se pudo vaciar el carrito.");
  }
});

//  Finalizar compra
document.getElementById("purchaseCart")?.addEventListener("click", async () => {
  if (!confirm("¿Confirmar la compra de todos los productos disponibles?")) return;

  // Obtener el token JWT
  const token = localStorage.getItem("jwtToken");
  
  if (!token) {
    alert("⚠️ Necesitás estar logueado para comprar. Redirigiendo al login...");
    window.location.href = "/login";
    return;
  }

  try {
    const res = await fetch(`/api/carts/${cartId}/purchase`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.error || "Error al procesar la compra");
    }

    // Mostrar resultado de la compra
    let message = `✅ ${data.message}\n\n`;
    message += `🎫 Ticket: ${data.ticket.code}\n`;
    message += `💰 Total: $${data.ticket.amount}\n`;
    
    if (data.productsNotPurchased && data.productsNotPurchased.length > 0) {
      message += `\n⚠️ Productos sin stock:\n`;
      data.productsNotPurchased.forEach(p => {
        message += `- ${p.title || 'Producto'}: ${p.reason}\n`;
      });
    }

    alert(message);
    location.reload();
  } catch (err) {
    console.error(err);
    alert(`❌ ${err.message}`);
  }
});
