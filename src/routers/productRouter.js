import {Router} from 'express'
import ProductManager from '../ProductManager.js'
import uploader from '../utils/multer.js'
const instanceProduct = new ProductManager('./products.json')
const productRouter = Router()

productRouter.get('/',async(req,res)=>{
    const products = await instanceProduct.getProducts()
    let limit = parseInt(req.query.limit) || products.length
    if(limit<=0){
        limit = products.length
    }
    products.splice(limit)
    return res.status(200).json(products)
})

productRouter.get('/:pid', async (req,res)=>{
    const {pid} = req.params
    const product = await instanceProduct.getProductById(Number(pid))
    if(!product){
        return res.json({
            error:"Product Not Found"
        })
    }
    return res.json(product)
})

productRouter.post('/',uploader.array('thumbnails', 12),async(req,res)=>{
    try {
        const body = req.body
        body.thumbnails = []
        for(let i=0; i<req.files.length;i++){
            body.thumbnails.push(req.files[i].path)
        }
        const productCreated = await instanceProduct.addProduct(body)
        return res.status(201).json(productCreated)
    } catch (e) {
        return res.status(404).json({
            error: e.message
        })
    }
})
productRouter.put('/:pid',async (req,res)=>{
    try {
        const body = req.body
        const {pid} = req.params
        const productUpdated = await instanceProduct.updateProduct(Number(pid),body)
        return res.status(201).json(productUpdated)  
    } catch (e) {
        return res.status(404).json({
            error: e.message
        })
    }
})
productRouter.delete('/:pid',async (req,res)=>{
    try {
        const {pid} = req.params
        await instanceProduct.deleteProduct(Number(pid))
        return res.status(204).json()  
    } catch (e) {
        return res.status(404).json({
            error: e.message
        })
    }
})

export default productRouter