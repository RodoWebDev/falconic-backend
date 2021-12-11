import { ApiProperty } from '@nestjs/swagger';

export class Slider {
	constructor(object: any) {
		this.title = object.title;
		this.btnTitle = object.btnTitle;
	}

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

export class Pocket {
	constructor(object: any) {
		this.title = object.title;
		this.desc = object.desc;
	}

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
}

class AboutList {
	constructor(object: any) {
		this.title = object.title;
		this.list = object.list;
	}

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

export class About {
	constructor(object: any) {
		this.desc = object.desc;
	}

	@ApiProperty({
		type: String,
		required: true,
	})
	desc: string;

	@ApiProperty({
		type: AboutList,
		required: true,
	})
	list: AboutList;
}

export class SectionDto {
	constructor(object: any) {
		this.id = object.id;
		this.type = object.type;
		this.page = object.page;
		this.originalname = object.originalname;
		this.title = object.title;
		this.desc = object.desc;
		this.btnTitle = object.btnTitle;
		this.imgUrl = object.imgUrl;
		this.videoUrl = object.videoUrl;
		this.slider = object.slider;
		this.list = object.list;
	}

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

export class Tab {
	constructor(object: any) {
		this.id = object.id;
		this.type = object.type;
		this.page = object.page;
		this.originalname = object.originalname;
		this.title = object.title;
		this.btnTitle = object.btnTitle;
		this.imgUrl = object.imgUrl;
	}

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
export class TabsDto {
	constructor(object: any) {
		this.id = object.id;
		this.type = object.type;
		this.page = object.page;
		this.tabs = object.tabs;
	}

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
		type: AboutList,
		required: true,
	})
	tabs: [Tab];
}
class Features {
	constructor(object: any) {
		this.highlight = object.highlight;
		this.desc = object.desc;
	}

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
export class CardDto {
	constructor(object: any) {
		this.id = object.id;
		this.imgUrl = object.imgUrl;
		this.title = object.title;
		this.features = object.features;
	}

	@ApiProperty({
		type: String,
		required: true,
	})
	id: string;

	@ApiProperty({
		type: String,
		required: true,
	})
	imgUrl: string;

	@ApiProperty({
		type: String,
		required: true,
	})
	title: string;

	@ApiProperty({
		type: Features,
		required: true,
	})
	features: [Features];
}
export class PagesDto {
	constructor(object: any) {
		this.pageTitle = object.pageTitle;
		this.sections = object.sections;
	}

	@ApiProperty({
		type: String,
		required: true,
	})
	pageTitle: string;

	@ApiProperty({
		type: String,
		required: true,
	})
	sections: [string];
}
