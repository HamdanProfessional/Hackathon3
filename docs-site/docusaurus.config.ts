import type { Config } from '@docusaurus/types';

const config: Config = {
  title: 'LearnFlow Documentation',
  tagline: 'AI-powered Python learning platform with autonomous deployment',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://learnflow.dev',
  // Set the /<baseUrl>/ by default to GitHub pages deployment path.
  baseUrl: '/',

  // GitHub pages deployment config.
  organizationName: 'learnflow',
  projectName: 'learnflow-docs',
  deploymentBranch: 'gh-pages',
  trailingSlash: false,

  onBrokenLinks: 'warn',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'ignore',
    },
  },

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese,
  // you may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/learnflow/docs/tree/main/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      },
    ],
  ],

  themes: [
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        hashed: true,
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
        indexDocs: true,
        indexPages: true,
        indexBlog: false,
        docsRouteBasePath: '/',
        searchResultLimits: 8,
        searchResultContextMaxLength: 50,
      },
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'LearnFlow',
      logo: {
        alt: 'LearnFlow Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'mainSidebar',
          position: 'left',
          label: 'Documentation',
        },
        {
          href: 'https://github.com/learnflow/learnflow',
          label: 'GitHub',
          position: 'right',
        },
        {
          type: 'html',
          position: 'right',
          value: '<span class="nebula-badge" style="background: rgba(139, 92, 246, 0.2); color: #a78bfa; padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; border: 1px solid rgba(139, 92, 246, 0.3);">v1.0.0</span>',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Documentation Home',
              to: '/',
            },
            {
              label: 'Architecture',
              to: '/architecture-complete',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/learnflow/learnflow',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Skills Catalog',
              to: '/SKILLS_CATALOG',
            },
            {
              label: 'Architecture',
              to: '/architecture-complete',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} LearnFlow. Built with Docusaurus.`,
    },
    prism: {
      theme: {
        plain: {},
        styles: [],
      },
      additionalLanguages: ['python', 'typescript', 'bash', 'yaml', 'json'],
    },
    docs: {
      sidebar: {
        hideable: true,
        autoCollapseCategories: true,
      },
    },
    announcementBar: {
      id: 'announcement_bar',
      content: 'LearnFlow v1.0.0 - AI-powered Python learning platform',
      backgroundColor: 'rgba(139, 92, 246, 0.2)',
      textColor: '#a78bfa',
      isCloseable: true,
    },
  } satisfies Preset.ThemeConfig,

  plugins: [],
};

export default config;
