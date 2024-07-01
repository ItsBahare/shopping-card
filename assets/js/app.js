

const productItem = document.querySelector(".product");
const cartItems = document.querySelector("#click");
const cartTotal = document.querySelector(".total-price");
const cartProduct = document.querySelector(".cart-product");
const clearCart = document.querySelector(".clear-cart");

import { productsData } from "./Products.js";

let buttonDom = [];

let cart = [];


//get products
class Products {
  getProducts() {
    return productsData;
  }
}
//display products

class UI {
  displayProducts(product) {
    let result = "";
    product.forEach(item => {
      result += `<div class="cart">
      <div class="pic-product">
      <img class="pic" src="${item.imgUrl}" alt="product">
      </div>
      <div class="title">
        ${item.title}
      </div>

      <div class="price">
      <p>${item.price}</p>
      </div >
      <div class="btn-center">
        <button class="button btn-style"  data-id="${item.id}">Buy Now</button>
      </div>
      </div>`
    });
    productItem.innerHTML = result;
  };
  addToCart() {
    const AddToCartBtn = [...document.querySelectorAll(".btn-style")];
    buttonDom = AddToCartBtn;
    AddToCartBtn.forEach((btn) => {
      const id = btn.dataset.id;
      //check if this product id is in cart or not!
      const isInCart = cart.find((item => item.id === parseInt(id)));
      // console.log(isInCart);
      if (isInCart) {
        btn.disabled = true;
        btn.innerText = "In Cart"
      }
      //not in basket
      btn.addEventListener("click", (event) => {
        event.target.disabled = true;
        event.target.innerText = "In Cart";


        //get all products in localStorage
        const addedProduct = { ...SaveData.getProduct(id), quantity: 1 };
        //add to cart 
        cart = [...cart, addedProduct];
        //save cart to localStorage
        SaveData.saveCart(cart);
        //update cart value
        this.setCartValue(cart);
        //add to cart item
        this.addCartItem(addedProduct);
        //get cart from storage!

      })
    });
  };
  setCartValue(cart) {
    //cartItem
    //cartTotalPrice
    let count = 0;
    const valueCount = cart.reduce((acc, curr) => {
      count += curr.quantity;
      return acc + curr.quantity * curr.price;
    }, 0);
    cartItems.innerText = count;
    cartTotal.innerText = `totalPrice:${valueCount.toFixed(2)}$`;

  };
  addCartItem(cartItem) {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
      <img class=" pic-modal" src="${cartItem.imgUrl}" alt="product">
      <div class="title-modal">
      <p>${cartItem.title}</p>
      <span>${cartItem.price}</span>
      </div>

      <div class="detial">
        <i data-id="${cartItem.id}" class="fa fa-arrow-up"></i>
        <span class="quantity">1</span>
        <i data-id="${cartItem.id}" class="fa fa-arrow-down"></i>
        </div>
        <i data-id="${cartItem.id}" class="fa fa-trash"></i>
    `
    cartProduct.appendChild(div);

  };
  setupApp() {
    //get cart from localStorage
    cart = SaveData.getCart() || [];
    //add cartItem
    cart.forEach((cartItem) => this.addCartItem(cartItem));
    //setValue price and value
    this.setCartValue(cart)

  };
  cartLogic() {
    //clear cart
    clearCart.addEventListener("click", () => {
      this.clearCart();
    });
    cartProduct.addEventListener("click", (event) => {
      if (event.target.classList.contains("fa-arrow-up")) {
        const addQuantity = event.target;
        //get item from cart
        const findQuantity = cart.find((e) => e.id == addQuantity.dataset.id)
        //update cart value
        findQuantity.quantity++;
        //save cart
        this.setCartValue(cart);
        SaveData.saveCart(cart);
        //update cart item in ui 
        addQuantity.nextElementSibling.innerText = findQuantity.quantity;
         console.log(addQuantity.nextElementSibling);

      } else if (event.target.classList.contains("fa-trash")) {
        const removeItem = event.target
        //get item from cart
        const removedItem = cart.find(cItem => cItem.id == removeItem.dataset.id);
        this.removeItem(removedItem.id)
        SaveData.saveCart(cart);

        cartProduct.removeChild(removeItem.parentElement);

      } else if (event.target.classList.contains("fa-arrow-down")) {
        const subQuantity = event.target
        //get item from cart
        const substractedItem = cart.find(cItem => cItem.id == subQuantity.dataset.id);
        if (substractedItem.quantity === 1) {
          this.removeItem(substractedItem.id);
          cartProduct.removeChild(subQuantity.parentElement.parentElement);
          return
        }
        //update cart value
        substractedItem.quantity--;
        this.setCartValue(cart);
        //save cart
        SaveData.saveCart(cart);
        //update quantity in ui
        subQuantity.previousElementSibling.innerText = substractedItem.quantity;
      }
    });
  };
  removeItem(id) {
    // update cart
    cart = cart.filter((cartItem) => cartItem.id !== id);
    //total price and cart item
    this.setCartValue(cart);
    //update localStorage
    SaveData.saveCart(cart);
    //get add to cart btns = update text and disable
    this.getSingleButton(id)

  };
  getSingleButton(id) {
    const button = buttonDom.find((btn) => parseInt(btn.dataset.id) === parseInt(id));
    button.innerText = "Buy Now";
    button.disabled = false;
  };
  clearCart() {
    //remove
    cart.forEach((cItem) => this.removeItem(cItem.id));
    //remove cart content
    while (cartProduct.children.length) {
      cartProduct.removeChild(cartProduct.children[0]);
    }
  };

}

//save in local storage
class SaveData {
  static saveItems(items) {
    localStorage.setItem("Products", JSON.stringify(items));
  };
  static getProduct(id) {
    const _product = JSON.parse(localStorage.getItem("Products"));
    return _product.find((p) => p.id === parseInt(id));
  };
  static saveCart(cart) {
    localStorage.setItem("Cart", JSON.stringify(cart));
  };
  static getCart() {
    return JSON.parse(localStorage.getItem("Cart"));
  }
};



document.addEventListener("DOMContentLoaded", () => {
  const product = new Products;
  const productsData = product.getProducts();
  //set up app
  const ui = new UI;
  ui.setupApp();
  ui.displayProducts(productsData);
  SaveData.saveItems(productsData);
  ui.addToCart();
  ui.cartLogic();


})

const modal = document.querySelector(".modal");
const trigger = document.querySelector("#basket");
const closeButton = document.querySelector(".close-button");
const confirm = document.querySelector(".confirm");

function toggleModal() {
  modal.classList.add("show-modal");
  modal.classList.remove("none");
};
function closeModal() {
  modal.classList.add("none");
  modal.classList.remove("show-modal")
};

function windowOnClick(event) {
  if (event.target === modal) {
    closeModal()
  }
};

trigger.addEventListener("click", toggleModal);
closeButton.addEventListener("click", closeModal);
window.addEventListener("click", windowOnClick);
confirm.addEventListener("click", closeModal);