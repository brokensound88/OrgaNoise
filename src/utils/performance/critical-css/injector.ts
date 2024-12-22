import { CriticalCSSResult } from './types';

export class CriticalCSSInjector {
  inject(result: CriticalCSSResult): void {
    // Create style element for critical CSS
    const style = document.createElement('style');
    style.setAttribute('data-critical', 'true');
    style.textContent = result.css;
    document.head.appendChild(style);

    // Load remaining CSS asynchronously
    this.loadDeferredCSS();
  }

  private loadDeferredCSS(): void {
    // Find all link elements with rel="stylesheet"
    const links = document.querySelectorAll('link[rel="stylesheet"]');
    
    links.forEach(link => {
      // Convert to async loading
      link.setAttribute('media', 'print');
      link.setAttribute('onload', "this.media='all'");
    });
  }
}

export const criticalCSSInjector = new CriticalCSSInjector();