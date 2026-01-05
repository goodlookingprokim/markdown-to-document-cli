/**
 * Constants and Configuration
 */

import type { TypographyPreset, CoverTheme } from '../types/index.js';

export const WORDS_PER_MINUTE = 200;

export const COVER_THEMES: Record<string, CoverTheme> = {
    apple: {
        id: 'apple',
        name: 'Apple Style',
        category: 'basic',
        description: 'Minimalist design inspired by Apple',
        colors: {
            primary: '#ffffff',
            secondary: '#f5f5f7',
            accent: '#0071e3',
            background: '#000000',
            text: '#ffffff'
        },
        style: 'minimal'
    },
    modern_gradient: {
        id: 'modern_gradient',
        name: 'Modern Gradient',
        category: 'basic',
        description: 'Contemporary gradient design',
        colors: {
            primary: '#667eea',
            secondary: '#764ba2',
            accent: '#f093fb',
            background: '#1a1a2e',
            text: '#ffffff'
        },
        style: 'gradient'
    },
    dark_tech: {
        id: 'dark_tech',
        name: 'Dark Tech',
        category: 'basic',
        description: 'Dark technology style',
        colors: {
            primary: '#0a0a0a',
            secondary: '#1a1a1a',
            accent: '#00ff88',
            background: '#000000',
            text: '#ffffff'
        },
        style: 'dark'
    },
    nature: {
        id: 'nature',
        name: 'Nature',
        category: 'basic',
        description: 'Nature-friendly design',
        colors: {
            primary: '#2d5016',
            secondary: '#4a7c23',
            accent: '#8bc34a',
            background: '#1b2e0d',
            text: '#ffffff'
        },
        style: 'modern'
    },
    classic_book: {
        id: 'classic_book',
        name: 'Classic Book',
        category: 'basic',
        description: 'Classic book style',
        colors: {
            primary: '#8b4513',
            secondary: '#d2691e',
            accent: '#f4a460',
            background: '#2f1810',
            text: '#f5deb3'
        },
        style: 'minimal'
    },
    minimalist: {
        id: 'minimalist',
        name: 'Minimalist',
        category: 'basic',
        description: 'Extremely simple design',
        colors: {
            primary: '#ffffff',
            secondary: '#f8f8f8',
            accent: '#333333',
            background: '#ffffff',
            text: '#000000'
        },
        style: 'minimal'
    }
};

export const TYPOGRAPHY_PRESETS: Record<string, TypographyPreset> = {
    novel: {
        id: 'novel',
        name: '소설',
        description: '장편 소설, 에세이용 - 16pt, 들여쓰기, 양쪽 정렬',
        fontSize: 16,
        lineHeight: 1.8,
        fontFamily: 'Noto Serif CJK KR, serif',
        textAlign: 'justify',
        paragraphSpacing: 0,
        features: ['indentation', 'widow-orphan-control', 'hyphenation']
    },
    presentation: {
        id: 'presentation',
        name: '발표',
        description: '프레젠테이션, 강의용 - 18pt, 큰 글씨, 넓은 여백',
        fontSize: 18,
        lineHeight: 1.6,
        fontFamily: 'Noto Sans CJK KR, sans-serif',
        textAlign: 'left',
        paragraphSpacing: 12,
        features: ['large-headings', 'clear-structure', 'readable']
    },
    review: {
        id: 'review',
        name: '리뷰',
        description: '검토용 문서 - 11pt, 촘촘한 레이아웃',
        fontSize: 11,
        lineHeight: 1.4,
        fontFamily: 'Noto Sans CJK KR, sans-serif',
        textAlign: 'left',
        paragraphSpacing: 6,
        features: ['compact', 'information-dense', 'printable']
    },
    ebook: {
        id: 'ebook',
        name: '전자책',
        description: '일반 전자책용 - 14pt, 균형잡힌 레이아웃',
        fontSize: 14,
        lineHeight: 1.6,
        fontFamily: 'Noto Sans CJK KR, sans-serif',
        textAlign: 'justify',
        paragraphSpacing: 8,
        features: ['balanced', 'readable', 'responsive']
    }
};

export const CALLOUT_TYPES = [
    'note', 'abstract', 'summary', 'tip', 'info', 'todo', 'success', 'question',
    'warning', 'failure', 'danger', 'bug', 'example', 'quote'
];

export const ATTACHMENT_FOLDERS = ['attachments', 'images', 'assets', 'media'];

export const DEFAULT_CONFIG = {
    format: 'epub' as const,
    typographyPreset: 'ebook' as const,
    coverTheme: 'apple',
    tocDepth: 2,
    includeToc: true,
    enableFontSubsetting: false,
    validateContent: true,
    autoFix: true,
    generateCover: true,
    includeCopyright: false,
    paperSize: 'a4' as const,
    pdfEngine: 'weasyprint' as const
};
