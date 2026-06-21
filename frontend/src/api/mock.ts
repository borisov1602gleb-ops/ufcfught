// Демо-режим авторизации для статичного хостинга (GitHub Pages), где бэкенда нет.
// Включается флагом сборки VITE_MOCK_AUTH=1. Зеркалит данные бэкенда этапа 1.
import type { Me } from "./types";
import { ApiError } from "./client";

export const MOCK_ENABLED = import.meta.env.VITE_MOCK_AUTH === "1";

interface DemoUser {
  password: string;
  me: Omit<Me, "permissions" | "skills"> & {
    permissions: string[];
    skills: Me["skills"];
  };
}

const DOC_SKILL = {
  id: "doc-constructor",
  title: "Конструктор документов",
  description: "Практика → документ → форма с вопросами → готовый .docx",
  icon: "file-text",
  tag: "Документы",
  entry_point: "/skills/doc-constructor",
};

const DEMO: Record<string, DemoUser> = {
  lawyer: {
    password: "lawyer123",
    me: {
      id: "u-lawyer",
      username: "lawyer",
      full_name: "Иван Петров",
      role_id: "lawyer",
      role_title: "Юрист",
      permissions: ["doc_constructor:use"],
      skills: [DOC_SKILL],
    },
  },
  admin: {
    password: "admin123",
    me: {
      id: "u-admin",
      username: "admin",
      full_name: "Анна Смирнова",
      role_id: "admin",
      role_title: "Администратор / методолог",
      permissions: ["doc_constructor:use", "templates:manage", "users:manage"],
      skills: [DOC_SKILL],
    },
  },
};

// Аккаунты, зарегистрированные в демо-режиме (живут до перезагрузки страницы).
const REGISTERED: Record<string, DemoUser> = {};

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

function lookup(username: string): DemoUser | undefined {
  const key = username.toLowerCase().trim();
  return DEMO[key] ?? REGISTERED[key];
}

export async function mockRegister(
  username: string,
  fullName: string,
  password: string,
): Promise<string> {
  await delay(500);
  const key = username.toLowerCase().trim();
  if (key.length < 3) throw new ApiError(422, "Логин должен быть не короче 3 символов");
  if (password.length < 6) throw new ApiError(422, "Пароль должен быть не короче 6 символов");
  if (fullName.trim().length < 2) throw new ApiError(422, "Укажите ФИО");
  if (lookup(key)) throw new ApiError(409, "Логин уже занят");
  REGISTERED[key] = {
    password,
    me: {
      id: `demo-${key}`,
      username: key,
      full_name: fullName.trim(),
      role_id: "lawyer",
      role_title: "Юрист",
      permissions: ["doc_constructor:use"],
      skills: [DOC_SKILL],
    },
  };
  return `mock.${key}`;
}

export async function mockLogin(username: string, password: string): Promise<string> {
  await delay(450); // имитация сети
  const user = lookup(username);
  if (!user || user.password !== password) {
    throw new ApiError(401, "Неверный логин или пароль");
  }
  return `mock.${user.me.username}`;
}

export async function mockFetchMe(token: string | null): Promise<Me> {
  await delay(150);
  const username = token?.startsWith("mock.") ? token.slice(5) : "";
  const user = username ? lookup(username) : undefined;
  if (!user) throw new ApiError(401, "Требуется авторизация");
  return user.me;
}
