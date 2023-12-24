import * as mutationTypes from './mutationTypes';

export default {
  [mutationTypes.SET_IS_BUTTON_DISABLED](state, value) {
    state.isButtonDisabled = value;
  },

  [mutationTypes.SET_IS_MODAL_OPEN](state, value) {
    state.isModalOpen = value;
  },
};
