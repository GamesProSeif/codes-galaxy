import { Connection } from 'typeorm';

declare module '@codes/models' {
	export const Database: Connection;
	export class Code {
		public id: string;
		public shortid: string;
		public author: string;
		public sharedBy: string;
		public title: string;
		public description: string;
		public language: string;
		public content: string;
		public tags: string[];
		public createdAt: Date;
		public updatedAt: Date;
	}
}
