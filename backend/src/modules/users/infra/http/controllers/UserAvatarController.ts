import { instanceToInstance } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import UpdateUserAvatarService from '../../../services/UpdateUserAvatarService';

export default class UserAvatarController {
    public async update(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const updateAvatar = container.resolve(UpdateUserAvatarService);

        const user = updateAvatar.execute({
            user_id: request.user.id,
            avatarFilename: request.file?.filename as string,
        });

        return response.json(instanceToInstance(user));
    }
}
