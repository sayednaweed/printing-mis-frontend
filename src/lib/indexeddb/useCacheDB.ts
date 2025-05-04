// useUserDB.ts
import { getNativeItem, removeNativeItem, updateNativeItem } from "./dbUtils"; // Adjust the path as needed
import { dateExpired, generateExpireAt } from "./helper";
import { NameAndID, NameAndIDCache } from "./types";

const useCacheDB = () => {
  const getComponentCache = async (key: IDBValidKey): Promise<any> => {
    try {
      return await getNativeItem("appCache", "cmp", key);
    } catch (error) {
      console.error("getComponentCache Error: ", error);
      return undefined; // or handle as needed
    }
  };

  const updateComponentCache = async (data: any) => {
    try {
      return await updateNativeItem("appCache", "cmp", data);
    } catch (error) {
      console.error("updateComponentCache Error: ", error);
      return undefined; // or handle as needed
    }
  };

  const getChatCache = async (key: IDBValidKey): Promise<any> => {
    try {
      return await getNativeItem("appCache", "chat", key);
    } catch (error) {
      console.error("getChatCache Error: ", error);
      return undefined; // or handle as needed
    }
  };

  const updateChatCache = async (data: any) => {
    try {
      return await updateNativeItem("appCache", "chat", data);
    } catch (error) {
      console.error("updateChatCache Error: ", error);
      return undefined; // or handle as needed
    }
  };

  const getApiCache = async (
    key: IDBValidKey,
    lang: string
  ): Promise<NameAndID[] | undefined> => {
    try {
      const data = await getNativeItem("appCache", "api", key);
      if (data) {
        const cached = data as NameAndIDCache;
        if (dateExpired(cached.expireAt) || lang != cached.lang) {
          await removeNativeItem("appCache", "api", key);
          return undefined;
        }
        const content = JSON.parse(data.data) as NameAndID[];
        return content;
      } else {
        return undefined;
      }
    } catch (error) {
      console.error("getApiCache Error: ", error);
      return undefined; // or handle as needed
    }
  };

  const updateApiCache = async (data: NameAndIDCache) => {
    try {
      const content = JSON.stringify(data.data);
      const expireAt = generateExpireAt(data.expireAt);
      return await updateNativeItem("appCache", "api", {
        key: data.key,
        data: content,
        expireAt: expireAt,
        lang: data.lang,
      });
    } catch (error) {
      console.error("updateApiCache Error: ", error);
      return undefined; // or handle as needed
    }
  };

  return {
    getComponentCache,
    updateComponentCache,
    getChatCache,
    updateChatCache,
    getApiCache,
    updateApiCache,
  };
};

export default useCacheDB;
