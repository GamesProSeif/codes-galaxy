import { Request, Response } from 'express';
import Route from '../../structures/Route';
import { Code } from '@codes/models';
import { TOPICS, EVENTS } from '../../util/logger';
import { MESSAGES } from '../../util/constants';

export default class CodeIdDELETE extends Route {
	public constructor() {
		super({
			method: 'delete',
			endpoint: ['/code/:id']
		});
	}

	public async exec(req: Request, res: Response): Promise<void> {
		const codeRepo = this.db.getRepository(Code);
		const code = await codeRepo.findOne({ shortid: req.params.id });

		if (!code) {
			res.status(404).json({ error: MESSAGES.ROUTES.CODE_ID_DELETE.NOT_FOUND });
			return;
		}

		await codeRepo.remove(code);
		this.logger.info(code.shortid, { topic: TOPICS.TYPEORM, event: EVENTS.CODE_DELETE });

		res.status(200).json({ code });
	}
}
