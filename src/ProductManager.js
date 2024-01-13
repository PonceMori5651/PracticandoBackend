import fs from 'fs'
class ProductManager{
 constructor(path){
    this.path = path
 }

 async getProducts(){
    try {
        const products = await fs.promises.readFile(this.path,'utf-8')
        const productsParse = JSON.parse(products)
        return productsParse
    } catch (e) {
        await fs.promises.writeFile(this.path,'[]')
        return []
    }
 }

 async addProduct(data){
    const products = await this.getProducts()
    const newProduct = {
        id: products.length +1,
        title: data.title,
        description: data.description,
        price: data.price,
        thumbnails: data.thumbnails ?? [],
        status: data.status ?? true,
        code: data.code,
        stock: data.stock,
        category: data.category        
    }
    if(!data.title || data.title == '' ||
    !data.description || data.description == '' ||
    !data.price || data.price == '' ||
    !data.code || data.code == '' ||
    !data.stock || data.stock == '' ||
    !data.category || data.category == '' ||
    !data.status || data.status == ''){
        throw new Error('ERROR TODOS LOS CAMPOS SON OBLIGATORIOS MENOS EL THUMBNAILS')
    }
    const findCode = products.find(el=>el.code === data.code)
    if(findCode){
        throw new Error('ERROR CODE REPETIDO')
    }
    products.push(newProduct)
    await fs.promises.writeFile(this.path,JSON.stringify(products,null,2))
    return newProduct
 }
 async getProductById(id){
    const products = await this.getProducts()
    const findProduct = products.find(el=>el.id===id)
    if(!findProduct){
        throw new Error('PRODUCT NOT FOUND')
    }
    return findProduct
 }
 async updateProduct(id,data){
    const products = await this.getProducts()
    const findProduct = products.find(el=>el.id===id)
    if(!findProduct){
        throw new Error('PRODUCT NOT FOUND')
    }
    findProduct.title = data.title || findProduct.title
    findProduct.description = data.description || findProduct.description
    findProduct.price = data.price || findProduct.price
    findProduct.thumbnail = data.thumbnail || findProduct.thumbnail
    findProduct.code = data.code || findProduct.code
    findProduct.stock = data.stock || findProduct.stock
    await fs.promises.writeFile(this.path,JSON.stringify(products,null,2))
    const productUpdated = this.getProductById(id)
    return productUpdated
 }
 async deleteProduct(id){
    const products = await this.getProducts()
    const findProduct = products.findIndex(el=>el.id===id)
    if(findProduct===-1){
        throw new Error('PRODUCT NOT FOUND')
    }
    products.splice(findProduct,1)
    await fs.promises.writeFile(this.path,JSON.stringify(products,null,2))
 }
}
export default ProductManager;

/*
const instance = new ProductManager('./products.json')
const product1 = {
    title: "Lavadora Modificado",
    description: "Lavadora ultimo modelo Modificado",
    price: 2141,
    thumbnail: "sin imagen Modificado",
    code: "abc12345",
    stock: 23    
}
instance.updateProduct(1,product1).then((result)=>{
    //console.log(result)
})
/*instance.getProducts().then((products)=>{
    console.log(products)
})*/
