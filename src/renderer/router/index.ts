import {
  RouteRecordRaw,
  createRouter,
  createWebHistory,
  RouteMeta,
} from 'vue-router';

// 获取meta.ts配置
const configsMap = import.meta.glob('../views/**/meta.ts', {
  eager: true,
  import: 'default',
});
// 获取index.vue路由页面
const comps = import.meta.glob('../views/**/index.vue');
// 生成路由
const routes = Object.entries(configsMap).map(([dir, config]) => {
  let path = dir.replace('../views', '').replace('/meta.ts', '');
  const paths = path.split('/').filter(Boolean);
  const imp = comps[dir.replace('meta.ts', 'index.vue')];
  const name = paths.join('-');
  const meta = config as RouteMeta;
  meta._paths = paths;
  path = meta.default ? '/' : path;
  const route: RouteRecordRaw = {
    path,
    name,
    meta,
    component: imp,
  };
  return route;
});
// 生成树形路由
let rootRoutes: RouteRecordRaw[] = [];
routes.forEach((route: RouteRecordRaw) => {
  const children = routes.filter(e => e.meta && e.meta?.parent === route.name);
  children.forEach(child => {
    if (!route.children) route.children = [];
    route.children.push({
      ...child,
      path: (child.meta?._paths as string[]).pop()!,
    });
  });
  if (!route?.meta?.parent) {
    rootRoutes.push(route);
  }
});

console.debug('routes', rootRoutes);
export const router = createRouter({
  history: createWebHistory(),
  routes: rootRoutes,
});

export {};
declare module 'vue-router' {
  interface RouteMeta {
    /**
     * @description 是否为默认页面,{path: '/',...'}
     * @default false
     */
    default?: boolean;
    /**
     * @description 页面标题
     */
    title?: string;
    /**
     * @description 页面图标
     * @default false
     */
    icon?: string | object;
    /**
     * @description 父级路由名称
     * @default true
     */
    parent?: string;
    /**
     * @description 排序
     * @default 0
     */
    order?: number;
    /**
     * @description 路由路径
     */
    _paths?: string[];
  }
}
