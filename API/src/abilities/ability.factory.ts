import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose'; // Importa Types de mongoose
import { user_role } from 'src/users/interfaces/user.interface'; 

// Define possible actions
export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read =   'read',
  Update = 'update',
  Delete = 'delete',
}

// Define rule format
export interface Rule {
  action: Action;
  subject: string;
}

// Define abilities container
export interface Ability {
  rules: Rule[];
}

@Injectable()
export class AbilityFactory {
  private abilities_map: Map<user_role, Ability>;

  constructor() {
    this.abilities_map = new Map<user_role, Ability>();
    this.fillAbilitiesMap();
  }

  /**
   * @description
   * This method initializes the abilities map for different user roles.
   */
  private fillAbilitiesMap() {
    // Define abilities for ADMIN
    const adminAbility = this.defineAdminAbilities();
    this.abilities_map.set(user_role.ADMIN, adminAbility);

    // Define abilities for EDITOR
    const editorAbility = this.defineEditorAbilities();
    this.abilities_map.set(user_role.EDITOR, editorAbility);

    // Define abilities for USER
    const userAbility = this.defineUserAbilities();
    this.abilities_map.set(user_role.USER, userAbility);
  }

  private defineAdminAbilities(): Ability {
    const rules: Rule[] = [];

    rules.push({
      action: Action.Manage,
      subject: 'all',
    });
    return { rules };
  }

  private defineEditorAbilities(): Ability {
    const rules: Rule[] = [];

    rules.push({
      action: Action.Manage,
      subject: 'Product',
    });
    
    rules.push({
      action: Action.Manage,
      subject: 'Category',
    });

    rules.push({
      action: Action.Manage,
      subject: 'Order',
    });

    rules.push({
      action: Action.Read,
      subject: 'all',
    });

    rules.push({
      action: Action.Update,
      subject: 'User.role',
    });

    rules.push({
      action: Action.Update,
      subject: 'User.status',
    });

    return { rules };
  }

  private defineUserAbilities(): Ability {
    const rules: Rule[] = [];

    rules.push({
      action: Action.Read,
      subject: 'Product',
    });

    rules.push({
      action: Action.Read,
      subject: 'Category',
    });

    rules.push({
      action: Action.Read,
      subject: 'Order',
    });

    rules.push({
      action: Action.Create,
      subject: 'Order',
    });

    rules.push({
      action: Action.Update,
      subject: 'Order',
    });

    rules.push({
      action: Action.Delete,
      subject: 'Order',
    });

    rules.push({
      action: Action.Read,
      subject: 'User',
    });

    rules.push({
      action: Action.Update,
      subject: 'User',
    });
    
    return { rules };
  }

  can(user_rol: user_role, action: Action, subject: string): boolean {
    // Check if user role, action, and subject are provided
    if (!user_rol || !action || !subject) {
      return false;
    }

    const ability = this.abilities_map.get(user_rol);
    if (!ability) {
      return false;
    }

    const manageRule = ability.rules.find(
      (rule) =>
        rule.action === Action.Manage &&
        (rule.subject === 'all' || rule.subject === subject),
    );
    
    if (manageRule) {
      return true;
    }

    // Check for specific action rules
    const rules = ability.rules.filter(
      (rule) =>
        (rule.action === action || rule.action === Action.Manage) &&
        (rule.subject === 'all' || rule.subject === subject),
    );

    // No rules = no permission
    if (rules.length === 0) {
      return false;
    
    } else {
      return true;
    
    }
  }
}