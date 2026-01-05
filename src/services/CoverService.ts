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
     * Generate an HTML cover for PDF
     */
    async generatePdfCoverHtml(data: CoverData): Promise<string> {
        const theme = COVER_THEMES[data.themeId] || COVER_THEMES.apple;
        const tempDir = getTempDir();
        const coverPath = path.join(tempDir, `cover-${Date.now()}.html`);

        const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;300;400;700;900&display=swap');
        @page {
            size: A4;
            margin: 0;
        }
        body {
            margin: 0;
            padding: 0;
            width: 210mm;
            height: 297mm;
            background: ${theme.style === 'gradient' ? `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})` : theme.colors.background};
            color: ${theme.colors.text};
            font-family: 'Noto Sans KR', sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .cover-frame {
            width: 180mm;
            height: 267mm;
            border: 1px solid ${theme.colors.accent}66;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 30mm 15mm;
            box-sizing: border-box;
            position: relative;
        }
        .title-group {
            text-align: center;
        }
        h1 {
            font-size: 42pt;
            font-weight: 900;
            line-height: 1.3;
            margin: 0;
            word-break: keep-all;
            text-shadow: 0 10px 20px rgba(0,0,0,0.2);
        }
        .divider {
            width: 40mm;
            height: 1pt;
            background: ${theme.colors.accent};
            margin: 20mm auto;
        }
        .author {
            font-size: 20pt;
            font-weight: 300;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            text-align: center;
        }
        .publisher {
            position: absolute;
            bottom: 20mm;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 12pt;
            opacity: 0.7;
        }
    </style>
</head>
<body>
    <div class="cover-frame">
        <div class="title-group">
            <h1>${this.escapeXml(data.title)}</h1>
            <div class="divider"></div>
        </div>
        <div class="author">${this.escapeXml(data.author || 'Unknown Author')}</div>
    </div>
</body>
</html>
        `.trim();

        fs.writeFileSync(coverPath, html, 'utf-8');
        Logger.info(`Generated PDF cover (HTML): ${coverPath}`);
        return coverPath;
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
