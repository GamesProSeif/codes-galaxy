import { Request, Response } from 'express';
import Route from '../structures/Route';

export default class SubmitInfoPOST extends Route {
	public constructor() {
		super({
			method: 'get',
			endpoint: ['/test']
		});
	}

	public async exec(req: Request, res: Response): Promise<void> {
		this.logger.info('TestGET works');
		res.status(200).json({ message: 'hello world' });
	}
}
