import api from "../utils/api";

export const logWorkout = (exercise) => {
    return api.post('/workouts', exercise);
}
export const getWorkouts = () => {
    return api.get('/workouts');
}
export const updateWorkout = (id, exercise) => {
    return api.put(`/workouts/${id}`, exercise);
}
export const deleteWorkout = (id) => {
    return api.delete(`/workouts/${id}`);
}