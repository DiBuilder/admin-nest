import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('认证管理')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: '用户登录' })
  @ApiResponse({ status: 200, description: '登录成功' })
  @ApiResponse({ status: 401, description: '用户名或密码错误' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string', description: '用户名' },
        password: { type: 'string', description: '密码' },
      },
      required: ['username', 'password'],
    },
  })
  @Post('login')
  async login(@Body() loginDto: { username: string; password: string }) {
    try {
      const result = await this.authService.login(
        loginDto.username,
        loginDto.password,
      );
      return {
        code: 200,
        data: result,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        return {
          code: 401,
          message: error.message,
        };
      }
      throw error;
    }
  }
}
