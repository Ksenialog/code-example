import state from './state';
import mutations from './mutations';
import actions from './actions';

export default function createStoreModule() {
  return {
    namespaced: true,
    state,
    mutations,
    actions,
  };
}
