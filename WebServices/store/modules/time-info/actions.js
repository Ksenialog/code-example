import * as mutationTypes from './mutationTypes';

export default {
  setTimeInfo({ commit }, value) {
    commit(mutationTypes.SET_TIME_INFO, value);
  },
};
