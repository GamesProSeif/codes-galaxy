import { ERRORS, EVENTS, TOPICS } from '@codes/constants';
import { Code } from '@codes/models';
import { Request, Response } from 'express';
import Route from '../../structures/Route';

export default class CodePOST extends Route {
	public constructor() {
		super({
			method: 'post',
			endpoint: ['/code']
		});
	}

	public async exec(req: Request, res: Response): Promise<void> {
		const codeRepo = this.server.db.getRepository(Code);

		if (!req.body ||
			!req.body.author ||
			!req.body.sharedBy ||
			!req.body.title ||
			!req.body.language ||
			!req.body.content
		) {
			res.status(400).json({ error: ERRORS.ROUTES.CODE_POST.MISSING_DATA });
			return;
		}

		const code = new Code();
		code.author = req.body.author;
		code.sharedBy = req.body.sharedBy;
		code.title = req.body.title;
		code.language = req.body.language;
		code.description = req.body.description;
		code.content = req.body.content;
		code.tags = req.body.tags || [];

		await codeRepo.save(code);
		this.server.logger.info(code.shortid, { topic: TOPICS.TYPEORM, event: EVENTS.CODE_NEW });

		res.status(200).json({ code });
	}
}
