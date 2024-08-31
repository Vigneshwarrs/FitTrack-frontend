import api from "../utils/api";

export const getNutritionLogs = () =>{
    return api.get('/nutrition');
}

export const logNutrition = (meals) => {
    return api.post('/nutrition', meals);
}

export const updateNutrition = (id, meals) => {
    return api.put(`/nutrition/${id}`, meals);
}

export const deleteNutrition = (id) => {
    return api.delete(`/nutrition/${id}`);
}