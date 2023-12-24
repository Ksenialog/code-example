import state from './state';
import mutations from './mutations';
import actions from './actions';

export default function createStoreModule(initialState = {}) {
  return {
    namespaced: true,
    state: { ...state, ...initialState },
    mutations,
    actions,
  };
}
