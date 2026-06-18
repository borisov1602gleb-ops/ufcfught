// Типы, отражающие контракты бэкенда (см. backend/app/auth/schemas.py).

export interface Skill {
  id: string;
  title: string;
  description: string;
  icon: string;
  tag: string;
  entry_point: string;
}

export interface Me {
  id: string;
  username: string;
  full_name: string;
  role_id: string;
  role_title: string;
  permissions: string[];
  skills: Skill[];
}
