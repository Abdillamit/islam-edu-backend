import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { DeviceRequest } from '../interfaces/device-request.interface';

@Injectable()
export class DeviceIdGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<DeviceRequest>();
    const deviceId = request.header('x-device-id');

    if (!deviceId || deviceId.length < 8 || deviceId.length > 128) {
      throw new BadRequestException(
        'X-Device-Id header is required and must be 8-128 chars',
      );
    }

    request.deviceId = deviceId;
    return true;
  }
}
