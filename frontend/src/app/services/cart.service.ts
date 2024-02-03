import { Injectable } from '@angular/core';
import { Cart } from '../shared/models/Cart';
import { BehaviorSubject, Observable } from 'rxjs';
import { Food } from '../shared/models/Food';
import { CartItem } from '../shared/models/CartItem';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart: Cart = this.getCartFromLocalStorage();
  private cartSubject : BehaviorSubject<Cart> = new BehaviorSubject(this.cart);
  constructor() { }

  // Add to cart Function
  addToCart(food : Food):void{
    let cartItem = this.cart.items
    .find(item => item.food.id === food.id);
    // checking if it already exists
    if(cartItem) return;

    // adding if its not present in cart
    this.cart.items.push(new CartItem(food));
    this.setCartToLocalStorage();
  }

  // remove from cart function
  removeFromCart(foodId : string): void{
    this.cart.items = this.cart.items.filter(item => item.food.id !== foodId);
    console.log('this.cart.items', this.cart.items);
    
    this.setCartToLocalStorage();
  }

  changeQuantity(foodId : string, quantity : number){
    let cartItem = this.cart.items
    .find(item => item.food.id === foodId);

    if(!cartItem) return;

    // increasing quantity
    cartItem.quantity = quantity;
    // pricing based on quantity 
    cartItem.price = quantity * cartItem.food.price;
    this.setCartToLocalStorage();
  }

  // removing all items fromcart
  clearCart(){
    this.cart = new Cart();
    this.setCartToLocalStorage();
  }

  getCartObservables():Observable<Cart>{
    return this.cartSubject.asObservable();
  }

  // save cart details to LocalStorage
  private setCartToLocalStorage():void{
    //Total Price
    this.cart.totalPrice = this.cart.items
    .reduce((prevSum, currentItem) => prevSum + currentItem.price ,0);
    //Total Quantity
    this.cart.totalCount = this.cart.items
    .reduce((prevSum, currentItem) => prevSum + currentItem.quantity ,0);
    // storing in LocalStorage
    const caryJson = JSON.stringify(this.cart);
    console.log('caryJson', caryJson);
    
    localStorage.setItem('Cart',caryJson);
    this.cartSubject.next(this.cart);
  }

  // get cart details from LocalStorage
  private getCartFromLocalStorage(): Cart{
    const cartJson = localStorage.getItem('Cart');
    return cartJson ? JSON.parse(cartJson) : new Cart();
  }
}
