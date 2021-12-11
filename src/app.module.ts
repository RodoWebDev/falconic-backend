import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SectionModule } from './section/section.module';
import { default as config } from './config';

const userString = config.db.user && config.db.pass ? (config.db.user + ':' + config.db.pass + '@') : '';
const authSource = `?ssl=true&retrywrites=false&maxIdleTimeMS=120000&appName=@${config.db.database}@`;
// const authSource = config.db.authSource ? ('?authSource=' + config.db.authSource + '&w=1') : '';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://' + userString + config.db.host + ':' + (config.db.port || '27017') +'/' + config.db.database + authSource, { useNewUrlParser: true, useUnifiedTopology: true }),
    AuthModule,
    UsersModule,
    SectionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
