import apiClient from "./apiConfig";

export const getVocabByLesson = async (lesson: string) => {
    try {
        const response = await apiClient.get(`vocabularies/lesson/${lesson}`);
        return response.data;
    } catch (error: unknown) {
        console.log(error, `Không thể lấy từ vựng bài ${lesson}.`);
    }
};
