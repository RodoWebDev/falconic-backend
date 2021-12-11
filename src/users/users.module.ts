import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserSchema } from './schemas/user.schema';
import { LoggerMiddleware } from '../common/middlewares/logger.middleware';

@Module({
  imports: [MongooseModule.forFeature([
    { name: 'User', schema: UserSchema },
  ]),
  MulterModule.register({
    dest: './files',
  })],
  controllers: [UsersController],
  providers: [UsersService],
	exports: [UsersService],
})
export class UsersModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
     consumer
      .apply(LoggerMiddleware)
      .forRoutes(UsersController);
   }
}
