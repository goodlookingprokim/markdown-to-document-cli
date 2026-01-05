/**
 * Markdown to Document CLI - Main Entry Point
 */

import { PandocService } from './services/PandocService.js';
import { MarkdownPreprocessor } from './services/MarkdownPreprocessor.js';
import { ContentValidator } from './services/ContentValidator.js';
import type { ConversionOptions, ConversionResult } from './types/index.js';
import { DEFAULT_CONFIG } from './utils/constants.js';
import { ensureDirectory, sanitizeFilename, getTempDir } from './utils/fileUtils.js';
import { Logger } from './utils/common.js';
import * as path from 'path';
import * as fs from 'fs';

export class MarkdownToDocument {
    private pandocService: PandocService;
    private preprocessor: MarkdownPreprocessor;
    private validator: ContentValidator;

    constructor(pandocPath?: string) {
        this.pandocService = new PandocService(pandocPath);
        this.preprocessor = new MarkdownPreprocessor();
        this.validator = new ContentValidator();
    }

    /**
     * Initialize and check dependencies
     */
    async initialize(): Promise<{ success: boolean; error?: string }> {
        const pandocInfo = await this.pandocService.checkPandocAvailable();

        if (!pandocInfo.available) {
            return {
                success: false,
                error: pandocInfo.error || 'Pandoc을 찾을 수 없습니다.',
            };
        }

        Logger.info('Initialized successfully', {
            pandocVersion: pandocInfo.version,
            pandocPath: pandocInfo.path,
        });

        return { success: true };
    }

    /**
     * Convert markdown to EPUB/PDF
     */
    async convert(options: ConversionOptions): Promise<ConversionResult> {
        const errors: string[] = [];
        const warnings: string[] = [];

        try {
            // Validate input
            if (!fs.existsSync(options.inputPath)) {
                return {
                    success: false,
                    errors: [`입력 파일을 찾을 수 없습니다: ${options.inputPath}`],
                    warnings: [],
                };
            }

            // Read markdown content
            let content = fs.readFileSync(options.inputPath, 'utf-8');

            // Step 1: Validate content
            let validationReport;
            if (options.validateContent !== false) {
                validationReport = await this.validator.validate(content, options.inputPath);

                if (validationReport.errors > 0) {
                    errors.push(`검증 오류: ${validationReport.errors}개 발견`);
                }

                if (validationReport.warnings > 0) {
                    warnings.push(`검증 경고: ${validationReport.warnings}개 발견`);
                }

                // Auto-fix if enabled
                if (options.autoFix !== false && validationReport.fixedIssues > 0) {
                    content = this.validator.autoFix(content, validationReport);
                    warnings.push(`${validationReport.fixedIssues}개 문제 자동 수정됨`);
                }
            }

            // Step 2: Preprocess markdown
            const preprocessResult = await this.preprocessor.preprocess(
                content,
                options.inputPath,
                options.format === 'pdf' ? 'pdf' : 'epub'
            );

            warnings.push(...preprocessResult.warnings);

            // Step 3: Generate clean markdown with frontmatter
            const cleanMarkdown = this.preprocessor.generateCleanMarkdown(
                preprocessResult,
                options.format === 'pdf' ? 'pdf' : 'epub'
            );

            // Step 4: Write temporary markdown file
            const tempDir = getTempDir();
            const tempMarkdownPath = path.join(tempDir, 'temp.md');
            fs.writeFileSync(tempMarkdownPath, cleanMarkdown, 'utf-8');

            // Step 5: Determine output paths
            const baseName = sanitizeFilename(preprocessResult.metadata.title || 'output');
            const outputDir = options.outputPath || path.dirname(options.inputPath);
            ensureDirectory(outputDir);

            const epubPath = path.join(outputDir, `${baseName}.epub`);
            const pdfPath = path.join(outputDir, `${baseName}.pdf`);

            // Step 6: Convert to EPUB
            if (options.format === 'epub' || options.format === 'both') {
                const epubResult = await this.pandocService.toEpub({
                    inputPath: tempMarkdownPath,
                    outputPath: epubPath,
                    title: preprocessResult.metadata.title || 'Untitled',
                    author: preprocessResult.metadata.author,
                    language: preprocessResult.metadata.language,
                    coverImagePath: options.coverTheme ? undefined : undefined, // TODO: implement cover generation
                    cssPath: options.cssPath,
                    typographyPreset: options.typographyPreset,
                    tocDepth: options.tocDepth,
                    enableFontSubsetting: options.enableFontSubsetting,
                    content: cleanMarkdown,
                });

                if (!epubResult.success) {
                    errors.push(`EPUB 변환 실패: ${epubResult.error}`);
                }
            }

            // Step 7: Convert to PDF
            if (options.format === 'pdf' || options.format === 'both') {
                const pdfResult = await this.pandocService.toPdf({
                    inputPath: tempMarkdownPath,
                    outputPath: pdfPath,
                    title: preprocessResult.metadata.title || 'Untitled',
                    author: preprocessResult.metadata.author,
                    language: preprocessResult.metadata.language,
                    cssPath: options.cssPath,
                    typographyPreset: options.typographyPreset,
                    pdfEngine: options.pdfEngine,
                    paperSize: options.paperSize,
                    tocDepth: options.tocDepth,
                    includeToc: options.includeToc,
                    enableFontSubsetting: options.enableFontSubsetting,
                    content: cleanMarkdown,
                });

                if (!pdfResult.success) {
                    errors.push(`PDF 변환 실패: ${pdfResult.error}`);
                }
            }

            // Clean up temp file
            try {
                fs.unlinkSync(tempMarkdownPath);
            } catch {
                // Ignore cleanup errors
            }

            // Return result
            const success = errors.length === 0;
            return {
                success,
                epubPath: options.format === 'epub' || options.format === 'both' ? epubPath : undefined,
                pdfPath: options.format === 'pdf' || options.format === 'both' ? pdfPath : undefined,
                errors,
                warnings,
                validationReport,
            };
        } catch (error) {
            return {
                success: false,
                errors: [error instanceof Error ? error.message : String(error)],
                warnings,
            };
        }
    }

    /**
     * Get Pandoc installation instructions
     */
    static getInstallInstructions(): string {
        return PandocService.getInstallInstructions();
    }
}

// Export types
export * from './types/index.js';
export * from './types/validators.js';
export { PandocService } from './services/PandocService.js';
export { MarkdownPreprocessor } from './services/MarkdownPreprocessor.js';
export { ContentValidator } from './services/ContentValidator.js';
export { DEFAULT_CONFIG } from './utils/constants.js';
