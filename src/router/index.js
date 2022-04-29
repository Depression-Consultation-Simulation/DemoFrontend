import Vue from 'vue'
import VueRouter from 'vue-router'
import bartBot from "../components/bartBot";
import IntroView from "../components/IntroView";
import baseBot from "../components/baseBot";
import cptBot from "../components/cptBot";
import Result from "../components/Result";
import Thank from "../components/Thank";

Vue.use(VueRouter);

const routes= [
    {
        path: '/',
        component: IntroView
    },
    {
        path: '/bot1',
        component: baseBot
    },
    {
        path: '/bot2',
        component: bartBot
    },
    {
        path: '/bot3',
        component: cptBot
    },
    {
        path: "/result",
        component : Result
    },
    {
        path: "/thank",
        component : Thank
    }
];

const router = new VueRouter({
    mode:"history",
    routes
});


export default router;