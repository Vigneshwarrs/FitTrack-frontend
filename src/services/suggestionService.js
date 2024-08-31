import api from "../utils/api";

export const getDietSuggestions = () =>{
    return api.get("/suggestions/diet")
}

export const getExerciseSuggestions = () =>{
    return api.get("/suggestions/exercises")
}