import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/search',
    component: ComponentCreator('/search', '822'),
    exact: true
  },
  {
    path: '/',
    component: ComponentCreator('/', '9cf'),
    routes: [
      {
        path: '/',
        component: ComponentCreator('/', '057'),
        routes: [
          {
            path: '/',
            component: ComponentCreator('/', '7fc'),
            routes: [
              {
                path: '/api-reference',
                component: ComponentCreator('/api-reference', 'e3c'),
                exact: true,
                sidebar: "mainSidebar"
              },
              {
                path: '/architecture-complete',
                component: ComponentCreator('/architecture-complete', 'd27'),
                exact: true,
                sidebar: "mainSidebar"
              },
              {
                path: '/deployment/kubernetes',
                component: ComponentCreator('/deployment/kubernetes', '11d'),
                exact: true,
                sidebar: "mainSidebar"
              },
              {
                path: '/development/contributing',
                component: ComponentCreator('/development/contributing', 'bf5'),
                exact: true,
                sidebar: "mainSidebar"
              },
              {
                path: '/getting-started/installation',
                component: ComponentCreator('/getting-started/installation', '4f1'),
                exact: true,
                sidebar: "mainSidebar"
              },
              {
                path: '/getting-started/quickstart',
                component: ComponentCreator('/getting-started/quickstart', '6cd'),
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
                component: ComponentCreator('/phase-4-complete', '255'),
                exact: true,
                sidebar: "mainSidebar"
              },
              {
                path: '/phase-4-continued-summary',
                component: ComponentCreator('/phase-4-continued-summary', 'd70'),
                exact: true,
                sidebar: "mainSidebar"
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
                component: ComponentCreator('/skills-autonomy-demo', '98a'),
                exact: true,
                sidebar: "mainSidebar"
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
