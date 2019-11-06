import { Request, Response } from 'express';
import Route from '../../structures/Route';

export default class DiscordLoginGET extends Route {
	constructor() {
		super({
			method: 'get',
			endpoint: ['/discord/login']
		});
	}

	public exec(req: Request, res: Response) {
		const redirect = this.server.baseURL(req.secure, req.hostname, '/api/discord/callback');

		const params = new URLSearchParams();
		params.append('client_id', this.server.config.discord.clientId);
		params.append('scope', 'identify email');
		params.append('response_type', 'code');
		params.append('redirect_uri', redirect);

		res.redirect(`https://discordapp.com/api/oauth2/authorize?${params}`);
	}
}
