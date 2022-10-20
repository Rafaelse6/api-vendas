import { getCustomRepository } from 'typeorm';
import Product from '../typeorm/entities/Product';
import { ProductRepository } from '../typeorm/repositories/ProductRepository';
import RedisCache from '@shared/cache/RedisCache';

class ListProductService {
    public async execute(): Promise<Product[]> {
        const productsRepository = getCustomRepository(ProductRepository);

        let products = await RedisCache.recover<Product[]>(
            'api-vendas-PRODUCT_LIST',
        );

        if (!products) {
            products = await productsRepository.find();

            await RedisCache.save('api-vendas-PRODUCT_LIST', products);
        }

        await RedisCache.save('teste', 'teste');

        return products;
    }
}

export default ListProductService;
