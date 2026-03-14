import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedAdmin } from '../interfaces/authenticated-admin.interface';
import { RequestWithAdmin } from '../interfaces/request-with-admin.interface';

export const CurrentAdmin = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthenticatedAdmin => {
    const request = ctx.switchToHttp().getRequest<RequestWithAdmin>();
    return request.user;
  },
);
