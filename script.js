let productos = [];
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

document.addEventListener("DOMContentLoaded", () => {
  fetch("https://fakestoreapi.com/products")
    .then(response => response.json())
    .then(data => {
      productos = data;
      mostrarProductos();
      actualizarCarrito();
    })
    .catch(error => {
      console.error("Hubo un error al obtener los productos:", error);
    });
});

function mostrarProductos() {
  const contenedor = document.getElementById("productos");
  contenedor.innerHTML = "";
  productos.forEach(producto => {
    const div = document.createElement("div");
    div.className = "producto";
    div.innerHTML = `
      <img src="${producto.image}" alt="${producto.title}">
      <h3>${producto.title}</h3>
      <p>$${producto.price}</p>
      <button onclick="agregarAlCarrito(${producto.id})">Agregar al carrito</button>
    `;
    contenedor.appendChild(div);
  });
}

function agregarAlCarrito(id) {
  const producto = productos.find(p => p.id === id);
  const existe = carrito.find(p => p.id === id);
  if (existe) {
    existe.cantidad++;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }
  guardarCarrito();
  actualizarCarrito();
}

function eliminarProducto(id) {
  carrito = carrito.filter(p => p.id !== id);
  guardarCarrito();
  actualizarCarrito();
}

function vaciarCarrito() {
  carrito = [];
  guardarCarrito();
  actualizarCarrito();
}

function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

function actualizarCarrito() {
  const lista = document.getElementById("carrito");
  lista.innerHTML = "";

  let total = 0;
  let cantidadTotal = 0;

  carrito.forEach(producto => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${producto.title} (x${producto.cantidad}) - $${producto.price * producto.cantidad}</span>
      <button onclick="eliminarProducto(${producto.id})">Eliminar</button>
    `;
    lista.appendChild(li);
    total += producto.price * producto.cantidad;
    cantidadTotal += producto.cantidad;
  });

  const resumen = document.createElement("div");
  resumen.className = "carrito-resumen";
  resumen.innerHTML = `
    <p><strong>${cantidadTotal}</strong> producto(s) agregado(s)</p>
    <p><strong>Total: $${total.toFixed(2)}</strong></p>
    <button onclick="vaciarCarrito()">Vaciar carrito</button>
  `;
  lista.appendChild(resumen);
}
