// dbConfig.ts
export interface DBConfig {
  name: string;
  version: number;
}

export const dbConfigs: { [key: string]: DBConfig } = {
  appCache: { name: "appCache", version: 1 },
};
