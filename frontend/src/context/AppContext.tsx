import React, { createContext, useContext, useMemo, useState, ReactNode } from 'react';
import { translations, tr, Lang, RTL_LANGS, TranslationKey } from '../constants/i18n';
import { MOCK_TASKS, DeliveryTask } from '../data/mockData';

export type Role = 'donor' | 'volunteer' | 'recipient' | null;

type AppState = {
  lang: Lang;
  role: Role;
  tasks: DeliveryTask[];
  notifications: boolean;
  t: (key: TranslationKey | string) => string;
  isRTL: boolean;
  setLang: (lang: Lang) => void;
  setRole: (r: Role) => void;
  setNotifications: (b: boolean) => void;
  updateTask: (id: string, patch: Partial<DeliveryTask>) => void;
  addTask: (task: DeliveryTask) => void;
};

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en');
  const [role, setRole] = useState<Role>(null);
  const [tasks, setTasks] = useState<DeliveryTask[]>(MOCK_TASKS);
  const [notifications, setNotifications] = useState(true);

  const t = (key: TranslationKey | string) => tr(lang, key as string);

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
      isRTL: RTL_LANGS.includes(lang),
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
