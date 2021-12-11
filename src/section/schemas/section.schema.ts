import * as mongoose from 'mongoose';

const Slider = new mongoose.Schema({
	title: String,
	btnTitle: String
});

const AboutList = new mongoose.Schema({
	title: String,
	list: [String]
});

export const PagesSchema = new mongoose.Schema({
  sections: [{type: mongoose.Types.ObjectId, ref: 'Section'}],
  tabs: [{type: mongoose.Types.ObjectId, ref: 'Tab'}],
  currencies: [{type: mongoose.Types.ObjectId, ref: 'Currency'}],
  card: {type: mongoose.Types.ObjectId, ref: 'Currency'},
  pageTitle: String
});

export const SectionSchema = new mongoose.Schema({
  type: String,
  videoUrl: String,
  imgUrl: String,
  list: [AboutList],
  title: String,
	desc: String,
	btnTitle: String,
  slider: [Slider],
});

const Tab = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now },
	title: String,
	btnTitle: String,
	imgUrl: String,
});

export const TabSchema = new mongoose.Schema({
  type: String,
  items: [Tab],
});

export const CurrencySchema = new mongoose.Schema({
  type: String,
  base: String,
  items: [String],
});

const Features = new mongoose.Schema({
	highlight: String,
	desc: String
});

export const CardSchema = new mongoose.Schema({
  imgUrl: String,
  title: String,
  features: [Features],
});