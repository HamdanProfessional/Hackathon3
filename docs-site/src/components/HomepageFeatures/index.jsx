import React from 'react';
import styles from './HomepageFeatures.module.css';

const FeatureList = [
  {
    title: '6 AI Agents',
    Svg: require('@site/static/img/ai-agent.svg').default,
    description: (
      <>
        Specialized agents for Triage, Concepts, Debug, Exercise, Progress, and Code Review
        providing personalized learning experiences.
      </>
    ),
  },
  {
    title: 'Event-Driven Architecture',
    Svg: require('@site/static/img/event-driven.svg').default,
    description: (
      <>
        Built with Dapr service mesh and Redpanda Kafka for scalable, real-time
        event streaming between microservices.
      </>
    ),
  },
  {
    title: 'MCP Integration',
    Svg: require('@site/static/img/mcp.svg').default,
    description: (
      <>
        4 MCP Servers with 16 tools providing Database, Kafka, K8s, and Code Execution
        capabilities to AI agents.
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={styles.feature}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
