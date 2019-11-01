import CodesClient from './client/CodesClient';

const client = new CodesClient(['252829167320694784', '348143440405725184']);
client.start(process.env.DISCORD_TOKEN!);
