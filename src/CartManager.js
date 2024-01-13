import fs from 'fs'
import ProductManager from './ProductManager.js'

class CartManager{
 constructor(path){
    this.path = path
    this.instanceProduct = new ProductManager('./products.json')
 }

 async getCarts(){
    try {
        const carts = await fs.promises.readFile(this.path,'utf-8')
        const cartsParse = JSON.parse(carts)
        return cartsParse
    } catch (e) {
        await fs.promises.writeFile(this.path,'[]')
        return []
    }
 }

 async addCart(){
    const carts = await this.getCarts()
    const newCart = {
        id: carts.length +1,
        products: []        
    }
    carts.push(newCart)
    await fs.promises.writeFile(this.path,JSON.stringify(carts,null,2))
    return newCart
 }
 async getCartById(id){
    const carts = await this.getCarts()
    const findCart = carts.find(el=>el.id===id)
    if(!findCart){
        throw new Error('CART NOT FOUND')
    }
    return findCart
 }
 async addProductInCart(idCart,idProduct){
    const carts = await this.getCarts()
    const findCart = carts.find(el=>el.id===idCart)
    if(!findCart){
        throw new Error('CART NOT FOUND')
    }
    const productExist = await this.instanceProduct.getProductById(idProduct)

    const existProductInCart = findCart.products.find(el=>el.product===idProduct)
    if(existProductInCart){
        existProductInCart.quantity += 1
    }
    else{
        const newProduct = {
            product:productExist.id,
            quantity:1
        }
        findCart.products.push(newProduct)
    }
    await fs.promises.writeFile(this.path,JSON.stringify(carts,null,2))
    return findCart
 }
 async getProductsInCart(idCart){
    const cart = await this.getCartById(idCart)
    const productsInCart = {
        idCart,
        products:[]
    }
    for(let i = 0; i<cart.products.length; i++){
        const product = await this.instanceProduct.getProductById(cart.products[i].product)
        productsInCart.products.push(product)
    }
    return productsInCart
 }
 //FALTA MODIFICAR
 async updateCart(id,data){
    const carts = await this.getCarts()
    const findCart = carts.find(el=>el.id===id)
    if(!findCart){
        throw new Error('CART NOT FOUND')
    }
    findCart.title = data.title || findCart.title
    findCart.description = data.description || findCart.description
    findCart.price = data.price || findCart.price
    findCart.thumbnail = data.thumbnail || findCart.thumbnail
    findCart.code = data.code || findCart.code
    findCart.stock = data.stock || findCart.stock
    await fs.promises.writeFile(this.path,JSON.stringify(carts,null,2))
    const cartUpdated = this.getCartById(id)
    return cartUpdated
 }
 async deleteCart(id){
    const carts = await this.getCarts()
    const findCart = carts.findIndex(el=>el.id===id)
    if(findCart===-1){
        throw new Error('PRODUCT NOT FOUND')
    }
    carts.splice(findCart,1)
    await fs.promises.writeFile(this.path,JSON.stringify(carts,null,2))
 }

}
export default CartManager;