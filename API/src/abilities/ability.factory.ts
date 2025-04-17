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
  conditions?: any;
  fields?: string[];
  inverted?: boolean;
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
      conditions: {
        status: 'not processed',
      },
    });

    rules.push({
      action: Action.Delete,
      subject: 'Order',
      conditions: {
        status: 'not processed',
      },
    });

    rules.push({
      action: Action.Read,
      subject: 'User',
      conditions: {
        id: 'User.id',
      },
    });

    rules.push({
      action: Action.Update,
      subject: 'User',
      conditions: {
        id: 'User.id',
      },
    });
    
    return { rules };
  }

  can(user_rol: user_role, action: Action, subject: string, data?: any): boolean {
    // Si no hay reglas o habilidad definida, denegar acceso
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
    }

    // Check conditions if they exist
    return rules.some((rule) => {
      if (!rule.conditions) {
        return true;
      }

      // Check all conditions
      return Object.entries(rule.conditions).every(([key, value]) => {
        // Si estamos comparando ObjectIds, necesitamos convertirlos a string
        if (data && data[key] && value) {
          // Si el valor es un ObjectId, conviértelo a string para comparar
          const dataValue = data[key] instanceof Types.ObjectId ? 
                            data[key].toString() : data[key];
          const condValue = value instanceof Types.ObjectId ?
                            value.toString() : value;
                            
          return dataValue === condValue;
        }
        return false;
      });
    });
  }
}