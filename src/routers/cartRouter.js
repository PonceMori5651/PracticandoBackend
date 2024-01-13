import {Router} from 'express'
import CartManager from '../CartManager.js'
const instanceCart = new CartManager('./carts.json')
const cartRouter = new Router()

cartRouter.post('/',async (req,res)=>{
    const cartCreated = await instanceCart.addCart()
    return res.status(201).json(cartCreated)
})

cartRouter.get('/:cid', async (req,res)=>{
    try {
        const {cid} = req.params
        const productsInCart = await instanceCart.getProductsInCart(Number(cid))
        return res.status(200).json(productsInCart)
    } catch (e) {
        return res.status(404).json({
            error: e.message
        })
    }
})

cartRouter.post('/:cid/product/:pid',async (req,res)=>{
    try {
        const {cid} = req.params
        const {pid} = req.params
        const productInCartCreated = await instanceCart.addProductInCart(Number(cid),Number(pid))
        return res.status(201).json(productInCartCreated)
    } catch (e) {
        return res.status(404).json({
            error: e.message
        })
    }
})

export default cartRouter