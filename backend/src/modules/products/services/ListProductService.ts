import RedisCache from '@shared/cache/RedisCache';
import { inject, injectable } from 'tsyringe';
import { IProduct } from '../domain/models/IProduct';
import { IProductsRepository } from '../domain/repositories/IProductsRepository';

@injectable()
class ListProductService {
    constructor(
        @inject('ProductsRepository')
        private productsRepository: IProductsRepository,
    ) {}
    public async execute(): Promise<IProduct[]> {
        let products = await RedisCache.recover<IProduct[]>(
            'api-vendas-PRODUCT_LIST',
        );

        if (!products) {
            products = await this.productsRepository.findAll();

            await RedisCache.save('api-vendas-PRODUCT_LIST', products);
        }

        await RedisCache.save('teste', 'teste');

        return products;
    }
}

export default ListProductService;
