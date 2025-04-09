import { App } from "@/type/app-type";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type AppState = {
  apps: App[];
  setApps: (apps: App[]) => void;
  addApp: (app: App) => void;
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      apps: [
        { name: "LIVE SSO SETUP", alias: "livessosetup" },
        { name: "TEST SSO SETUP", alias: "testssosetup" },
      ],
      setApps: (apps) => set({ apps }),
      addApp: (app) =>
        set((state) => ({
          apps: [...state.apps, app],
        })),
    }),
    {
      name: "app-storage", // key in localStorage
    }
  )
);
