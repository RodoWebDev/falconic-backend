import {
  Controller,
  Get,
  UseGuards,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBadRequestResponse, ApiUnauthorizedResponse, ApiBearerAuth, ApiParam, ApiTags, ApiBody, ApiOperation, ApiResponse, getSchemaPath, ApiCreatedResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { IResponse } from '../common/interfaces/response.interface';
import { ResponseSuccess, ResponseError } from '../common/dto/response.dto';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { UserResponseDto } from './dto/user.dto';

@ApiTags('Users')
@ApiBearerAuth()
@Controller({
  path: 'users',
  version: '1',
})
@UseInterceptors(LoggingInterceptor, TransformInterceptor)

export class UsersController {
  constructor(
    private UsersService: UsersService,
  ) {}

  @UseGuards(AuthGuard('jwt'))  
	@ApiParam({
		name: 'email',
	})
  @ApiOperation({ summary: 'Get User Informations API' })
  @ApiCreatedResponse({
    description: 'Success Response',
    type: UserResponseDto,
  })
  @ApiBadRequestResponse({ description: 'SOME FIELD MISSING' })
  @ApiUnauthorizedResponse({ description: 'NOT AUTHORIZED' })
  @Get('user/:email')
  public async users(@Param() params): Promise<IResponse> {
    try {
      const response = await this.UsersService.findByEmail(params.email);
      response.password = undefined;
      return new ResponseSuccess('USER.SUCCESS',response);
    } catch (error) {
      return new ResponseError('USER.ERROR', error);
    }
  }
}
