import { applyDecorators, UseGuards } from '@nestjs/common';
import { UserRole } from '../models/enums';
import { RoleProtected } from './role-protected.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../guards/user-role.guard';

export function Auth(...role: UserRole[]) {
  return applyDecorators(
    RoleProtected(...role),
    UseGuards(AuthGuard(), UserRoleGuard),
  );
}
