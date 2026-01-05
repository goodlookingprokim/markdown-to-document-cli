/**
 * Type Definitions for Markdown to Document CLI
 */

export interface ConversionOptions {
    inputPath: string;
    outputPath?: string;
    format: 'epub' | 'pdf' | 'both';
    coverTheme?: string;
    typographyPreset?: TypographyPresetId;
    enableFontSubsetting?: boolean;
    tocDepth?: number;
    includeToc?: boolean;
    paperSize?: 'a4' | 'letter';
    pdfEngine?: 'pdflatex' | 'xelatex' | 'weasyprint';
    validateContent?: boolean;
    autoFix?: boolean;
    generateCover?: boolean;
    includeCopyright?: boolean;
    cssPath?: string;
}

export interface ConversionResult {
    success: boolean;
    epubPath?: string;
    pdfPath?: string;
    errors: string[];
    warnings: string[];
    validationReport?: ValidationReport;
}

export interface DocumentMetadata {
    title: string;
    subtitle?: string;
    author?: string;
    language?: string;
    date?: string;
    description?: string;
    isbn?: string;
    publisher?: string;
    chapterCount?: number;
    wordCount?: number;
    imageCount?: number;
}

export interface ValidationReport {
    totalIssues: number;
    fixedIssues: number;
    warnings: number;
    errors: number;
    details: ValidationIssue[];
}

export interface ValidationIssue {
    type: 'error' | 'warning' | 'info';
    category: 'frontmatter' | 'heading' | 'link' | 'image' | 'table' | 'syntax' | 'accessibility';
    message: string;
    line?: number;
    fixed?: boolean;
    suggestion?: string;
}

export interface ResolvedImage {
    originalSyntax: string;
    standardSyntax: string;
    absolutePath: string;
    found: boolean;
    alt?: string;
    width?: number;
    height?: number;
}

export type TypographyPresetId = 'novel' | 'presentation' | 'review' | 'ebook';

export interface TypographyPreset {
    id: TypographyPresetId;
    name: string;
    description: string;
    fontSize: number;
    lineHeight: number;
    fontFamily: string;
    textAlign: 'left' | 'justify' | 'center';
    paragraphSpacing: number;
    features: string[];
}

export interface PandocInfo {
    available: boolean;
    version?: string;
    majorVersion?: number;
    path?: string;
    error?: string;
}

export interface PreprocessResult {
    content: string;
    metadata: DocumentMetadata;
    resolvedImages: ResolvedImage[];
    warnings: string[];
}

export interface CoverTheme {
    id: string;
    name: string;
    category: 'basic' | 'extended';
    description: string;
    colors: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
        text: string;
    };
    style: 'minimal' | 'gradient' | 'dark' | 'modern';
}
