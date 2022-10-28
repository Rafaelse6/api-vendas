import RedisCache from '@shared/cache/RedisCache';
import AppError from '@shared/errors/AppError';
import { IUpdateProduct } from '../domain/models/IUpdateProduct';
import { IProductsRepository } from '../domain/repositories/IProductsRepository';
import { IProduct } from '../domain/models/IProduct';
import { inject } from 'tsyringe';

class UpdateProductService {
    constructor(
        @inject('ProductsRepository')
        private productsRepository: IProductsRepository,
    ) {}
    public async execute({
        id,
        name,
        price,
        quantity,
    }: IUpdateProduct): Promise<IProduct> {
        const product = await this.productsRepository.findById(id);

        const productExists = await this.productsRepository.findByName(name);

        if (!product) {
            throw new AppError('Product not found.');
        }

        if (productExists && name != product.name) {
            throw new AppError('There is already a product with this name');
        }

        await RedisCache.invalidate('api-vendas-PRODUCT_LIST');

        product.name = name;
        product.price = price;
        product.quantity = quantity;

        await this.productsRepository.save(product);

        return product;
    }
}

export default UpdateProductService;
