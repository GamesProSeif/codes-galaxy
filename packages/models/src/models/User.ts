import { Entity, ObjectIdColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class User {
	@ObjectIdColumn()
	public id!: string;

	@Column()
	public discord_id!: string;

	@Column()
	public email!: string;

	@Column()
	public access_token!: string;

	@Column()
	public refresh_token!: string;

	@CreateDateColumn()
	public createdAt!: Date;

	@UpdateDateColumn()
	public updatedAt!: Date;
}
