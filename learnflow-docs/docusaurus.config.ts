# 📘 LearnFlow Documentation Site

type: string
url: https://learnflow.dev
baseurl: /

on:
  - type: docs
    dir: docs

# Project information
project:
  name: LearnFlow
  title: LearnFlow Documentation
  description: AI-Powered Python Learning Platform
  copyright: '2026 LearnFlow'

# Navigation
nav:
  - label: Get Started
    to: /
  - label: Architecture
    to: /architecture
  - label: API Reference
    to: /api
  - label: Deployment
    to: /deployment

theme:
  name: docusaurus
  customCss:
    - css/custom.css
  prism:
    theme: github-dark
    additionalLanguages:
      - python
      - typescript
      - bash
      - yaml
  features:
    - toc:
      minHeadingLevel: 2
      maxHeadingLevel: 3
    - search:
      version: 3
    - theme-algolia:
      indexName: learnflow_docs
      appId: YOUR_APP_ID
      apiKey: YOUR_SEARCH_API_KEY
      searchParameters:
        hitsPerPage: 10
        facets: ["version", "category"]
      contextualSearch: true
    - footer:
      copyright: '© 2026 LearnFlow. Built with Docusaurus.'

# Sidebar structure
sidebars:
  [
    {
      type: "category",
      label: "Overview",
      items: [
        { type: "doc", id: "index", label: "Introduction" },
        { type: "doc", id: "quickstart", label: "Quick Start" },
        { type: "doc", id: "architecture-overview", label: "Architecture" },
        { type: "doc", id: "demo-guide", label: "Demo Guide" },
      ]
    },
    {
      type: "category",
      label: "User Guide",
      items: [
        { type: "doc", id: "student-guide", label: "Student Guide" },
        { type: "doc", id: "teacher-guide", label: "Teacher Guide" },
      ]
    },
    {
      type: "category",
      label: "Backend",
      items: [
        { type: "doc", id: "backend-api", label: "API Reference" },
        { type: "doc", id: "mcp-usage", label: "MCP Usage Guide" },
      ]
    },
    {
      type: "category",
      label: "MCP Servers",
      items: [
        { type: "doc", id: "mcp-overview", label: "MCP Integration" },
        { type: "doc", id: "mcp-usage", label: "MCP Usage Guide" },
      ]
    },
    {
      type: "category",
      label: "Deployment",
      items: [
        { type: "doc", id: "local-setup", label: "Local Development" },
        { type: "doc", id: "kubernetes-setup", label: "Kubernetes" },
      ]
    },
  ]

# Plugin configuration
plugins: []
