import Vue from "vue";
import Vuex from "vuex";
import state from "./state";
import actions from "./action";
import mutations from "./mutation";
import getters from "./getters";



Vue.use(Vuex);
export default new Vuex.Store({
    strict:true,
    state,
    mutations,
    actions,
    getters,

})
