import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { AdminLoginDto } from './dto/admin-login.dto';

@Injectable()
export class AdminAuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(dto: AdminLoginDto) {
    const email = dto.email.toLowerCase();
    const admin = await this.prisma.adminUser.findUnique({
      where: { email },
    });

    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!admin.isActive) {
      throw new ForbiddenException('Admin user is disabled');
    }

    const isValidPassword = await bcrypt.compare(
      dto.password,
      admin.passwordHash,
    );
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: admin.id,
      email: admin.email,
    };

    return {
      tokenType: 'Bearer',
      accessToken: await this.jwtService.signAsync(payload),
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN') ?? '7d',
      admin: {
        id: admin.id,
        email: admin.email,
        fullName: admin.fullName,
      },
    };
  }
}
