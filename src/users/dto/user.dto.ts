import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
	constructor(object: any) {
		this.password = object.password;
		this.email = object.email;
		this.firstName = object.firstName;
		this.lastName = object.lastName;
	}
	@ApiProperty()
	password: string;

	@ApiProperty({
		type: String,
		required: true,
	})
	email: string;

	@ApiProperty({
		type: String,
		required: true,
	})
	firstName: string;
	@ApiProperty({
		type: String,
		required: true,
	})
	lastName: string;
}
export class UserResponseDto {
	constructor(object: any) {
		this.password = object.password;
		this.email = object.email;
		this.firstName = object.firstName;
		this.lastName = object.lastName;
	}
	@ApiProperty()
	password: string;

	@ApiProperty({
		type: String,
		required: true,
	})
	email: string;

	@ApiProperty({
		type: String,
		required: true,
	})
	firstName: string;
	@ApiProperty({
		type: String,
		required: true,
	})
	lastName: string;
}

export class LoginDto {
	constructor(object: any) {
		this.firstName = object.firstName;
		this.lastName = object.lastName;
		this.email = object.email;
		this.id = object._id;
	}
	id: string;
	firstName?: string;
	lastName?: string;
	email: string;
}
 