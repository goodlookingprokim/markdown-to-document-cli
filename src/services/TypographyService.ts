/**
 * Typography Service - 타이포그래피 프리셋 관리 및 CSS 생성
 */

import * as fs from 'fs';
import * as path from 'path';

export type TypographyPresetId = 'novel' | 'presentation' | 'review' | 'ebook';

export interface TypographySettings {
    fontSize: string;
    lineHeight: number;
    textIndent?: string;
    paragraphSpacing: string;
    pageMargins: {
        top: string;
        bottom: string;
        left: string;
        right: string;
    };
    fontFamily: string;
    hyphenation: boolean;
    justification: 'left' | 'justify';
    headingScale: {
        h1: number;
        h2: number;
        h3: number;
        h4: number;
        h5: number;
        h6: number;
    };
}

export interface TypographyPreset {
    id: TypographyPresetId;
    name: string;
    nameKr: string;
    description: string;
    settings: TypographySettings;
    cssRules?: string;
}

export interface CSSGenerationOptions {
    includePageBreaks?: boolean;
    includeFonts?: boolean;
    outputFormat?: 'epub' | 'pdf';
    codeTheme?: string;
}

export class TypographyService {
    private presets: Map<string, TypographyPreset>;
    private defaultFontStacks = {
        serif: '"Noto Serif CJK KR", "Noto Serif KR", "Batang", "바탕", serif',
        sansSerif: '"Noto Sans CJK KR", "Noto Sans KR", "Malgun Gothic", "맑은 고딕", sans-serif',
        monospace: '"Noto Sans Mono CJK KR", "D2Coding", monospace',
    };

    constructor() {
        this.presets = new Map();
        this.initializePresets();
    }

    private initializePresets(): void {
        this.presets.set('novel', {
            id: 'novel',
            name: 'Novel',
            nameKr: '소설',
            description: '소설 및 에세이에 최적화된 설정',
            settings: {
                fontSize: '16pt',
                lineHeight: 1.8,
                textIndent: '2em',
                paragraphSpacing: '0.5em',
                pageMargins: {
                    top: '25mm',
                    bottom: '25mm',
                    left: '20mm',
                    right: '20mm',
                },
                fontFamily: this.defaultFontStacks.serif,
                hyphenation: true,
                justification: 'justify',
                headingScale: {
                    h1: 1.8,
                    h2: 1.6,
                    h3: 1.4,
                    h4: 1.2,
                    h5: 1.1,
                    h6: 1.0,
                },
            },
            cssRules: `
        p:first-of-type::first-letter {
          font-size: 3em;
          float: left;
          line-height: 1;
          margin-right: 0.1em;
          font-weight: bold;
        }
        hr {
          margin: 2em auto;
          width: 50%;
          border: none;
          border-top: 1px solid #999;
        }
      `,
        });

        this.presets.set('presentation', {
            id: 'presentation',
            name: 'Presentation',
            nameKr: '발표',
            description: '프레젠테이션 및 발표 자료용',
            settings: {
                fontSize: '18pt',
                lineHeight: 1.6,
                paragraphSpacing: '1em',
                pageMargins: {
                    top: '30mm',
                    bottom: '30mm',
                    left: '25mm',
                    right: '25mm',
                },
                fontFamily: this.defaultFontStacks.sansSerif,
                hyphenation: false,
                justification: 'left',
                headingScale: {
                    h1: 2.0,
                    h2: 1.8,
                    h3: 1.6,
                    h4: 1.4,
                    h5: 1.2,
                    h6: 1.1,
                },
            },
            cssRules: `
        h1, h2, h3 {
          color: #2c3e50;
          border-bottom: 2px solid #3498db;
          padding-bottom: 0.3em;
        }
      `,
        });

        this.presets.set('review', {
            id: 'review',
            name: 'Review',
            nameKr: '리뷰',
            description: '리뷰 및 기술 문서용',
            settings: {
                fontSize: '15pt',
                lineHeight: 1.7,
                paragraphSpacing: '0.8em',
                pageMargins: {
                    top: '22mm',
                    bottom: '22mm',
                    left: '22mm',
                    right: '22mm',
                },
                fontFamily: this.defaultFontStacks.sansSerif,
                hyphenation: false,
                justification: 'left',
                headingScale: {
                    h1: 1.9,
                    h2: 1.7,
                    h3: 1.5,
                    h4: 1.3,
                    h5: 1.1,
                    h6: 1.0,
                },
            },
            cssRules: `
        blockquote {
          border-left: 4px solid #3498db;
          padding-left: 1em;
          margin: 1.5em 0;
          color: #555;
        }
        code {
          background-color: #f4f4f4;
          padding: 0.2em 0.4em;
          border-radius: 3px;
          font-family: ${this.defaultFontStacks.monospace};
        }
      `,
        });

        this.presets.set('ebook', {
            id: 'ebook',
            name: 'E-book',
            nameKr: '전자책',
            description: '일반 전자책 리더에 최적화 (기본값)',
            settings: {
                fontSize: '14pt',
                lineHeight: 1.6,
                paragraphSpacing: '0.6em',
                pageMargins: {
                    top: '20mm',
                    bottom: '20mm',
                    left: '18mm',
                    right: '18mm',
                },
                fontFamily: this.defaultFontStacks.sansSerif,
                hyphenation: false,
                justification: 'left',
                headingScale: {
                    h1: 1.7,
                    h2: 1.5,
                    h3: 1.3,
                    h4: 1.2,
                    h5: 1.1,
                    h6: 1.0,
                },
            },
            cssRules: `
        body {
          orphans: 2;
          widows: 2;
        }
        h1, h2, h3 {
          page-break-after: avoid;
        }
        figure figcaption {
          font-size: 0.9em;
          text-align: center;
          font-style: italic;
          margin-top: 0.5em;
        }
      `,
        });
    }

    getPreset(id: string): TypographyPreset | undefined {
        return this.presets.get(id);
    }

    getAllPresets(): TypographyPreset[] {
        return Array.from(this.presets.values());
    }

    generatePresetCSS(presetId: string, options: CSSGenerationOptions = {}): string {
        const preset = this.presets.get(presetId);
        if (!preset) {
            throw new Error(`Typography preset not found: ${presetId}`);
        }

        const settings = preset.settings;
        const format = options.outputFormat || 'epub';
        const css: string[] = [];

        css.push('/* Typography Preset: ' + preset.nameKr + ' */');
        css.push('');

        css.push(':root {');
        css.push(`  font-size: ${settings.fontSize};`);
        css.push(`  line-height: ${settings.lineHeight};`);
        css.push('}');
        css.push('');

        css.push('body {');
        css.push(`  font-family: ${settings.fontFamily};`);
        css.push(`  font-size: 1rem;`);
        css.push(`  line-height: ${settings.lineHeight};`);
        css.push(`  text-align: ${settings.justification};`);
        if (settings.hyphenation) {
            css.push('  hyphens: auto;');
            css.push('  -webkit-hyphens: auto;');
            css.push('  -ms-hyphens: auto;');
        }
        css.push('}');
        css.push('');

        if (format === 'pdf' && options.includePageBreaks !== false) {
            css.push('@page {');
            css.push(`  margin-top: ${settings.pageMargins.top};`);
            css.push(`  margin-bottom: ${settings.pageMargins.bottom};`);
            css.push(`  margin-left: ${settings.pageMargins.left};`);
            css.push(`  margin-right: ${settings.pageMargins.right};`);
            css.push('}');
            css.push('');
        }

        css.push('p {');
        css.push(`  margin-top: ${settings.paragraphSpacing};`);
        css.push(`  margin-bottom: ${settings.paragraphSpacing};`);
        if (settings.textIndent && presetId === 'novel') {
            css.push(`  text-indent: ${settings.textIndent};`);
        }
        css.push('}');
        css.push('');

        for (const [level, scale] of Object.entries(settings.headingScale)) {
            css.push(`${level} {`);
            css.push(`  font-size: ${scale}em;`);
            css.push(`  margin-top: ${1 / scale}em;`);
            css.push(`  margin-bottom: ${0.5 / scale}em;`);
            css.push(`  font-weight: bold;`);
            css.push(`  line-height: 1.2;`);
            if (format === 'pdf' && level <= 'h3') {
                css.push(`  page-break-after: avoid;`);
            }
            css.push('}');
            css.push('');
        }

        if (preset.cssRules) {
            css.push('/* Custom styles */');
            css.push(preset.cssRules);
        }

        return css.join('\n');
    }
}
