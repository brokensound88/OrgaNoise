import { CriticalCSSOptions, CriticalCSSResult } from './types';

export class CriticalCSSExtractor {
  private defaultOptions: CriticalCSSOptions = {
    dimensions: [
      { width: 414, height: 896 },  // Mobile
      { width: 1200, height: 800 }, // Desktop
    ],
    maxEmbeddedSize: 50 * 1024, // 50KB
    timeout: 30000, // 30 seconds
  };

  async extract(html: string, options: Partial<CriticalCSSOptions> = {}): Promise<CriticalCSSResult> {
    const mergedOptions = { ...this.defaultOptions, ...options };
    
    // Get all stylesheets
    const styleSheets = Array.from(document.styleSheets);
    const criticalRules: string[] = [];
    const excludedRules: string[] = [];

    for (const sheet of styleSheets) {
      try {
        const rules = Array.from(sheet.cssRules);
        for (const rule of rules) {
          if (this.isCritical(rule, mergedOptions)) {
            criticalRules.push(rule.cssText);
          } else {
            excludedRules.push(rule.cssText);
          }
        }
      } catch (error) {
        console.warn('Error processing stylesheet:', error);
      }
    }

    const criticalCSS = criticalRules.join('\n');
    
    return {
      css: criticalCSS,
      includedSelectors: criticalRules,
      excludedSelectors: excludedRules,
      totalSize: new Blob([criticalCSS]).size
    };
  }

  private isCritical(rule: CSSRule, options: CriticalCSSOptions): boolean {
    if (rule instanceof CSSStyleRule) {
      // Check if selector matches any element above the fold
      try {
        const elements = document.querySelectorAll(rule.selectorText);
        for (const element of Array.from(elements)) {
          const rect = element.getBoundingClientRect();
          if (this.isAboveFold(rect, options.dimensions[0].height)) {
            return true;
          }
        }
      } catch (error) {
        return false;
      }
    }

    if (rule instanceof CSSMediaRule) {
      // Include media queries for responsive layouts
      return options.dimensions.some(dim => 
        this.matchesViewport(rule.conditionText, dim)
      );
    }

    // Include font faces and keyframes by default
    return rule instanceof CSSFontFaceRule || rule instanceof CSSKeyframesRule;
  }

  private isAboveFold(rect: DOMRect, foldHeight: number): boolean {
    return rect.top < foldHeight;
  }

  private matchesViewport(condition: string, dimension: { width: number; height: number }): boolean {
    try {
      return window.matchMedia(condition).matches;
    } catch {
      return false;
    }
  }
}

export const criticalCSSExtractor = new CriticalCSSExtractor();