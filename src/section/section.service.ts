import { CallHandler, ExecutionContext, HttpException, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { BlobServiceClient, BlockBlobClient } from '@azure/storage-blob';
import { Model, Types } from 'mongoose';
import { SectionInterface, PagesInterface, TabInterface, TabsInterface, CurrenciesInterface, CardInterface } from './interfaces/section.interface';
import { InjectModel } from '@nestjs/mongoose';
import { CardDto, SectionDto, Tab, TabsDto } from './dto/section.dto';
import { Observable } from 'rxjs';

@Injectable()
export class SectionExtender implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    if (req && req.file && req.body) {
      req.file['name'] = req.body?.name;
      req.file['packageId'] = req.body?.packageId;
    }
    return next.handle();
  }
}

@Injectable()
export class SectionService {
	constructor(
    @InjectModel('Section') private readonly sectionModel: Model<SectionInterface>,
    @InjectModel('Pages') private readonly pagesModel: Model<PagesInterface>,
    @InjectModel('Tab') private readonly tabModel: Model<TabsInterface>,
    @InjectModel('Currency') private readonly currencyModel: Model<CurrenciesInterface>,
    @InjectModel('Card') private readonly cardModel: Model<CardInterface>,
	) { }

  azureConnection = process.env.AZURE_CONNECTION_STRING;
  containerName = process.env.AZURE_CONTAINER_NAME;

  getBlobClient(imageName:string):BlockBlobClient{
    const blobClientService = BlobServiceClient.fromConnectionString(this.azureConnection);
    const containerClient = blobClientService.getContainerClient(this.containerName);
    const blobClient = containerClient.getBlockBlobClient(imageName);
    return blobClient;
  }

  async getfileStream(fileName: string){
    const blobClient = this.getBlobClient(fileName);
    var blobDownloaded = await blobClient.download();
    return blobDownloaded.readableStreamBody;
  }

  async delete(filename: string){
    const blobClient = this.getBlobClient(filename);
    await blobClient.deleteIfExists();
  }

  async savePageToDB(data: any){
    if (data.pageTitle) {
      const page = await this.pagesModel.findOne({ pageTitle: data.pageTitle }).exec();
      if (!page) {
        const tempNewApp = {
          ...data
        };
        const createdApp = new this.pagesModel(tempNewApp);
        return await createdApp.save();
      } else {
        throw new HttpException(
          'PAGES.ADD.DATA_NOT_EXIST',
          HttpStatus.FORBIDDEN,
        );
      }
    } else {
      throw new HttpException(
        'PAGES.ADD.MISSING_MANDATORY_PARAMETERS',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async addCurrency(data: any){
    if (data.type && data.base) {
      const currency = await this.currencyModel.findOne({ type: data.type }).exec();
      if (!currency) {
        const tempNewCurrency = {
          ...data
        };
        const createdCurrency = new this.currencyModel(tempNewCurrency);
        await createdCurrency.save();
        const page = await this.pagesModel.findOne({pageTitle: 'Home'});
        page.currencies.push(createdCurrency._id);
        await page.save();
        return;
      } else {
        currency.type = data.type;
        currency.base = data.base;
        currency.items = data.items;
        return await currency.save();
      }
    } else {
      throw new HttpException(
        'CURRENCIES.ADD.MISSING_MANDATORY_PARAMETERS',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async addTab(data: any){
    if (data.type && data.page) {
      const tab = await this.tabModel.findOne({ type: data.type }).exec();
      if (!tab) {
        const tempNewTab = {
          ...data
        };
        const createdTab = new this.tabModel(tempNewTab);
        await createdTab.save();
        const page = await this.pagesModel.findOne({pageTitle: data.page});
        page.tabs.push(createdTab._id);
        await page.save();
        return;
      } else {
        tab.type = data.type;
        tab.items = data.items;
        return await tab.save();
      }
    } else {
      throw new HttpException(
        'TABS.ADD.MISSING_MANDATORY_PARAMETERS',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async addTabItem(data: TabInterface){
    if (data.type) {
      const tabRes = await this.tabModel.findOne({ type: data.type }).exec();
      if (tabRes) {
        if (data.id === '') {
          tabRes.items.push(data);
        } else {
          const item = tabRes.items.filter((item: any) => item._id.toString() === data.id)[0];
          item.title = data.title;
          item.btnTitle = data.btnTitle;
          if (data.imgUrl !== '') {
            item.imgUrl = data.imgUrl;
          }
        }
        await tabRes.save();
        return;
      } else {
        throw new HttpException(
          'TABITEM.ADD.DATA_NOT_EXIST',
          HttpStatus.FORBIDDEN,
        );
      }
    } else {
      throw new HttpException(
        'TABITEM.ADD.MISSING_MANDATORY_PARAMETERS',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async removeTabItem(type: string, id: string){
    if (type && id ) {
      const tabRes = await this.tabModel.findOne({ type: type }).exec();
      if (tabRes) {
        const tempItems: any = tabRes.items.filter((item: any) => item._id.toString() !== id);
        tabRes.items = tempItems;
        await tabRes.save();
        return;
      } else {
        throw new HttpException(
          'TABITEM.REMOVE.DATA_NOT_EXIST',
          HttpStatus.FORBIDDEN,
        );
      }
    } else {
      throw new HttpException(
        'TABITEM.REMOVE.MISSING_MANDATORY_PARAMETERS',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async saveToDB(data: SectionDto){
    if (data.type && data.page) {
      const section = await this.findByName(data.type);
      if (!section) {
        const tempNewSection = {
          ...data
        };
        const createdSection = new this.sectionModel(tempNewSection);
        await createdSection.save();
        const page = await this.pagesModel.findOne({pageTitle: data.page});
        page.sections.push(createdSection._id);
        await page.save();
        return;
      } else {
        section.type = data.type;
        section.videoUrl = data.videoUrl;
        if (data.imgUrl !== '') {
          section.imgUrl = data.imgUrl;
        }
        section.list = data.list;
        section.title = data.title;
        section.desc = data.desc;
        section.btnTitle = data.btnTitle;
        section.slider = data.slider;
        return await section.save();
      }
    } else {
      throw new HttpException(
        'SECTIONS.ADD.MISSING_MANDATORY_PARAMETERS',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async saveCard(data: CardDto){
    console.log('saveCard data =>', data)
    if (data.id === undefined && data.id === '') {
      const tempNewCard = {
        ...data
      };
      console.log('tempNewCard =>', tempNewCard)
      const createdCard = new this.cardModel(tempNewCard);
      await createdCard.save();
      console.log('createdCard =>', createdCard)
      const page = await this.pagesModel.findOne({pageTitle: 'Home'});
      page.card = createdCard._id;
      await page.save();
      console.log('page =>', page)
      return;
    } else {
      const _id = typeof data.id === 'string' ? new Types.ObjectId(data.id) : data.id;
      const card = await this.cardModel.findOne({ _id }).exec();
      console.log('card =>', card)
      if (data.imgUrl !== '') {
        card.imgUrl = data.imgUrl;
      }
      card.title = data.title;
      card.features = data.features;
      return await card.save();
    }
  }

  async updateToDB(data: SectionDto){
    const _id = typeof data.id === 'string' ? new Types.ObjectId(data.id) : data.id;
    const section = await this.findById(_id);
    if (!section) {
      throw new HttpException(
        'SECTIONS.UPDATE.DATA_NOT_EXIST',
        HttpStatus.FORBIDDEN,
      );
    } else {
      section.type = data.type;
      section.videoUrl = data.videoUrl;
      section.imgUrl = data.imgUrl;
      section.list = data.list;
      section.title = data.title;
      section.desc = data.desc;
      section.btnTitle = data.btnTitle;
      section.slider = data.slider;
      return await section.save();
    }
  }

  async upload(file:Express.Multer.File){
    // await this.delete(file.originalname);
    const blobClient = this.getBlobClient(file.originalname);
    await blobClient.uploadData(file.buffer);
  }

  async findById(id: string | Types.ObjectId): Promise<SectionInterface> {
    const _id = typeof id === 'string' ? new Types.ObjectId(id) : id;
    return await this.sectionModel.findOne({ _id }).exec();
  }

  async findByName(type: string): Promise<SectionInterface> {
    return await this.sectionModel.findOne({ type }).exec();
  }

  async deleteOrder(id: string): Promise<SectionInterface> {
    return await this.sectionModel.findByIdAndRemove(id);
  }

  async getAllSection(): Promise<SectionInterface[]> {
    return await this.sectionModel.find().exec();
  }

  async getPage(pageTitle: string): Promise<PagesInterface> {
    return await this.pagesModel.findOne({ pageTitle })
      .populate({path: 'sections', select: { 'type': 1, 'videoUrl': 1, 'imgUrl': 1, 'list': 1, 'desc': 1, 'title': 1, 'btnTitle': 1, 'slider': 1 }})
      .populate({path: 'tabs', select: { 'type': 1, 'items': 1 }})
      .populate({path: 'currencies', select: { 'type': 1, 'base': 1, 'items': 1 }})
      .populate({path: 'card', select: { 'imgUrl': 1, 'features': 1, 'title': 1 }})
      .exec();
  }

  async getPages(): Promise<PagesInterface[]> {
    return await this.pagesModel.find().exec();
  }
}