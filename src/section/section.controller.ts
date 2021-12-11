import { Controller, Get, UseGuards, Header, UseInterceptors, Post, UploadedFile, Res, Param, Delete, Body, Patch, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiParam, ApiConsumes, ApiBody, ApiOperation, ApiCreatedResponse, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { SectionExtender, SectionService } from './section.service';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { IResponse } from 'common/interfaces/response.interface';
import { ResponseSuccess, ResponseError } from 'common/dto/response.dto';
import { CardDto, PagesDto, SectionDto, Tab, TabsDto } from './dto/section.dto';

@ApiTags('CMS')
@ApiBearerAuth()
@Controller({
  path: 'cms',
  version: '1',
})
@UseInterceptors(LoggingInterceptor, TransformInterceptor)

export class SectionController {
	constructor(
    private SectionService: SectionService,
  ) {}

  @ApiOperation({ summary: 'Get all pages API' })
  @ApiCreatedResponse({
    description: 'Success Response',
    type: [PagesDto],
  })
  @ApiParam({
    name: 'pageTitle',
  })
  @Get('page/:pageTitle')
  public async getPage(@Param() params): Promise<IResponse> {
    try {
      const response = await this.SectionService.getPage(params.pageTitle);
      return new ResponseSuccess('PAGES.GETALLPAGE.SUCCESS', response);
    } catch (error) {
      return new ResponseError('PAGES.GETALLPAGE.ERROR', error);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Add page API with page informations' })
  @ApiResponse({ status: 200, description: 'Success Response', type: PagesDto})
  @Post('page')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        pageTitle: { type: 'string' },
      },
    },
  })
  async addPage(@Body() pageInfo){
    try {
      const data = {
        pageTitle: pageInfo.pageTitle,
      };
      await this.SectionService.savePageToDB(data);
      return "added";
    } catch (error) {
      return new ResponseError('PAGES.ADD.ERROR', error);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get all pages API' })
  @ApiCreatedResponse({
    description: 'Success Response',
    type: [PagesDto],
  })
  @Get('pages')
  public async getPages(): Promise<IResponse> {
    try {
      const response = await this.SectionService.getPages();
      return new ResponseSuccess('PAGES.GETALLPAGES.SUCCESS', response);
    } catch (error) {
      return new ResponseError('PAGES.GETALLPAGES.ERROR', error);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Add currency API with currency informations' })
  @ApiResponse({ status: 200, description: 'Success Response', type: String})
  @Post('currency')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        type: { type: 'string' },
        base: { type: 'string' },
        items: {
          type: 'array',
          items: {
            type: 'string',
          },
        },
      },
    },
  })
  async addCurrency(@Body() currencyInfo){
    try {
      const data = {
        type: currencyInfo.type,
        base: currencyInfo.base,
        items: JSON.parse(currencyInfo.items),
      };
      await this.SectionService.addCurrency(data);
      return "added";
    } catch (error) {
      return new ResponseError('CURRENCY.ADD.ERROR', error);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Add tab API with tab informations' })
  @ApiResponse({ status: 200, description: 'Success Response', type: TabsDto})
  @Post('tab')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        type: { type: 'string' },
        page: { type: 'string' },
      },
    },
  })
  async addTab(@Body() tabInfo){
    try {
      const data = {
        id: '',
        type: tabInfo.type,
        page: tabInfo.page,
        items: [],
      };
      await this.SectionService.addTab(data);
      return "added";
    } catch (error) {
      return new ResponseError('TAB.ADD.ERROR', error);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Add tab API with tab informations' })
  @ApiResponse({ status: 200, description: 'Success Response', type: TabsDto})
  @Post('tab/item')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        type: { type: 'string' },
        title: { type: 'string' },
        btnTitle: { type: 'string' },
        img: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(SectionExtender)
  @UseInterceptors(FileInterceptor('img'))
  async addTabItem(@UploadedFile() img, @Body() tabInfo){
    try {
      if (img) {
        await this.SectionService.upload(img);
      }
      const img_url = img ? `https://${process.env.AZURE_STORAGE_NAME}.blob.core.windows.net/imgs/${img.originalname}` : '';
      const data = {
        id: tabInfo.id,
        type: tabInfo.type,
        originalname: img ? img.originalname : '',
        imgUrl: img_url,
        title: tabInfo.title,
        btnTitle: tabInfo.btnTitle,
      };
      await this.SectionService.addTabItem(data);
      return "added";
    } catch (error) {
      return new ResponseError('TABITEM.ADD.ERROR', error);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get all section API' })
  @ApiCreatedResponse({
    description: 'Success Response',
    type: [SectionDto],
  })
  @ApiParam({
    name: 'type',
  })
  @Get('section/:type')
  public async getAllSection(@Param() params): Promise<IResponse> {
    try {
      const response = await this.SectionService.getAllSection();
      return new ResponseSuccess('PAGES.GETSECTION.SUCCESS', response);
    } catch (error) {
      return new ResponseError('PAGES.GETSECTION.ERROR', error);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Delete existing section API with sectionId' })
	@ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        type: { type: 'string' },
      },
    },
  })
  @ApiParam({
    name: 'type',
  })
  @ApiParam({
    name: 'id',
  })
  @Delete('tab/item/:type/:id')
  async deleteTabItem(@Param() params){
    try {
      await this.SectionService.removeTabItem(params.type, params.id);
      return "deleted";
    } catch (error) {
      return new ResponseError('TABITEM.DELETE.ERROR', error);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Add section API with section informations' })
  @ApiResponse({ status: 200, description: 'Success Response', type: SectionDto})
  @Post('section')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        type: { type: 'string' },
        page: { type: 'string' },
        videoUrl: { type: 'string' },
        title: { type: 'string' },
        desc: { type: 'string' },
        btnTitle: { type: 'string' },
        slider: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              btnTitle: { type: 'string' },
            },
          },
        },
        list: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              list: {
                type: 'array',
                items: {
                  type: 'string',
                }
              },
            },
          },
        },
        img: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(SectionExtender)
  @UseInterceptors(FileInterceptor('img'))
  async add(@UploadedFile() img, @Body() sectionInfo){
    try {
      if (img) {
        await this.SectionService.upload(img);
      }
      const img_url = img ? `https://${process.env.AZURE_STORAGE_NAME}.blob.core.windows.net/imgs/${img.originalname}` : '';
      const data = {
        id: '',
        type: sectionInfo.type,
        page: sectionInfo.page,
        originalname: img ? img.originalname : '',
        videoUrl: sectionInfo.videoUrl,
        imgUrl: img_url,
        list: JSON.parse(sectionInfo.list),
        title: sectionInfo.title,
        desc: sectionInfo.desc,
        btnTitle: sectionInfo.btnTitle,
        slider: JSON.parse(sectionInfo.slider),
      };
      await this.SectionService.saveToDB(data);
      return "added";
    } catch (error) {
      return new ResponseError('SECTION.ADD.ERROR', error);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Update section API with section informations' })
  @ApiResponse({ status: 200, description: 'Success Response', type: SectionDto})
  @Patch('section')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        videoUrl: { type: 'string' },
        title: { type: 'string' },
        desc: { type: 'string' },
        btnTitle: { type: 'string' },
        slider: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              btnTitle: { type: 'string' },
            },
          },
        },
        list: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              list: {
                type: 'array',
                items: {
                  type: 'string',
                }
              },
            },
          },
        },
        img: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(SectionExtender)
  @UseInterceptors(FileInterceptor('img'))
  async update(@UploadedFile() img, @Body() sectionInfo){
    try {
      if (img) {
        await this.SectionService.upload(img);
      }
      const img_url = img ? `https://${process.env.AZURE_STORAGE_NAME}.blob.core.windows.net/imgs/${img.originalname}` : '';
      const data = {
        id: sectionInfo.id,
        type: '',
        page: '',
        originalname: img ? img.originalname : '',
        videoUrl: sectionInfo.videoUrl,
        imgUrl: img_url,
        list: sectionInfo.list,
        title: sectionInfo.title,
        desc: sectionInfo.desc,
        btnTitle: sectionInfo.btnTitle,
        slider: sectionInfo.slider,
      };
      await this.SectionService.updateToDB(data);
      return "updated";
    } catch (error) {
      return new ResponseError('PAGES.UPDATE.ERROR', error);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Delete existing section API with sectionId' })
	@ApiParam({
    name: 'id',
  })
  @Delete('section/:id')
  async delete(@Param() params){
    try {
      const data = await this.SectionService.findById(params.id);
      await this.SectionService.deleteOrder(data._id);
      await this.SectionService.delete(data.originalname);
      return "deleted";
    } catch (error) {
      return new ResponseError('PAGES.DELETE.ERROR', error);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Add card API with card informations' })
  @ApiResponse({ status: 200, description: 'Success Response', type: CardDto})
  @Post('card')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        title: { type: 'string' },
        features: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              highlight: { type: 'string' },
              desc: { type: 'string' },
            },
          },
        },
        img: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(SectionExtender)
  @UseInterceptors(FileInterceptor('img'))
  async addCard(@UploadedFile() img, @Body() cardInfo){
    try {
      if (img) {
        await this.SectionService.upload(img);
      }
      const img_url = img ? `https://${process.env.AZURE_STORAGE_NAME}.blob.core.windows.net/imgs/${img.originalname}` : '';
      const data = {
        id: cardInfo.id,
        originalname: img ? img.originalname : '',
        imgUrl: img_url,
        features: JSON.parse(cardInfo.features),
        title: cardInfo.title,
      };
      console.log('card data =>', data)
      await this.SectionService.saveCard(data);
      return "added";
    } catch (error) {
      return new ResponseError('CARD.ADD.ERROR', error);
    }
  }
}