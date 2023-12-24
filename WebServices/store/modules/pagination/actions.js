import * as mutationTypes from './mutationTypes';

export default {
  setPage({ commit }, page) {
    commit(mutationTypes.SET_PAGE, page);
  },

  setPerPage({ commit }, perPage) {
    commit(mutationTypes.SET_PER_PAGE, perPage);
  },

  setTotalItems({ commit }, totalItems) {
    commit(mutationTypes.SET_TOTAL_ITEMS, totalItems);
  },

  setIsLoading({ commit }, isLoading) {
    commit(mutationTypes.SET_IS_LOADING, isLoading);
  },
};
