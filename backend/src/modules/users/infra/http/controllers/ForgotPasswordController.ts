import { Request, Response } from 'express';
import SendForgotEmailService from '../../../services/SendForgotPasswordEmailService.ts';

export default class ForgotPasswordController {
    public async create(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { email } = request.body;

        const sendForgotPasswordEmail = new SendForgotEmailService();

        await sendForgotPasswordEmail.execute({ email });

        return response.status(204).json();
    }
}
