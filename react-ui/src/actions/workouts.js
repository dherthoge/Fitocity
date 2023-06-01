import * as api from '../api/index.js';

export const getWorkoutsBySearch = (searchQuery) => async (dispatch) => {
    try {
      //dispatch({ type: START_LOADING });
      const { data: { data } } = await api.fetchWorkoutsBySearch(searchQuery);
        console.log(data)
      //dispatch({ type: FETCH_BY_SEARCH, payload: { data } });
      //dispatch({ type: END_LOADING });
    } catch (error) {
      console.log(error);
    }
  };