import apiClient from "./apiConfig";
import { Kanji } from "@/types/kanjiType";

export const get20RandomKanji = async (level: string): Promise<Kanji[] | undefined> => {
    try {
        const response = await apiClient.get<Kanji[]>(`/20random/${level}`);
        return response.data;
    } catch (error: unknown) {
        console.log(error, `Không thể lấy Kanji cho cấp độ ${level}.`);
    }
};
