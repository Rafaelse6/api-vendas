import AppError from '@shared/errors/AppError';
import { compare } from 'bcryptjs';
import { sign, Secret } from 'jsonwebtoken';
import authConfig from '@config/auth';
import { ICreateSession } from '../domain/models/ICreateSession';
import { IUserAuthenticated } from '../domain/models/IUserAuthenticated';
import { IUsersRepository } from '../domain/repositories/IUsersRepository';
import { injectable, inject } from 'tsyringe';

@injectable()
class CreateSessionsService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
    ) {}

    public async execute({
        email,
        password,
    }: ICreateSession): Promise<IUserAuthenticated> {
        const user = await this.usersRepository.findByEmail(email);

        if (!user) {
            throw new AppError('Incorret e-mail/password combination', 401);
        }

        const passwordConfirmerd = await compare(password, user.password);

        if (!passwordConfirmerd) {
            throw new AppError('Incorret e-mail/password combination', 401);
        }

        const token = sign({}, authConfig.jwt.secret as Secret, {
            subject: user.id,
            expiresIn: authConfig.jwt.expiresIn,
        });

        return {
            user,
            token,
        };
    }
}

export default CreateSessionsService;
