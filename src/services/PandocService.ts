/**
 * Pandoc Service - EPUB/PDF Conversion Engine
 */

import { execFile } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import type { PandocInfo, ConversionOptions, TypographyPresetId } from '../types/index.js';
import { Logger } from '../utils/common.js';
import { getTempDir } from '../utils/fileUtils.js';
import { TypographyService } from './TypographyService.js';
import { FontSubsetter } from './FontSubsetter.js';
import { CoverService } from './CoverService.js';

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
    includeToc?: boolean;
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
    pdfEngine?: 'pdflatex' | 'xelatex' | 'weasyprint' | 'auto';
    paperSize?: string;
    marginTop?: string;
    marginBottom?: string;
    marginLeft?: string;
    marginRight?: string;
    tocDepth?: number;
    includeToc?: boolean;
    enableFontSubsetting?: boolean;
    content?: string;
    metadata?: Record<string, string>;
}

export class PandocService {
    private pandocPath: string;
    private majorVersion: number = 0;
    private typographyService: TypographyService;
    private fontSubsetter: FontSubsetter;
    private coverService: CoverService;

    constructor(pandocPath: string = '') {
        this.pandocPath = pandocPath;
        this.typographyService = new TypographyService();
        this.fontSubsetter = new FontSubsetter(path.join(getTempDirPath(), 'font-cache'));
        this.coverService = new CoverService();
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
            // Set timeout to prevent hanging (default: 120 seconds for large documents)
            const timeout = 120000; // 2 minutes

            const conversionPromise = execFileAsync(this.pandocPath, args, {
                maxBuffer: 50 * 1024 * 1024,
                cwd: getTempDir(),
                env: { ...process.env, TMPDIR: getTempDir() },
                timeout: timeout,
            });

            // Add timeout wrapper with better error message
            const timeoutPromise = new Promise<never>((_, reject) => {
                setTimeout(() => {
                    reject(new Error(
                        'PDF 변환 시간 초과 (2분).\n' +
                        '가능한 원인:\n' +
                        '  1. MiKTeX 패키지 설치 대화상자가 표시되었을 수 있습니다\n' +
                        '     → MiKTeX Console에서 "Install missing packages on-the-fly"를 "Always"로 설정하세요\n' +
                        '  2. 문서가 너무 큽니다\n' +
                        '     → 문서를 작은 단위로 나누어 변환하세요\n' +
                        '  3. PDF 엔진 문제\n' +
                        '     → --pdf-engine=weasyprint 옵션을 사용해보세요'
                    ));
                }, timeout);
            });

            await Promise.race([conversionPromise, timeoutPromise]);
            return { success: true };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);

            // Provide helpful error messages for common issues
            let enhancedError = errorMessage;

            if (errorMessage.includes('libgobject') || errorMessage.includes('libpango') || errorMessage.includes('libcairo') || errorMessage.includes('cannot load library')) {
                // GTK runtime missing on Windows
                enhancedError =
                    'WeasyPrint GTK 런타임 오류!\n\n' +
                    'WeasyPrint가 설치되어 있지만 GTK 라이브러리를 찾을 수 없습니다.\n\n' +
                    '🔧 GTK 런타임 설치 방법:\n\n' +
                    '  1. MSYS2 설치: https://www.msys2.org/\n\n' +
                    '  2. MSYS2 UCRT64 터미널에서 실행:\n' +
                    '     pacman -S mingw-w64-ucrt-x86_64-gtk3\n\n' +
                    '  3. 시스템 PATH에 추가:\n' +
                    '     C:\\msys64\\ucrt64\\bin\n\n' +
                    '  4. 새 CMD/PowerShell 창 열기 (중요!)\n\n' +
                    '  5. 확인: weasyprint --version\n\n' +
                    '📖 자세한 가이드:\n' +
                    '   https://doc.courtbouillon.org/weasyprint/stable/first_steps.html#windows';
            } else if (errorMessage.includes('ETIMEDOUT') || errorMessage.includes('timeout')) {
                enhancedError =
                    'PDF 변환 시간 초과.\n' +
                    'Windows에서 MiKTeX를 사용하는 경우:\n' +
                    '  1. MiKTeX Console 실행\n' +
                    '  2. Settings → General → "Install missing packages on-the-fly" → Always\n' +
                    '  3. 다시 시도\n\n' +
                    '또는 WeasyPrint 사용: m2d document.md --pdf-engine weasyprint';
            } else if (errorMessage.includes('killed')) {
                enhancedError =
                    'PDF 변환 프로세스가 강제 종료되었습니다.\n' +
                    '메모리 부족이거나 시스템 리소스 문제일 수 있습니다.';
            }

            return {
                success: false,
                error: enhancedError,
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

        // Metadata: Author
        if (options.author) {
            args.push('--metadata', `author=${options.author}`);
        }

        // Font Embedding - Platform-specific font paths
        const fontsToEmbed = this.getPlatformFontPaths();

        for (const fontPath of fontsToEmbed) {
            if (fs.existsSync(fontPath)) {
                args.push('--epub-embed-font', fontPath);
            }
        }

        // Cover image
        let coverPath = options.coverImagePath;
        if (!coverPath) {
            // Generate cover if theme is specified or by default
            const themeId = options.metadata?.coverTheme || 'apple';
            coverPath = await this.coverService.generateEpubCover({
                title: options.title,
                author: options.author,
                themeId: themeId,
            });
        }

        if (coverPath && fs.existsSync(coverPath)) {
            args.push(`--epub-cover-image=${coverPath}`);
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
        if (options.includeToc !== false) {
            args.push('--toc');
            args.push('--toc-depth', String(options.tocDepth || 2));
        }

        // Standalone
        args.push('--standalone');

        return args;
    }

    /**
     * Check if a PDF engine is available on the system
     */
    private async checkPdfEngineAvailable(engine: string): Promise<boolean> {
        // Method 1: Direct execution (works if in PATH)
        try {
            await execFileAsync(engine, ['--version'], { timeout: 5000 });
            return true;
        } catch {
            // Continue to next method
        }

        // Method 2: For WeasyPrint, try pip show (cross-platform reliable)
        if (engine.includes('weasyprint')) {
            const pythonCommands = process.platform === 'win32'
                ? ['python', 'python3', 'py']
                : ['python3', 'python'];

            for (const pythonCmd of pythonCommands) {
                try {
                    await execFileAsync(pythonCmd, ['-m', 'pip', 'show', 'weasyprint'], { timeout: 10000 });
                    return true;
                } catch {
                    // Continue to next python command
                }
            }
        }

        return false;
    }

    private async resolvePdfEngine(engine: 'pdflatex' | 'xelatex' | 'weasyprint' | 'auto'): Promise<{
        engine: 'pdflatex' | 'xelatex' | 'weasyprint';
        path: string;
    }> {
        if (engine === 'auto') {
            // Try engines in order of preference for Korean + typography support
            const enginePreferences: Array<{ name: 'weasyprint' | 'xelatex' | 'pdflatex'; path: string }> = [
                { name: 'weasyprint', path: this.findPdfEnginePath('weasyprint') },
                { name: 'xelatex', path: 'xelatex' },
                { name: 'pdflatex', path: 'pdflatex' },
            ];

            for (const { name, path } of enginePreferences) {
                const isAvailable = await this.checkPdfEngineAvailable(path);
                if (isAvailable) {
                    // Windows에서 LaTeX 엔진 선택 시 차단 (auto 모드)
                    // LaTeX는 HTML/CSS 기반 표지를 제대로 렌더링하지 못함
                    if (process.platform === 'win32' && (name === 'xelatex' || name === 'pdflatex')) {
                        throw new Error(
                            '⚠️ Windows에서 고품질 PDF 생성을 위해 WeasyPrint가 필요합니다.\n\n' +
                            '🔥 설치 방법:\n' +
                            '   pip install weasyprint\n\n' +
                            '📝 이유: LaTeX 엔진은 HTML/CSS 기반 표지를 제대로 렌더링하지 못합니다.\n' +
                            '   - HTML 태그 노출\n' +
                            '   - 레이아웃 깨짐\n' +
                            '   - Mac과 다른 결과\n\n' +
                            '✅ WeasyPrint 설치 후 Mac과 동일한 품질의 PDF를 받을 수 있습니다.\n\n' +
                            '💡 LaTeX 엔진을 강제로 사용하려면: --pdf-engine=xelatex'
                        );
                    }
                    Logger.debug(`[PDF Engine] Selected: ${name} (${path})`);
                    return { engine: name, path };
                }
            }

            // No engine found
            const platform = process.platform;
            if (platform === 'win32') {
                throw new Error(
                    'PDF 엔진을 찾을 수 없습니다. Windows에서는 WeasyPrint 사용을 강력히 권장합니다.\n\n' +
                    '🔥 WeasyPrint 설치 (3단계):\n\n' +
                    '  📦 1단계: Python + WeasyPrint\n' +
                    '     pip install weasyprint\n\n' +
                    '  🔧 2단계: GTK 런타임 설치 (필수!)\n' +
                    '     - MSYS2 설치: https://www.msys2.org/\n' +
                    '     - MSYS2 UCRT64 터미널에서 실행:\n' +
                    '       pacman -S mingw-w64-ucrt-x86_64-gtk3\n\n' +
                    '  🔗 3단계: PATH 설정\n' +
                    '     - 시스템 PATH에 추가: C:\\msys64\\ucrt64\\bin\n' +
                    '     - 새 터미널 열기\n\n' +
                    '  ✅ 확인: weasyprint --version\n\n' +
                    '📖 자세한 가이드: https://doc.courtbouillon.org/weasyprint/stable/first_steps.html#windows'
                );
            } else {
                throw new Error(
                    'PDF 엔진을 찾을 수 없습니다. WeasyPrint, XeLaTeX, 또는 PDFLaTeX를 설치하세요.\n' +
                    '설치 방법:\n' +
                    '  WeasyPrint: pip install weasyprint\n' +
                    '  XeLaTeX/PDFLaTeX: brew install basictex (macOS) 또는 https://www.tug.org/texlive/'
                );
            }
        }

        const path = this.findPdfEnginePath(engine);
        const isAvailable = await this.checkPdfEngineAvailable(path);

        if (!isAvailable) {
            throw new Error(
                `지정된 PDF 엔진을 찾을 수 없습니다: ${engine}\n` +
                '다른 엔진을 선택하거나 --pdf-engine=auto 옵션을 사용하세요.'
            );
        }

        // Windows에서 LaTeX 엔진을 명시적으로 지정한 경우 경고 표시
        if (process.platform === 'win32' && (engine === 'xelatex' || engine === 'pdflatex')) {
            console.warn('\n⚠️ 경고: Windows에서 LaTeX 엔진을 사용하면 Mac과 다른 결과가 나올 수 있습니다.');
            console.warn('   HTML 태그 노출, 레이아웃 차이가 발생할 수 있습니다.');
            console.warn('   권장: pip install weasyprint 후 --pdf-engine=weasyprint 사용\n');
        }

        return { engine, path };
    }

    /**
     * Build Pandoc command arguments for PDF
     */
    private async buildPdfArgs(options: PdfConversionOptions): Promise<string[]> {
        const args: string[] = [];

        // Generate cover fragment and CSS
        const themeId = options.metadata?.coverTheme || 'apple';
        const coverData = await this.coverService.generatePdfCoverData({
            title: options.title,
            author: options.author,
            themeId: themeId,
        });

        // Save cover HTML fragment to a temp file
        const tempDir = getTempDirPath();
        const coverFragmentPath = path.join(tempDir, `cover-fragment-${Date.now()}.html`);
        fs.writeFileSync(coverFragmentPath, coverData.html, 'utf-8');

        // Include cover before body
        args.push('--include-before-body', coverFragmentPath);

        args.push(options.inputPath);
        args.push('-o', options.outputPath);

        // PDF engine
        const requestedEngine = options.pdfEngine || 'auto';
        const resolvedEngine = await this.resolvePdfEngine(requestedEngine);
        args.push(`--pdf-engine=${resolvedEngine.path}`);

        // Metadata: Author
        if (options.author) {
            args.push('--metadata', `author=${options.author}`);
        }

        // CSS styling with typography preset
        let cssPath = options.cssPath;
        if (options.typographyPreset) {
            cssPath = await this.generateTypographyCSS(
                options.typographyPreset,
                'pdf',
                cssPath,
                {
                    content: options.content,
                    enableFontSubsetting: options.enableFontSubsetting,
                    additionalCss: coverData.css, // Merge cover CSS here
                }
            );
        }

        if (cssPath && fs.existsSync(cssPath)) {
            args.push(`--css=${cssPath}`);
        }

        // Table of contents
        if (options.includeToc !== false) {
            args.push('--toc');
            args.push('--toc-depth', String(options.tocDepth || 2));
        }

        // Page settings for non-weasyprint engines
        if (resolvedEngine.engine !== 'weasyprint') {
            args.push('-V', `papersize:${options.paperSize || 'a4'}`);
            if (options.marginTop) args.push('-V', `margin-top:${options.marginTop}`);
            if (options.marginBottom) args.push('-V', `margin-bottom:${options.marginBottom}`);
            if (options.marginLeft) args.push('-V', `margin-left:${options.marginLeft}`);
            if (options.marginRight) args.push('-V', `margin-right:${options.marginRight}`);

            // Korean font support for latex engines (xelatex is preferred)
            // Use platform-appropriate fonts with fallback
            const koreanFont = this.getKoreanFontForLatex();
            args.push('-V', `mainfont:${koreanFont}`);
            args.push('-V', `CJKmainfont:${koreanFont}`);
        }

        // Standalone document
        args.push('--standalone');

        return args;
    }

    /**
     * Get Korean font name for LaTeX engines based on platform
     * Returns font name that is most likely to be available
     */
    private getKoreanFontForLatex(): string {
        const platform = process.platform;

        if (platform === 'win32') {
            // Windows: Check for Noto Sans KR first, fallback to Malgun Gothic
            const windir = process.env.WINDIR || 'C:\\Windows';
            const notoPath = path.join(windir, 'Fonts', 'NotoSansKR-Regular.otf');

            if (fs.existsSync(notoPath)) {
                return 'Noto Sans KR';
            }

            // Fallback to Malgun Gothic (included in Windows by default)
            return 'Malgun Gothic';
        } else if (platform === 'darwin') {
            // macOS: Noto Sans KR is usually available
            return 'Noto Sans KR';
        } else {
            // Linux: Try Noto Sans CJK KR
            return 'Noto Sans CJK KR';
        }
    }

    /**
     * Get platform-specific font paths for embedding
     */
    private getPlatformFontPaths(): string[] {
        const platform = process.platform;

        if (platform === 'win32') {
            // Windows font paths
            const windir = process.env.WINDIR || 'C:\\Windows';
            return [
                path.join(windir, 'Fonts', 'malgun.ttf'),      // Malgun Gothic
                path.join(windir, 'Fonts', 'malgunbd.ttf'),    // Malgun Gothic Bold
                path.join(windir, 'Fonts', 'batang.ttc'),      // Batang
                path.join(windir, 'Fonts', 'gulim.ttc'),       // Gulim
            ];
        } else if (platform === 'darwin') {
            // macOS font paths
            return [
                '/System/Library/Fonts/Supplemental/NotoSansKR-Regular.otf',
                '/System/Library/Fonts/Supplemental/NotoSansKR-Bold.otf',
                '/System/Library/Fonts/Supplemental/NotoSerifKR-Regular.otf',
                '/System/Library/Fonts/Supplemental/NotoSerifKR-Bold.otf'
            ];
        } else {
            // Linux font paths
            return [
                '/usr/share/fonts/truetype/noto/NotoSansCJK-Regular.ttc',
                '/usr/share/fonts/truetype/noto/NotoSansCJK-Bold.ttc',
                '/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc',
                '/usr/share/fonts/opentype/noto/NotoSerifCJK-Regular.ttc',
            ];
        }
    }

    /**
     * Find the full path of a PDF engine
     */
    private findPdfEnginePath(engine: string): string {
        if (engine === 'weasyprint') {
            const platform = process.platform;
            let locations: string[] = [];

            if (platform === 'win32') {
                // Windows paths for WeasyPrint
                const userProfile = process.env.USERPROFILE || 'C:\\Users\\Default';
                const pythonVersions = ['Python314', 'Python313', 'Python312', 'Python311', 'Python310', 'Python39', 'Python38'];

                locations = [
                    path.join(userProfile, 'AppData', 'Local', 'Programs', 'Python', 'Python312', 'Scripts', 'weasyprint.exe'),
                    path.join(userProfile, 'AppData', 'Roaming', 'Python', 'Python312', 'Scripts', 'weasyprint.exe'),
                    'C:\\Python312\\Scripts\\weasyprint.exe',
                    'C:\\Python311\\Scripts\\weasyprint.exe',
                    'C:\\Python310\\Scripts\\weasyprint.exe',
                    'weasyprint',
                ];

                // Add dynamic Python version paths
                for (const pyVer of pythonVersions) {
                    locations.push(path.join(userProfile, 'AppData', 'Local', 'Programs', 'Python', pyVer, 'Scripts', 'weasyprint.exe'));
                    locations.push(`C:\\${pyVer}\\Scripts\\weasyprint.exe`);
                }
            } else {
                // Unix/macOS paths
                const home = process.env.HOME || '';
                locations = [
                    `${home}/.local/bin/weasyprint`,
                    '/usr/local/bin/weasyprint',
                    '/opt/homebrew/bin/weasyprint',
                    '/usr/bin/weasyprint',
                    'weasyprint',
                ];
            }

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
            additionalCss?: string;
        }
    ): Promise<string> {
        const preset = this.typographyService.getPreset(presetId);
        if (!preset) {
            throw new Error(`Typography preset not found: ${presetId}`);
        }

        let css = this.typographyService.generatePresetCSS(presetId, {
            outputFormat: format,
            includePageBreaks: true,
            additionalCss: options?.additionalCss,
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
     * Get installation instructions (platform-specific)
     */
    static getInstallInstructions(): string {
        const isWindows = process.platform === 'win32';

        if (isWindows) {
            return `
═══════════════════════════════════════════════════════════════
📋 Windows 설치 가이드 (초보자용)
═══════════════════════════════════════════════════════════════

📦 Pandoc 설치 (필수)
───────────────────────────────────────────────────────────────
1. 아래 링크에서 Windows용 설치 파일(.msi) 다운로드:
   🔗 https://github.com/jgm/pandoc/releases/latest

2. pandoc-x.x.x-windows-x86_64.msi 파일 더블클릭하여 실행

3. Next → "I accept..." 체크 → Next → Install → Finish

4. ⚠️ 중요: 새 CMD/PowerShell 창을 열고 아래 명령어로 확인:
   ┌──────────────────────────────────────────────────────┐
   │  pandoc --version                                    │
   └──────────────────────────────────────────────────────┘

📦 WeasyPrint 설치 (PDF 변환 시 필요)
───────────────────────────────────────────────────────────────
⚠️ Windows에서 WeasyPrint는 GTK 런타임이 필요합니다!

1단계: MSYS2 설치
   🔗 https://www.msys2.org/

2단계: MSYS2 설치 후 열리는 터미널에서 실행:
   ┌──────────────────────────────────────────────────────┐
   │  pacman -S mingw-w64-ucrt-x86_64-gtk3                │
   └──────────────────────────────────────────────────────┘

3단계: 환경 변수 PATH에 추가:
   ┌──────────────────────────────────────────────────────┐
   │  C:\\msys64\\ucrt64\\bin                               │
   └──────────────────────────────────────────────────────┘
   (시스템 환경 변수 편집 → Path → 새로 만들기)

4단계: 새 CMD 창에서 WeasyPrint 설치:
   ┌──────────────────────────────────────────────────────┐
   │  pip install weasyprint                              │
   └──────────────────────────────────────────────────────┘

5단계: 설치 확인:
   ┌──────────────────────────────────────────────────────┐
   │  weasyprint --version                                │
   └──────────────────────────────────────────────────────┘

💡 자세한 가이드: m2d check 명령어 실행
═══════════════════════════════════════════════════════════════
            `.trim();
        }

        // macOS/Linux instructions (unchanged)
        return `
## Pandoc 설치 방법

### macOS (Homebrew)
\`\`\`bash
brew install pandoc
\`\`\`

### Windows
\`\`\`bash
# https://github.com/jgm/pandoc/releases/latest 에서 다운로드
# 또는
choco install pandoc
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
