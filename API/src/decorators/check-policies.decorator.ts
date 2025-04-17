import { SetMetadata } from '@nestjs/common';
import { Action } from '../abilities/ability.factory';

export interface PolicyHandler {
    action: Action;
    subject: string;
}

export const CHECK_POLICIES_KEY = 'check-policies';
export const CheckPolicies = (...handlers: PolicyHandler[]) => SetMetadata(CHECK_POLICIES_KEY, handlers);