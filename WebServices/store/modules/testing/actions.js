import * as mutationTypes from './mutationTypes';

export default {
  setIsButtonDisabled({ commit }, value) {
    commit(mutationTypes.SET_IS_BUTTON_DISABLED, value);
  },

  setIsModalOpen({ commit }, value) {
    commit(mutationTypes.SET_IS_MODAL_OPEN, value);
  },
};
