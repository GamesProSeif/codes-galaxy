/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-var-requires */
import { MESSAGES } from '@codes/constants';
import { User } from '@codes/models';
import { Request, Response } from 'express';
import fetch from 'node-fetch';
import Route from '../../structures/Route';

const btoa = require('btoa');

export default class DiscordCallbackGET extends Route {
	constructor() {
		super({
			method: 'get',
			endpoint: ['/discord/callback']
		});
	}

	public async exec(req: Request, res: Response) {
		if (!req.query.code) {
			res.status(400).json({ error: MESSAGES.ROUTES.DISCORD_CALLBACK_GET.NO_CODE });
			return;
		}

		const userRepo = this.server.db.getRepository(User);
		const creds = btoa(`${this.server.config.discord.clientId}:${this.server.config.discord.clientSecret}`);
		const redirect = this.server.baseURL(req.secure, req.hostname, '/api/discord/callback');

		const params = new URLSearchParams();
		params.append('grant_type', 'authorization_code');
		params.append('redirect_uri', redirect);
		params.append('code', req.query.code);

		const response = await fetch(
			`https://discordapp.com/api/oauth2/token?${params}`,
			{
				method: 'POST',
				headers: {
					Authorization: `Basic ${creds}`
				}
			}
		);

		const tokenInfo = await response.json();

		res.json(tokenInfo);
		if (response.status !== 200) return;

		const userInfo = await (await fetch(`https://discordapp.com/api/users/@me`, {
			headers: {
				Authorization: `${tokenInfo.token_type} ${tokenInfo.access_token}`
			}
		})).json();

		let user = await userRepo.findOne({ discord_id: userInfo.id });
		if (user) {
			user.access_token = tokenInfo.access_token;
			user.refresh_token = tokenInfo.refresh_token;
			await userRepo.save(user);
		} else {
			user = new User();
			user.discord_id = userInfo.id;
			user.email = userInfo.email;
			user.access_token = tokenInfo.access_token;
			user.refresh_token = tokenInfo.refresh_token;
			await userRepo.save(user);
		}

		// const ipcRes = await this.server.ipc.sendTo('bot', {
		// 	type: IPC_TYPE.MEMBER,
		// 	member_id: userInfo.id,
		// 	guild_id: this.server.config.discord.serverId
		// });
		// console.log(ipcRes);
	}
}
