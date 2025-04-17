import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AbilityFactory } from '../abilities/ability.factory';
import { CHECK_POLICIES_KEY, PolicyHandler } from '../decorators/check-policies.decorator';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private abilityFactory: AbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Public routes are always accessible
    if (isPublic) {
      return true;
    }

    const policyHandlers = this.reflector.get<PolicyHandler[]>(
      CHECK_POLICIES_KEY,
      context.getHandler(),
    ) || [];

    // No policy handlers means no special permission checks needed beyond authentication
    if (policyHandlers.length === 0) {
      return true; // Let the JwtAuthGuard handle authentication
    }

    const { user } = context.switchToHttp().getRequest();

    // If no user but policies required, deny access
    if (!user) {
      console.error('User not found in request, make sure Token is being sent');
      return false;
    }

    // Check all policies - if any handler requires entity data
    const needsEntityCheck = policyHandlers.some(handler => handler.checkData);

    if (needsEntityCheck) {
      const request = context.switchToHttp().getRequest();
      const entityId = request.params.id;
      const userId = request.user.id;
      
      // If a policy requires entity checking but no ID is provided, pass for now
      // (The controller method will need to do the check)
      if (!entityId) {
        return policyHandlers
          .filter(handler => !handler.checkData)
          .every(handler => {
            return this.abilityFactory.can(
              user.role,
              handler.action,
              handler.subject,
            );
          });
      }

      // Check if the user is the same as the entity owner
      return policyHandlers.every(handler => {
        if (handler.checkData) {
          // Check if the user is the owner of the entity
          const isOwner = this.abilityFactory.can(
            user.role,
            handler.action,
            handler.subject,
            { id: entityId, createdBy: userId },
          );
          if (!isOwner) {
            throw new ForbiddenException('You do not have permission to access this resource.');
          }
          return true; // Allow access for this policy check
        }

        // For other policies, just check the ability
        return this.abilityFactory.can(
          user.role,
          handler.action,
          handler.subject,
        );
      });
    }

    // Check all policies
    return policyHandlers.every(handler => {
      return this.abilityFactory.can(
        user.role,
        handler.action,
        handler.subject,
      );
    });
  }
}