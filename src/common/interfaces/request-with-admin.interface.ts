import { Request } from 'express';
import { AuthenticatedAdmin } from './authenticated-admin.interface';

export interface RequestWithAdmin extends Request {
  user: AuthenticatedAdmin;
}
