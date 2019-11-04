import { Entity, ObjectIdColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { generate } from 'shortid';

@Entity()
export class Code {
	@ObjectIdColumn()
	public id!: string;

	@Column()
	public shortid!: string;

	@Column()
	public author!: string;

	@Column()
	public sharedBy!: string;

	@Column()
	public title!: string;

	@Column()
	public description!: string;

	@Column()
	public language!: string;

	@Column()
	public content!: string;

	@Column()
	public tags!: string[];

	@CreateDateColumn()
	public createdAt!: Date;

	@UpdateDateColumn()
	public updatedAt!: Date;

	public constructor() {
		this.shortid = generate();
	}
}
