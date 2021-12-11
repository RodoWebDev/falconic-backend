import { ApiProperty } from "@nestjs/swagger";
import { Document, Types } from 'mongoose';

class Slider {
	@ApiProperty({
		type: String,
		required: true,
	})
	title: string;

	@ApiProperty({
		type: String,
		required: true,
	})
	btnTitle: string;
}

class Pocket {
	@ApiProperty({
		type: String,
		required: true,
	})
	title: string;

	@ApiProperty({
		type: String,
		required: true,
	})
	desc: string;

	@ApiProperty({
		type: String,
		required: true,
	})
	imgUrl: string;
}

class AboutList {
	@ApiProperty({
		type: String,
		required: true,
	})
	title: string;

	@ApiProperty({
		type: String,
		required: true,
	})
	list: [string];
}

class About {
	@ApiProperty({
		type: String,
		required: true,
	})
	desc: string;

	@ApiProperty({
		type: String,
		required: true,
	})
	imgUrl: string;

	@ApiProperty({
		type: AboutList,
		required: true,
	})
	list: AboutList;
}

export class TabInterface {
	@ApiProperty({
		type: String,
		required: true,
	})
	id: string;

	@ApiProperty({
		type: String,
		required: true,
	})
	type: string;

	@ApiProperty({
		type: String,
		required: true,
	})
	originalname: string;

	@ApiProperty({
		type: String,
		required: true,
	})
	title: string;

	@ApiProperty({
		type: String,
		required: true,
	})
	btnTitle: string;

	@ApiProperty({
		type: String,
		required: true,
	})
	imgUrl: string;
}

export class CurrenciesInterface {
	@ApiProperty({
		type: String,
		required: true,
	})
	id: string;

	@ApiProperty({
		type: String,
		required: true,
	})
	type: string;

	@ApiProperty({
		type: String,
		required: true,
	})
	base: string;

	@ApiProperty({
		type: String,
		required: true,
	})
	items: [string];
}

export class TabsInterface {
	@ApiProperty({
		type: String,
		required: true,
	})
	id: string;

	@ApiProperty({
		type: String,
		required: true,
	})
	type: string;

	@ApiProperty({
		type: String,
		required: true,
	})
	page: string;

	@ApiProperty({
		type: TabInterface,
		required: true,
	})
	items: [TabInterface];
}

export class SectionInterface extends Document {
	@ApiProperty({
		type: String,
		required: true,
	})
	type: string;

	@ApiProperty({
		type: String,
		required: true,
	})
	originalname: string;

	@ApiProperty({
		type: String,
		required: true,
	})
	title: string;

	@ApiProperty({
		type: String,
		required: true,
	})
	desc: string;

	@ApiProperty({
		type: String,
		required: true,
	})
	btnTitle: string;

	@ApiProperty({
		type: String,
		required: true,
	})
	imgUrl: string;

	@ApiProperty({
		type: String,
		required: true,
	})
	videoUrl: string;

	@ApiProperty({
		type: [Slider],
		required: true,
	})
	slider: [Slider];

	@ApiProperty({
		type: AboutList,
		required: true,
	})
	list: [AboutList];
}

class Features {
	@ApiProperty({
		type: String,
		required: true,
	})
	highlight: string;

	@ApiProperty({
		type: String,
		required: true,
	})
	desc: string;
}

export class CardInterface extends Document {
	@ApiProperty({
		type: String,
		required: true,
	})
	title: string;

	@ApiProperty({
		type: String,
		required: true,
	})
	imgUrl: string;

	@ApiProperty({
		type: String,
		required: true,
	})
	originalname: string;

	@ApiProperty({
		type: Features,
		required: true,
	})
	features: [Features];
}

export class PagesInterface extends Document {
	@ApiProperty()
  	sections: [Types.ObjectId];
	@ApiProperty()
  	tabs: [Types.ObjectId];
	@ApiProperty()
  	currencies: [Types.ObjectId];
	@ApiProperty()
  	card: Types.ObjectId;
	@ApiProperty()
  	pageTitle: string;
}