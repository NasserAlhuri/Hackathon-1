import React, { createContext, useContext, useMemo, useState, ReactNode } from 'react';
import { I18nManager } from 'react-native';
import { translations, Lang, TranslationKey } from '../constants/i18n';
import { MOCK_TASKS, DeliveryTask } from '../data/mockData';

export type Role =
  | 'individual'
  | 'org'
  | 'volunteer'
  | 'ngo'
  | 'requester'
  | null;

type AppState = {
  lang: Lang;
  role: Role;
  tasks: DeliveryTask[];
  notifications: boolean;
  t: (key: TranslationKey) => string;
  isRTL: boolean;
  setLang: (lang: Lang) => void;
  setRole: (r: Role) => void;
  setNotifications: (b: boolean) => void;
  updateTask: (id: string, patch: Partial<DeliveryTask>) => void;
  addTask: (task: DeliveryTask) => void;
};

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');
  const [role, setRole] = useState<Role>(null);
  const [tasks, setTasks] = useState<DeliveryTask[]>(MOCK_TASKS);
  const [notifications, setNotifications] = useState(true);

  const setLang = (l: Lang) => {
    setLangState(l);
    // Note: I18nManager.forceRTL is persistent & requires reload on native.
    // For prototype/web, we flip layout via style-level logic only.
    try {
      I18nManager.allowRTL(l === 'ar');
    } catch {}
  };

  const t = (key: TranslationKey) => translations[lang][key] ?? key;

  const updateTask = (id: string, patch: Partial<DeliveryTask>) => {
    setTasks((prev) => prev.map((t0) => (t0.id === id ? { ...t0, ...patch } : t0)));
  };

  const addTask = (task: DeliveryTask) => {
    setTasks((prev) => [task, ...prev]);
  };

  const value = useMemo<AppState>(
    () => ({
      lang,
      role,
      tasks,
      notifications,
      t,
      isRTL: lang === 'ar',
      setLang,
      setRole,
      setNotifications,
      updateTask,
      addTask,
    }),
    [lang, role, tasks, notifications]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
