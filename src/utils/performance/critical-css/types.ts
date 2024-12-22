export interface CriticalCSSOptions {
  dimensions: Array<{ width: number; height: number }>;
  maxEmbeddedSize: number;
  timeout: number;
  ignore?: {
    atrule?: string[];
    rule?: string[];
    decl?: string[];
  };
}

export interface CriticalCSSResult {
  css: string;
  includedSelectors: string[];
  excludedSelectors: string[];
  totalSize: number;
}