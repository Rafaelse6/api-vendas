import { ICreateOrder } from '@modules/orders/domain/models/ICreateOrder';
import { IOrdersRepository } from '@modules/orders/domain/repositories/IOrdersRepository';
import { EntityRepository, getRepository, Repository } from 'typeorm';
import Order from '../entities/Order';

@EntityRepository(Order)
class OrdersRepository implements IOrdersRepository {
    private ormRepository: Repository<Order>;

    constructor() {
        this.ormRepository = getRepository(Order);
    }

    public async findById(id: string): Promise<Order | undefined> {
        const order = this.ormRepository.findOne(id, {
            relations: ['order_products', 'customer'],
        });
        return order;
    }

    public async create({ customer, products }: ICreateOrder): Promise<Order> {
        const order = this.ormRepository.create({
            customer,
            order_products: products,
        });

        await this.ormRepository.save(order);
        return order;
    }
}

export default OrdersRepository;
