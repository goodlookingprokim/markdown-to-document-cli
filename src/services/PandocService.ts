/**
 * Pandoc Service - EPUB/PDF Conversion Engine
 */

import { execFile } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import type { PandocInfo, ConversionOptions, TypographyPresetId } from '../types/index.js';
import { getTempDir, Logger } from '../utils/common.js';
import { TypographyService } from './TypographyService.js';
import { FontSubsetter } from './FontSubsetter.js';

const execFileAsync = promisify(execFile);

// Get writable temp directory for Pandoc operations
const getTempDirPath = (): string => {
    const tempDir = path.join(os.tmpdir(), 'markdown-to-document-pandoc');
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
    }
    return tempDir;
};

export interface EpubConversionOptions {
    inputPath: string;
    outputPath: string;
    title: string;
    author?: string;
    language?: string;
    coverImagePath?: string;
    cssPath?: string;
    typographyPreset?: TypographyPresetId;
    tocDepth?: number;
    epubVersion?: '2' | '3';
    metadata?: Record<string, string>;
    enableFontSubsetting?: boolean;
    content?: string;
}

export interface PdfConversionOptions {
    inputPath: string;
    outputPath: string;
    title: string;
    author?: string;
    language?: string;
    cssPath?: string;
    typographyPreset?: TypographyPresetId;
    pdfEngine?: 'pdflatex' | 'xelatex' | 'weasyprint';
    paperSize?: string;
    marginTop?: string;
    marginBottom?: string;
    marginLeft?: string;
    marginRight?: string;
    tocDepth?: number;
    includeToc?: boolean;
    enableFontSubsetting?: boolean;
    content?: string;
}

export class PandocService {
    private pandocPath: string;
    private majorVersion: number = 0;
    private typographyService: TypographyService;
    private fontSubsetter: FontSubsetter;

    constructor(pandocPath: string = '') {
        this.pandocPath = pandocPath;
        this.typographyService = new TypographyService();
        this.fontSubsetter = new FontSubsetter(path.join(getTempDirPath(), 'font-cache'));
    }

    /**
     * Check if Pandoc is available
     */
    async checkPandocAvailable(): Promise<PandocInfo> {
        const parseVersion = (stdout: string): { version: string; majorVersion: number } => {
            const versionMatch = stdout.match(/pandoc\s+(\d+)\.(\d+)(?:\.(\d+))?/);
            if (versionMatch) {
                const major = parseInt(versionMatch[1], 10);
                this.majorVersion = major;
                return {
                    version: versionMatch[0].replace('pandoc ', ''),
                    majorVersion: major,
                };
            }
            return { version: 'unknown', majorVersion: 0 };
        };

        // If path is specified, try it first
        if (this.pandocPath) {
            try {
                const { stdout } = await execFileAsync(this.pandocPath, ['--version']);
                const { version, majorVersion } = parseVersion(stdout);
                return {
                    available: true,
                    version,
                    majorVersion,
                    path: this.pandocPath,
                };
            } catch (error) {
                // Fall through to auto-detection
            }
        }

        // Auto-detect: try platform-specific paths
        const alternativePaths = this.getAlternativePandocPaths();

        for (const altPath of alternativePaths) {
            try {
                const { stdout } = await execFileAsync(altPath, ['--version']);
                const { version, majorVersion } = parseVersion(stdout);
                this.pandocPath = altPath;
                return {
                    available: true,
                    version,
                    majorVersion,
                    path: altPath,
                };
            } catch {
                continue;
            }
        }

        return {
            available: false,
            error: 'Pandoc을 찾을 수 없습니다. Pandoc을 설치하세요: https://pandoc.org/installing.html',
        };
    }

    /**
     * Get platform-specific Pandoc paths to search
     */
    private getAlternativePandocPaths(): string[] {
        const platform = process.platform;

        if (platform === 'win32') {
            const userProfile = process.env.USERPROFILE || 'C:\\Users\\Default';
            return [
                'C:\\Program Files\\Pandoc\\pandoc.exe',
                'C:\\Program Files (x86)\\Pandoc\\pandoc.exe',
                `${userProfile}\\AppData\\Local\\Pandoc\\pandoc.exe`,
                `${userProfile}\\scoop\\shims\\pandoc.exe`,
                'C:\\ProgramData\\chocolatey\\bin\\pandoc.exe',
                'pandoc',
            ];
        } else if (platform === 'darwin') {
            return [
                '/usr/local/bin/pandoc',
                '/opt/homebrew/bin/pandoc',
                '/usr/bin/pandoc',
                `${process.env.HOME}/.local/bin/pandoc`,
                'pandoc',
            ];
        } else {
            return [
                '/usr/bin/pandoc',
                '/usr/local/bin/pandoc',
                `${process.env.HOME}/.local/bin/pandoc`,
                '/snap/bin/pandoc',
                '/var/lib/flatpak/exports/bin/pandoc',
                'pandoc',
            ];
        }
    }

    /**
     * Convert markdown to EPUB
     */
    async toEpub(options: EpubConversionOptions): Promise<{ success: boolean; error?: string }> {
        const args = await this.buildEpubArgs(options);

        Logger.debug('[Pandoc] Converting to EPUB:', {
            title: options.title,
            inputPath: options.inputPath,
            outputPath: options.outputPath,
        });

        try {
            await execFileAsync(this.pandocPath, args, {
                maxBuffer: 50 * 1024 * 1024,
                cwd: getTempDir(),
                env: { ...process.env, TMPDIR: getTempDir() },
            });
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : String(error),
            };
        }
    }

    /**
     * Convert markdown to PDF
     */
    async toPdf(options: PdfConversionOptions): Promise<{ success: boolean; error?: string }> {
        const args = await this.buildPdfArgs(options);

        Logger.debug('[Pandoc] Converting to PDF:', {
            title: options.title,
            inputPath: options.inputPath,
            outputPath: options.outputPath,
        });

        try {
            await execFileAsync(this.pandocPath, args, {
                maxBuffer: 50 * 1024 * 1024,
                cwd: getTempDir(),
                env: { ...process.env, TMPDIR: getTempDir() },
            });
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : String(error),
            };
        }
    }

    /**
     * Build Pandoc command arguments for EPUB
     */
    private async buildEpubArgs(options: EpubConversionOptions): Promise<string[]> {
        const args: string[] = [];

        args.push(options.inputPath);
        args.push('-o', options.outputPath);

        // Cover image
        if (options.coverImagePath && fs.existsSync(options.coverImagePath)) {
            args.push(`--epub-cover-image=${options.coverImagePath}`);
        }

        // CSS styling with typography preset
        let cssPath = options.cssPath;

        // Generate typography CSS if preset is specified
        if (options.typographyPreset) {
            cssPath = await this.generateTypographyCSS(
                options.typographyPreset,
                'epub',
                cssPath,
                {
                    content: options.content,
                    enableFontSubsetting: options.enableFontSubsetting,
                }
            );
        }

        if (cssPath && fs.existsSync(cssPath)) {
            args.push(`--css=${cssPath}`);
        }

        // Table of contents
        args.push('--toc');
        args.push('--toc-depth', String(options.tocDepth || 2));

        // EPUB version (only for Pandoc < 3.0)
        if (this.majorVersion < 3) {
            if (options.epubVersion === '2') {
                args.push('--epub-version=2');
            } else {
                args.push('--epub-version=3');
            }
        }

        // Chapter level
        if (this.majorVersion >= 3) {
            args.push('--split-level=1');
        } else {
            args.push('--epub-chapter-level=1');
        }

        args.push('--standalone');

        // Additional metadata
        if (options.metadata) {
            for (const [key, value] of Object.entries(options.metadata)) {
                args.push('--metadata', `${key}=${value}`);
            }
        }

        return args;
    }

    /**
     * Build Pandoc command arguments for PDF
     */
    private async buildPdfArgs(options: PdfConversionOptions): Promise<string[]> {
        const args: string[] = [];

        args.push(options.inputPath);
        args.push('-o', options.outputPath);

        // PDF engine
        const engine = options.pdfEngine || 'weasyprint';
        const enginePath = this.findPdfEnginePath(engine);
        args.push(`--pdf-engine=${enginePath}`);

        // CSS styling
        if (options.cssPath && fs.existsSync(options.cssPath)) {
            args.push(`--css=${options.cssPath}`);
        }

        // Table of contents
        if (options.includeToc !== false) {
            args.push('--toc');
            args.push('--toc-depth', String(options.tocDepth || 2));
        }

        // Page settings for non-weasyprint engines
        if (engine !== 'weasyprint') {
            args.push('-V', `papersize:${options.paperSize || 'a4'}`);
            if (options.marginTop) args.push('-V', `margin-top:${options.marginTop}`);
            if (options.marginBottom) args.push('-V', `margin-bottom:${options.marginBottom}`);
            if (options.marginLeft) args.push('-V', `margin-left:${options.marginLeft}`);
            if (options.marginRight) args.push('-V', `margin-right:${options.marginRight}`);

            // Korean font support for latex engines
            args.push('-V', 'mainfont:Apple SD Gothic Neo');
            args.push('-V', 'CJKmainfont:Apple SD Gothic Neo');
        }

        args.push('--standalone');

        return args;
    }

    /**
     * Find the full path of a PDF engine
     */
    private findPdfEnginePath(engine: string): string {
        if (engine === 'weasyprint') {
            const locations = [
                `${process.env.HOME}/.local/bin/weasyprint`,
                '/usr/local/bin/weasyprint',
                '/opt/homebrew/bin/weasyprint',
                '/usr/bin/weasyprint',
            ];
            for (const loc of locations) {
                if (fs.existsSync(loc)) {
                    return loc;
                }
            }
        }
        return engine;
    }

    /**
     * Generate typography CSS with font subsetting
     */
    private async generateTypographyCSS(
        presetId: TypographyPresetId,
        format: 'epub' | 'pdf',
        customCssPath?: string,
        options?: {
            content?: string;
            enableFontSubsetting?: boolean;
        }
    ): Promise<string> {
        const preset = this.typographyService.getPreset(presetId);
        if (!preset) {
            throw new Error(`Typography preset not found: ${presetId}`);
        }

        let css = this.typographyService.generatePresetCSS(presetId, {
            outputFormat: format,
            includePageBreaks: true,
        });

        // Add custom CSS if provided
        if (customCssPath && fs.existsSync(customCssPath)) {
            const customCss = fs.readFileSync(customCssPath, 'utf-8');
            css += '\n\n/* Custom CSS */\n' + customCss;
        }

        // Save CSS to temp file
        const tempDir = getTempDirPath();
        const cssFileName = `typography-${presetId}-${Date.now()}.css`;
        const cssPath = path.join(tempDir, cssFileName);
        fs.writeFileSync(cssPath, css, 'utf-8');

        Logger.debug(`Generated typography CSS: ${cssPath}`);

        return cssPath;
    }

    /**
     * Get installation instructions
     */
    static getInstallInstructions(): string {
        return `
## Pandoc 설치 방법

### macOS (Homebrew)
\`\`\`bash
brew install pandoc
\`\`\`

### Windows (winget)
\`\`\`bash
winget install --id JohnMacFarlane.Pandoc
\`\`\`

### Linux (apt)
\`\`\`bash
sudo apt-get install pandoc
\`\`\`

### WeasyPrint (PDF 생성용, 선택사항)
\`\`\`bash
pip install weasyprint
\`\`\`
    `.trim();
    }
}
