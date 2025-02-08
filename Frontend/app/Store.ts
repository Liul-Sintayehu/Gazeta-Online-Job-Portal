import { create } from 'zustand';
import { tokenProvider } from './_services/tokenServices';

type PageOptions = string;

interface CentralStore {
  activePage: PageOptions;
  setActivePage: (page: PageOptions) => void;

  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setIsSidebarOpen: (isOpen: boolean) => void;

  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  initializeAccessToken: () => void;

  idToken: string | null;
  setIdToken: (token: string | null) => void;
  initializeIdToken: () => void;

  username: string | null;
  setUsername: (username: string | null) => void;
  initializeUsername: () => void;

  claims: string[] | null;
  setClaims: (claims: string[]) => void;

  fullName: string | null;
  setFullName: (name: string) => void;

  clearSession: () => void;
}

export const useCentralStore = create<CentralStore>((set, get) => ({
  activePage: 'DASHBOARD',
  setActivePage: page => set({ activePage: page }),

  isSidebarOpen: false,
  toggleSidebar: () => set({ isSidebarOpen: !get().isSidebarOpen }),
  setIsSidebarOpen: isOpen => set({ isSidebarOpen: isOpen }),

  accessToken: null,
  setAccessToken: token => set({ accessToken: token }),
  initializeAccessToken: () => {
    const token = sessionStorage.getItem('accessToken') || null;
    set({ accessToken: token });
  },

  idToken: null,
  setIdToken: token => set({ idToken: token }),
  initializeIdToken: () => {
    const token = sessionStorage.getItem('idToken') || null;
    set({ idToken: token });
  },

  claims: null, // Initialize claims as an object
  setClaims: claims => {
    set({ claims });
  },

  fullName: null,
  setFullName: name => set({ fullName: name }),

  username: null,
  setUsername: username => set({ username }),
  initializeUsername: async () => {
    const { username } = await tokenProvider();
    set({ username });
  },

  clearSession: () => {
    set({
      accessToken: null,
      idToken: null,
      username: null,
      claims: null,
      fullName: null,
    });
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('idToken');
  },
}));
