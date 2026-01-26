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
          id: 'phase-4-final-complete',
          label: 'Phase 4: Backend Services',
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
          id: 'SKILLS_CATALOG',
          label: 'Skills Catalog',
        },
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
