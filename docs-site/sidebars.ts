import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  mainSidebar: [
    {
      type: 'category',
      label: 'Getting Started',
      collapsible: true,
      collapsed: false,
      items: [
        {
          type: 'doc',
          id: 'intro',
          label: 'Welcome',
        },
        {
          type: 'doc',
          id: 'overview',
          label: 'Documentation Overview',
        },
        {
          type: 'doc',
          id: 'getting-started/installation',
          label: 'Installation',
        },
        {
          type: 'doc',
          id: 'getting-started/quickstart',
          label: 'Quick Start',
        },
      ],
    },
    {
      type: 'category',
      label: 'Development',
      collapsible: true,
      collapsed: true,
      items: [
        {
          type: 'doc',
          id: 'development/contributing',
          label: 'Contributing',
        },
        {
          type: 'doc',
          id: 'api-reference',
          label: 'API Reference',
        },
      ],
    },
    {
      type: 'category',
      label: 'Deployment',
      collapsible: true,
      collapsed: true,
      items: [
        {
          type: 'doc',
          id: 'deployment/kubernetes',
          label: 'Kubernetes',
        },
      ],
    },
    {
      type: 'category',
      label: 'Architecture',
      collapsible: true,
      collapsed: true,
      items: [
        {
          type: 'doc',
          id: 'architecture-complete',
          label: 'System Architecture',
        },
      ],
    },
    {
      type: 'category',
      label: 'Phase Completion',
      collapsible: true,
      collapsed: true,
      items: [
        {
          type: 'doc',
          id: 'phase-3-complete',
          label: 'Phase 3: Infrastructure',
        },
        {
          type: 'doc',
          id: 'phase-4-complete',
          label: 'Phase 4: Backend Services (Initial)',
        },
        {
          type: 'doc',
          id: 'phase-4-continued-summary',
          label: 'Phase 4: Continued',
        },
        {
          type: 'doc',
          id: 'phase-4-final-complete',
          label: 'Phase 4: Backend Services (Final)',
        },
      ],
    },
    {
      type: 'category',
      label: 'Skills & Demos',
      collapsible: true,
      collapsed: true,
      items: [
        {
          type: 'doc',
          id: 'SKILLS_CATALOG',
          label: 'Skills Catalog',
        },
        {
          type: 'doc',
          id: 'skills-autonomy-demo',
          label: 'Skills Autonomy Demo',
        },
      ],
    },
    {
      type: 'category',
      label: 'Technical',
      collapsible: true,
      collapsed: true,
      items: [
        {
          type: 'doc',
          id: 'kafka-client-complete',
          label: 'Kafka Client Setup',
        },
        {
          type: 'doc',
          id: 'kafka-redpanda-fix-summary',
          label: 'Redpanda Deployment',
        },
      ],
    },
  ],
};

export default sidebars;
