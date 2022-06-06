import { useSettingsStore } from '@store';

export const useSettings = () => {
  const settings = useSettingsStore();
  return settings;
};
