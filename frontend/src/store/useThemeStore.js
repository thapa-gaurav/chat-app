import { create } from "zustand";

export default useThemeStore = create((set) => {
  theme: localStorage.getItem("currentTheme") || "light";
  setTheme: (theme) => {
    localStorage.setItem("currentTheme", theme);
    set({ theme });
  };
});
