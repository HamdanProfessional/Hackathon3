import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className="hero hero--primary">
      <div className="container">
        <h1 className="hero__title nebula-text-gradient">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className="hero__buttons" style={{marginTop: '2rem'}}>
          <Link
            className="button button--primary button--lg"
            to="/intro">
            Get Started
          </Link>
          <Link
            className="button button--secondary button--lg"
            to="https://github.com/learnflow/learnflow">
            GitHub Repository
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="AI-powered Python learning platform with autonomous deployment">
      <HomepageHeader />
      <main>
        <section style={{padding: '4rem 0', textAlign: 'center'}}>
          <div className="container">
            <h2 className="nebula-text-gradient" style={{fontSize: '2rem', marginBottom: '1rem'}}>
              Why LearnFlow?
            </h2>
            <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem', marginTop: '2rem'}}>
              <div style={{maxWidth: '300px', textAlign: 'left'}}>
                <h3 style={{color: 'var(--ifm-color-primary)'}}>Autonomous Deployment</h3>
                <p style={{color: 'var(--ifm-font-color-secondary)'}}>
                  Deploy the entire platform with a single command using reusable Skills built on the MCP Code Execution Pattern.
                </p>
              </div>
              <div style={{maxWidth: '300px', textAlign: 'left'}}>
                <h3 style={{color: 'var(--ifm-color-primary)'}}>Multi-Agent AI</h3>
                <p style={{color: 'var(--ifm-font-color-secondary)'}}>
                  Six specialized AI agents provide personalized learning experiences from concept explanations to code reviews.
                </p>
              </div>
              <div style={{maxWidth: '300px', textAlign: 'left'}}>
                <h3 style={{color: 'var(--ifm-color-primary)'}}>Real-Time Learning</h3>
                <p style={{color: 'var(--ifm-font-color-secondary)'}}>
                  Interactive code editor, live chat with AI tutors, and instant feedback on exercises powered by event-driven architecture.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section style={{padding: '2rem 0', textAlign: 'center', background: 'var(--nebula-bg-secondary)'}}>
          <div className="container">
            <h2 style={{marginBottom: '1.5rem'}}>Technology Stack</h2>
            <p style={{color: 'var(--ifm-font-color-secondary)', maxWidth: '600px', margin: '0 auto 2rem'}}>
              Built with modern cloud-native technologies for scalability and reliability
            </p>
            <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem'}}>
              {['Next.js 15', 'FastAPI', 'Dapr', 'Kafka', 'PostgreSQL', 'Kubernetes', 'MCP', 'OpenAI'].map(tech => (
                <span
                  key={tech}
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'var(--nebula-glow)',
                    border: '1px solid var(--ifm-color-primary)',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    color: 'var(--ifm-color-primary)'
                  }}>
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
