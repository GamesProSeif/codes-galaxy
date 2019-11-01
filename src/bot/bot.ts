import CodesClient from './client/CodesClient';

export default async () => {
	const client = new CodesClient(['252829167320694784', '348143440405725184']);
	await client.start(process.env.DISCORD_TOKEN!);
	return client;
};
