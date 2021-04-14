Vue.config.devtools = true;

const router = new VueRouter({
    // // historyモードはサーバーの設定などが必要
    // mode: 'history',
    routes: [
        {
            path: '/',
            component: httpVueLoader('./components/start.vue')
        },
        {
            path: '/question',
            component: httpVueLoader('./components/question.vue')
        },
        {
            path: '/question2',
            component: httpVueLoader('./components/question2.vue')
        },
        {
            path: '/result',
            component: httpVueLoader('./components/result.vue')
        },
    ]
})

const app = new Vue({
    el: "#app",
    router
});