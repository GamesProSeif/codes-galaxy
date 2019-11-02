import { Request, Response } from 'express';
import Route from '../../structures/Route';
import Code from '../../models/Code';
import { MESSAGES } from '../../../util/constants';

export default class CodeIdGET extends Route {
	public constructor() {
		super({
			method: 'get',
			endpoint: ['/code/:id']
		});
	}

	public async exec(req: Request, res: Response): Promise<void> {
		const codeRepo = this.db.getRepository(Code);
		const code = await codeRepo.findOne({ shortid: req.params.id });

		if (!code) {
			res.status(404).json({ error: MESSAGES.ROUTES.CODE_ID_GET.NOT_FOUND });
			return;
		}

		res.status(200).json({ code });
	}
}
