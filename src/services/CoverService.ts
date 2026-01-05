/**
 * Cover Service - Generates cover pages for EPUB and PDF
 */

import * as fs from 'fs';
import * as path from 'path';
import { COVER_THEMES } from '../utils/constants.js';
import { getTempDir } from '../utils/fileUtils.js';
import { Logger } from '../utils/common.js';

export interface CoverData {
    title: string;
    author?: string;
    themeId: string;
}

export class CoverService {
    /**
     * Generate an SVG cover for EPUB
     */
    async generateEpubCover(data: CoverData): Promise<string> {
        const theme = COVER_THEMES[data.themeId] || COVER_THEMES.apple;
        const tempDir = getTempDir();
        const coverPath = path.join(tempDir, `cover-${Date.now()}.svg`);

        const svg = `
<svg width="1600" height="2400" viewBox="0 0 1600 2400" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${theme.colors.primary};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${theme.colors.secondary};stop-opacity:1" />
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="20" />
            <feOffset dx="10" dy="10" result="offsetblur" />
            <feComponentTransfer>
                <feFuncA type="linear" slope="0.5" />
            </feComponentTransfer>
            <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
            </feMerge>
        </filter>
    </defs>

    <!-- Background -->
    <rect width="100%" height="100%" fill="${theme.style === 'gradient' ? 'url(#bgGrad)' : theme.colors.background}" />
    
    <!-- Accent Line/Border -->
    <rect x="80" y="80" width="1440" height="2240" fill="none" stroke="${theme.colors.accent}" stroke-width="4" opacity="0.5" />
    
    <!-- Title Area -->
    <g filter="url(#shadow)">
        <text x="800" y="800" font-family="'Noto Sans KR', sans-serif" font-size="140" font-weight="900" fill="${theme.colors.text}" text-anchor="middle">
            ${this.wrapTextSvg(this.escapeXml(data.title), 800, 800, 1200, 160)}
        </text>
    </g>
    
    <!-- Decorative Element -->
    <line x1="400" y1="1200" x2="1200" y2="1200" stroke="${theme.colors.accent}" stroke-width="2" opacity="0.8" />
    
    <!-- Author Area -->
    <text x="800" y="2100" font-family="'Noto Sans KR', sans-serif" font-size="80" font-weight="300" fill="${theme.colors.text}" text-anchor="middle" letter-spacing="10">
        ${this.escapeXml(data.author || 'Unknown Author').toUpperCase()}
    </text>
</svg>
        `.trim();

        fs.writeFileSync(coverPath, svg, 'utf-8');
        Logger.info(`Generated EPUB cover (SVG): ${coverPath}`);
        return coverPath;
    }

    /**
     * Generate HTML fragment and CSS for PDF cover
     */
    async generatePdfCoverData(data: CoverData): Promise<{ html: string; css: string }> {
        const theme = COVER_THEMES[data.themeId] || COVER_THEMES.apple;

        const css = `
            .pdf-cover-page {
                page: cover;
                width: 100%;
                height: 100%;
                background: ${theme.style === 'gradient' ? `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})` : theme.colors.background};
                color: ${theme.colors.text};
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                text-align: center;
                position: relative;
                break-after: page;
            }
            .pdf-cover-frame {
                width: 80%;
                height: 90%;
                border: 1px solid ${theme.colors.accent}66;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                padding: 40px;
                box-sizing: border-box;
            }
            .pdf-cover-title-group h1 {
                font-size: 48pt;
                font-weight: 900;
                margin: 0;
                color: ${theme.colors.text} !important;
                border: none !important;
                padding: 0 !important;
            }
            .pdf-cover-divider {
                width: 60px;
                height: 2px;
                background: ${theme.colors.accent};
                margin: 30px auto;
            }
            .pdf-cover-author {
                font-size: 24pt;
                font-weight: 300;
                letter-spacing: 0.2em;
            }
            @page cover {
                margin: 0;
                size: A4;
            }
        `;

        const html = `
            <div class="pdf-cover-page">
                <div class="pdf-cover-frame">
                    <div class="pdf-cover-title-group">
                        <h1>${this.escapeXml(data.title)}</h1>
                        <div class="pdf-cover-divider"></div>
                    </div>
                    <div class="pdf-cover-author">${this.escapeXml(data.author || 'Unknown Author')}</div>
                </div>
            </div>
        `;

        return { html, css };
    }

    private wrapTextSvg(text: string, x: number, y: number, maxWidth: number, lineHeight: number): string {
        // Simple SVG text wrapping implementation
        // Since we can't easily calculate text width here, we'll just break by length or spaces
        if (text.length < 15) return text;

        const words = text.split(' ');
        let lines = [];
        let currentLine = '';

        for (let word of words) {
            if ((currentLine + word).length > 15) {
                lines.push(currentLine);
                currentLine = word + ' ';
            } else {
                currentLine += word + ' ';
            }
        }
        lines.push(currentLine);

        return lines.map((line, i) =>
            `<tspan x="${x}" dy="${i === 0 ? 0 : lineHeight}">${line.trim()}</tspan>`
        ).join('');
    }

    private escapeXml(unsafe: string): string {
        return unsafe.replace(/[<>&"']/g, (c) => {
            switch (c) {
                case '<': return '&lt;';
                case '>': return '&gt;';
                case '&': return '&amp;';
                case '"': return '&quot;';
                case "'": return '&apos;';
                default: return c;
            }
        });
    }
}
