/* eslint-disable no-new */
import Vue from 'vue';
import App from './App.vue';
import Vue2Filters from 'vue2-filters'
import VueMoment from 'vue-moment';


import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-vue/dist/bootstrap-vue.min.css';

import { Card, Layout, Form, Button, ButtonGroup, InputGroup, FormInput, FormGroup, FormSelect, Progress, Table } from 'bootstrap-vue/es/components';
Vue.use(Card);
Vue.use(Form);
Vue.use(FormInput);
Vue.use(FormSelect);
Vue.use(InputGroup);
Vue.use(FormGroup);
Vue.use(Button);
Vue.use(Progress);
Vue.use(Table);
Vue.use(Layout);
Vue.use(ButtonGroup);

Vue.use(Vue2Filters);
Vue.use(VueMoment);

new Vue({
    el:     '#app',
    render: h => h(App)
});
