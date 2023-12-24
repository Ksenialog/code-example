import * as mutationTypes from './mutationTypes';

export default {
  [mutationTypes.SET_TIME_INFO](state, value) {
    state.timeInfo = value;
  },
};
