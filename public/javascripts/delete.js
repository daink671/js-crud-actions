document.getElementById("delete").onclick = function () {
    const product = document.getElementById("product-id").value;
    axios
        .delete(`/api/products/${product}`)
        .then(processResult)
        .catch((err) => {
            if (err.response.status === 404) {
                notFound();
            }
        });
}

function processResult() {
    window.alert("Product deleted!");
}

function notFound() {
  resetContentArea();

  const h2 = document.querySelector("h2.hidden");
  h2.className = "";
}

function resetContentArea() {
  document.querySelector("h2").className = "hidden";
  const currentProduct = document.getElementById("product-result");
  if (currentProduct) {
    currentProduct.remove();
  }
  const productList = document.getElementById("product-list");
  if (productList) {
    productList.remove();
  }
}

