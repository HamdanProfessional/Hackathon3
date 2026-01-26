import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/__docusaurus/debug',
    component: ComponentCreator('/__docusaurus/debug', '5ff'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/config',
    component: ComponentCreator('/__docusaurus/debug/config', '5ba'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/content',
    component: ComponentCreator('/__docusaurus/debug/content', 'a2b'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/globalData',
    component: ComponentCreator('/__docusaurus/debug/globalData', 'c3c'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/metadata',
    component: ComponentCreator('/__docusaurus/debug/metadata', '156'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/registry',
    component: ComponentCreator('/__docusaurus/debug/registry', '88c'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/routes',
    component: ComponentCreator('/__docusaurus/debug/routes', '000'),
    exact: true
  },
  {
    path: '/search',
    component: ComponentCreator('/search', '822'),
    exact: true
  },
  {
    path: '/',
    component: ComponentCreator('/', '070'),
    exact: true
  },
  {
    path: '/',
    component: ComponentCreator('/', 'aee'),
    routes: [
      {
        path: '/',
        component: ComponentCreator('/', '09f'),
        routes: [
          {
            path: '/',
            component: ComponentCreator('/', 'e26'),
            routes: [
              {
                path: '/architecture-complete',
                component: ComponentCreator('/architecture-complete', 'd27'),
                exact: true,
                sidebar: "mainSidebar"
              },
              {
                path: '/kafka-client-complete',
                component: ComponentCreator('/kafka-client-complete', 'cdc'),
                exact: true,
                sidebar: "mainSidebar"
              },
              {
                path: '/kafka-redpanda-fix-summary',
                component: ComponentCreator('/kafka-redpanda-fix-summary', 'fc3'),
                exact: true,
                sidebar: "mainSidebar"
              },
              {
                path: '/overview',
                component: ComponentCreator('/overview', '200'),
                exact: true,
                sidebar: "mainSidebar"
              },
              {
                path: '/phase-3-complete',
                component: ComponentCreator('/phase-3-complete', 'bb8'),
                exact: true,
                sidebar: "mainSidebar"
              },
              {
                path: '/phase-4-complete',
                component: ComponentCreator('/phase-4-complete', 'c90'),
                exact: true
              },
              {
                path: '/phase-4-continued-summary',
                component: ComponentCreator('/phase-4-continued-summary', '7b4'),
                exact: true
              },
              {
                path: '/phase-4-final-complete',
                component: ComponentCreator('/phase-4-final-complete', '194'),
                exact: true,
                sidebar: "mainSidebar"
              },
              {
                path: '/SKILLS_CATALOG',
                component: ComponentCreator('/SKILLS_CATALOG', 'ce1'),
                exact: true,
                sidebar: "mainSidebar"
              },
              {
                path: '/skills-autonomy-demo',
                component: ComponentCreator('/skills-autonomy-demo', 'f5a'),
                exact: true
              },
              {
                path: '/',
                component: ComponentCreator('/', 'e98'),
                exact: true,
                sidebar: "mainSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
