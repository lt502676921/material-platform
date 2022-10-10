export default {
  npmClient: 'npm',
  routes: [
    {
      path: '/',
      component: '@/layouts/basicLayout/basicLayout',
      routes: [
        { path: '/', component: '@/pages/index/index' },
        { path: '/detail', component: '@/pages/detail/index' },
      ],
    },
  ],
}
