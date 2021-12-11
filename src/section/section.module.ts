import {
  Module, MiddlewareConsumer, NestModule
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SectionController } from './section.controller';
import { SectionSchema, PagesSchema, TabSchema, CurrencySchema, CardSchema } from './schemas/section.schema';
import { LoggerMiddleware } from '../common/middlewares/logger.middleware';
import { SectionService } from './section.service';

@Module({
  imports: [MongooseModule.forFeature([
    { name: 'Pages', schema: PagesSchema },
    { name: 'Section', schema: SectionSchema },
    { name: 'Tab', schema: TabSchema },
    { name: 'Currency', schema: CurrencySchema },
    { name: 'Card', schema: CardSchema },
  ])],
  controllers: [SectionController],
  providers: [SectionService],
})
export class SectionModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
     consumer
      .apply(LoggerMiddleware)
      .forRoutes(SectionController);
   }
}
