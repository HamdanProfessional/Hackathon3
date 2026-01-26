/**
 * Client module for injecting starfield background
 * This runs on the client side to add the animated starfield
 */
import { useEffect } from 'react';
import useIsBrowser from '@docusaurus/useIsBrowser';

export default function Root({children}: {children: React.ReactNode}): JSX.Element {
  const isBrowser = useIsBrowser();

  useEffect(() => {
    if (!isBrowser) return;

    // Only inject once
    if (document.querySelector('.starfield')) return;

    // Create starfield container
    const starfield = document.createElement('div');
    starfield.className = 'starfield';

    // Add star layers
    const nebulaGlow = document.createElement('div');
    nebulaGlow.className = 'nebula-glow';
    starfield.appendChild(nebulaGlow);

    const dustParticles = document.createElement('div');
    dustParticles.className = 'dust-particles';
    starfield.appendChild(dustParticles);

    const starsSmall = document.createElement('div');
    starsSmall.className = 'stars stars-small';
    starfield.appendChild(starsSmall);

    const starsMedium = document.createElement('div');
    starsMedium.className = 'stars stars-medium';
    starfield.appendChild(starsMedium);

    const starsLarge = document.createElement('div');
    starsLarge.className = 'stars stars-large';
    starfield.appendChild(starsLarge);

    // Add shooting stars
    for (let i = 0; i < 3; i++) {
      const shootingStar = document.createElement('div');
      shootingStar.className = 'shooting-star';
      starfield.appendChild(shootingStar);
    }

    // Insert starfield at the beginning of body
    document.body.insertBefore(starfield, document.body.firstChild);

    // Ensure content is above starfield
    const mainContent = document.querySelector('#__docusaurus');
    if (mainContent) {
      mainContent.style.position = 'relative';
      mainContent.style.zIndex = '10';
    }
  }, [isBrowser]);

  return <>{children}</>;
}
