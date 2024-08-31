import api from "../utils/api";

export const setGoal = (goals) =>{
    return api.post('/goals', goals);
}
export const getGoals = () => {
    return api.get('/goals');
}
export const updateGoal = (id, goals) => {
    return api.put(`/goals/${id}`, goals);
}
export const deleteGoal = (id) => {
    return api.delete(`/goals/${id}`);
}