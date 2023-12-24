import * as mutationTypes from './mutationTypes';

export default {
  [mutationTypes.SET_PAGE](state, page) {
    state.page = page;
  },

  [mutationTypes.SET_PER_PAGE](state, perPage) {
    state.perPage = perPage;
  },

  [mutationTypes.SET_TOTAL_ITEMS](state, totalItems) {
    state.totalItems = totalItems;
  },

  [mutationTypes.SET_IS_LOADING](state, isLoading) {
    state.isLoading = isLoading;
  },
};
