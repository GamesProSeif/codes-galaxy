import { stripIndents } from 'common-tags';
import { Command } from 'discord-akairo';
import { Message, Util } from 'discord.js';
import fetch from 'node-fetch';
import { inspect } from 'util';
import { MESSAGES } from '@codes/constants';

const CODE_BLOCK_REGEX = /```(?:(?<lang>\S+)\n)?\s?(?<code>[^]+?)\s?```/;

export default class EvalCommand extends Command {
	constructor() {
		super('eval', {
			aliases: ['eval', 'ev'],
			args: [
				{
					flag: ['--silent', '-s'],
					id: 'silent',
					match: 'flag'
				},
				{
					id: 'code',
					match: 'rest',
					prompt: {
						start: MESSAGES.COMMANDS.UTIL.EVAL.PROMPT.START,
						retry: MESSAGES.COMMANDS.UTIL.EVAL.PROMPT.RETRY
					},
					type: (_, content: string) => {
						if (CODE_BLOCK_REGEX.test(content)) {
							return CODE_BLOCK_REGEX.exec(content)!.groups!.code;
						}
						return content;
					}
				}
			],
			category: 'util',
			description: {
				content: MESSAGES.COMMANDS.UTIL.EVAL.DESCRIPTION,
				usage: '[--silent] <code>'
			},
			ownerOnly: true
		});
	}

	public async exec(message: Message, args: any) {
		try {
			// eslint-disable-next-line no-eval
			let evaled = await eval(args.code);

			if (!args.silent) {
				let code = '';
				if (typeof evaled !== 'string') {
					evaled = inspect(evaled);
					code = 'js';
				}
				if (evaled.length >= 2000) {
					const response = await fetch('https://hasteb.in/documents', {
						body: evaled,
						method: 'POST'
					});
					const { key } = await response.json();
					return message.reply(
						`**Output was too long and was uploaded to https://hasteb.in/${key}.js**`
					);
				}
				return message.util!.send(Util.cleanContent(evaled, message), {
					code
				});
			}
			return evaled;
		} catch (err) {
			message.util!.send(
				stripIndents`
				\`ERROR\`
				\`\`\`
				${Util.cleanContent(err, message)}
				\`\`\`
				`
			);
		}
	}
}
