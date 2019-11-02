import { Request, Response } from 'express';
import Route from '../../structures/Route';
import Code from '../../models/Code';
import { MESSAGES } from '../../../util/constants';

export default class CodeGET extends Route {
	public constructor() {
		super({
			method: 'get',
			endpoint: ['/code']
		});
	}

	public async exec(req: Request, res: Response): Promise<void> {
		const codeRepo = this.db.getRepository(Code);
		const codes = await codeRepo.find({
			select: ['id', 'shortid', 'title', 'description', 'language', 'tags']
		});

		if (!codes.length) {
			res.status(404).json({ error: MESSAGES.ROUTES.CODE_GET.NOT_FOUND });
			return;
		}

		res.status(200).json({ codes });
	}
}
