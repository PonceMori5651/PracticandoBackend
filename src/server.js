import express from 'express'
import ProductManager from './ProductManager.js'

// Imports Routers
import productRouter from './routers/productRouter.js'
import cartRouter from './routers/cartRouter.js'


const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))

const PORT = 8080
app.listen(PORT,()=>console.log(`Servidor corriendo en el puerto ${PORT}`))

app.get('/healtcheck',(req,res)=>{
    return res.json({
        status: "running",
        date: new Date()
    })
})



app.use('/api/products',productRouter)
app.use('/api/carts',cartRouter)