/**
 * Path Validator - Robust file path handling and validation
 * 
 * Handles common path issues:
 * - Backslash escapes in paths
 * - Quoted paths
 * - Spaces in paths
 * - Relative vs absolute paths
 * - Path existence validation
 */

import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';

export interface PathValidationResult {
    valid: boolean;
    normalizedPath?: string;
    error?: string;
    suggestions?: string[];
}

export class PathValidator {
    /**
     * Detect if a path is a Windows absolute path (drive letter or UNC)
     */
    private static isWindowsPath(inputPath: string): boolean {
        // Check for Windows drive letter patterns: C:\, D:\, etc.
        const hasDriveLetter = /^[a-zA-Z]:[\\\\]/.test(inputPath);
        // Check for UNC paths: \\server\share or //server/share
        const isUNCPath = /^[\\\\]{2}[^\\\\]+[\\\\][^\\\\]+/.test(inputPath) || /^\/\/[^\/]+\/[^\/]+/.test(inputPath);
        return hasDriveLetter || isUNCPath;
    }

    /**
     * Normalize and clean a file path
     * Handles backslashes, quotes, and other common issues
     * Properly supports Windows paths (C:\Users\...) and Unix paths (/home/...)
     */
    static normalizePath(inputPath: string): string {
        let cleaned = inputPath.trim();

        if (!cleaned) {
            return cleaned;
        }

        // Remove surrounding quotes (both single and double, properly paired)
        // Handle cases like "path", 'path', "path', or 'path"
        if ((cleaned.startsWith('"') && cleaned.endsWith('"')) ||
            (cleaned.startsWith("'") && cleaned.endsWith("'"))) {
            cleaned = cleaned.slice(1, -1);
        } else if ((cleaned.startsWith('"') || cleaned.startsWith("'")) &&
            (cleaned.endsWith('"') || cleaned.endsWith("'"))) {
            // Handle mismatched quotes
            cleaned = cleaned.slice(1, -1);
        }

        // Detect if this is a Windows path BEFORE processing backslashes
        const isWindowsPath = this.isWindowsPath(cleaned);

        if (isWindowsPath) {
            // Windows path (drive letter or UNC): Keep backslashes as path separators
            // Only handle escaped spaces in Windows paths
            cleaned = cleaned.replace(/\\ /g, ' ');

            // Convert forward slashes to backslashes for UNC paths like //Mac/Home/file.md
            if (/^\/\/[^\/]+\/[^\/]+/.test(cleaned)) {
                cleaned = cleaned.replace(/\//g, '\\');
            }

            // Normalize Windows path separators (handles mixed slashes)
            cleaned = path.normalize(cleaned);
        } else {
            // Unix/Mac path or relative path
            // Replace escaped spaces (\ ) with regular spaces
            cleaned = cleaned.replace(/\\ /g, ' ');

            // Replace other escaped characters (only for Unix-style paths)
            // This handles cases like: /Users/name\\ with\\ spaces/file.md
            cleaned = cleaned.replace(/\\(.)/g, '$1');

            // Normalize path separators
            cleaned = path.normalize(cleaned);
        }

        // Resolve to absolute path if relative
        // Note: UNC paths (\\server\share) are absolute but path.isAbsolute() may not recognize them on non-Windows
        const isUNCPath = /^[\\]{2}[^\\]+[\\][^\\]+/.test(cleaned);
        if (!path.isAbsolute(cleaned) && !isUNCPath) {
            cleaned = path.resolve(process.cwd(), cleaned);
        }

        return cleaned;
    }

    /**
     * Validate a file path and provide helpful feedback
     */
    static validatePath(inputPath: string): PathValidationResult {
        if (!inputPath || inputPath.trim() === '') {
            return {
                valid: false,
                error: '파일 경로가 비어있습니다.',
                suggestions: [
                    '파일을 터미널로 드래그 앤 드롭하세요',
                    '또는 절대 경로를 입력하세요: /Users/username/document.md'
                ]
            };
        }

        const normalizedPath = this.normalizePath(inputPath);

        // Check if file exists
        if (!fs.existsSync(normalizedPath)) {
            const suggestions = this.generatePathSuggestions(normalizedPath);
            return {
                valid: false,
                normalizedPath,
                error: `파일을 찾을 수 없습니다: ${normalizedPath}`,
                suggestions
            };
        }

        // Check if it's a file (not a directory)
        const stats = fs.statSync(normalizedPath);
        if (!stats.isFile()) {
            return {
                valid: false,
                normalizedPath,
                error: `디렉토리가 아닌 파일을 선택해야 합니다: ${normalizedPath}`,
                suggestions: [
                    '마크다운 파일(.md)을 선택하세요',
                    '디렉토리 내의 특정 파일을 지정하세요'
                ]
            };
        }

        // Check if it's a markdown file
        if (!normalizedPath.endsWith('.md')) {
            return {
                valid: false,
                normalizedPath,
                error: `마크다운 파일(.md)이 아닙니다: ${normalizedPath}`,
                suggestions: [
                    '파일 확장자가 .md인지 확인하세요',
                    '예: document.md, README.md'
                ]
            };
        }

        return {
            valid: true,
            normalizedPath
        };
    }

    /**
     * Generate helpful suggestions based on the invalid path
     */
    private static generatePathSuggestions(invalidPath: string): string[] {
        const suggestions: string[] = [];
        const dirname = path.dirname(invalidPath);
        const basename = path.basename(invalidPath);

        // Check if directory exists
        if (fs.existsSync(dirname)) {
            suggestions.push(`디렉토리는 존재합니다: ${dirname}`);

            // Try to find similar files
            try {
                const files = fs.readdirSync(dirname);
                const mdFiles = files.filter(f => f.endsWith('.md'));

                if (mdFiles.length > 0) {
                    suggestions.push(`이 디렉토리의 마크다운 파일:`);
                    mdFiles.slice(0, 5).forEach(f => {
                        suggestions.push(`  - ${path.join(dirname, f)}`);
                    });
                    if (mdFiles.length > 5) {
                        suggestions.push(`  ... 그 외 ${mdFiles.length - 5}개 파일`);
                    }
                }
            } catch {
                // Ignore permission errors
            }
        } else {
            suggestions.push('디렉토리가 존재하지 않습니다');
            suggestions.push('경로를 다시 확인하세요');
        }

        // Platform-specific guidance
        const isWindows = process.platform === 'win32';
        if (isWindows && !this.isWindowsPath(invalidPath) && invalidPath.includes('\\')) {
            suggestions.push('⚠️  경로 형식을 확인하세요');
            suggestions.push('Windows 로컬: C:\\Users\\username\\file.md');
            suggestions.push('Windows 네트워크: \\\\ServerName\\ShareName\\file.md');
            suggestions.push('파일을 드래그 앤 드롭하면 자동으로 올바른 경로가 입력됩니다');
        } else if (!isWindows && invalidPath.includes('\\')) {
            suggestions.push('⚠️  백슬래시(\\)가 포함되어 있습니다');
            suggestions.push('파일을 드래그 앤 드롭하거나 따옴표 없이 경로를 입력하세요');
        }

        return suggestions;
    }

    /**
     * Display validation error with helpful suggestions
     */
    static displayValidationError(result: PathValidationResult): void {
        console.log(chalk.red(`\n❌ ${result.error}\n`));

        if (result.suggestions && result.suggestions.length > 0) {
            console.log(chalk.yellow('💡 도움말:'));
            result.suggestions.forEach(suggestion => {
                if (suggestion.startsWith('  -')) {
                    console.log(chalk.gray(suggestion));
                } else if (suggestion.startsWith('⚠️')) {
                    console.log(chalk.yellow(`   ${suggestion}`));
                } else {
                    console.log(chalk.cyan(`   • ${suggestion}`));
                }
            });
            console.log();
        }

        console.log(chalk.cyan('📝 올바른 경로 입력 방법:'));
        console.log(chalk.gray('   1. 파일을 터미널 창으로 드래그 앤 드롭 (권장)'));

        const isWindows = process.platform === 'win32';
        if (isWindows) {
            console.log(chalk.gray('   2. 절대 경로 입력: C:\\Users\\username\\document.md'));
            console.log(chalk.gray('   3. 네트워크 경로: \\\\Mac\\Home\\document.md'));
            console.log(chalk.gray('   4. 상대 경로 입력: .\\docs\\document.md'));
        } else {
            console.log(chalk.gray('   2. 절대 경로 입력: /Users/username/document.md'));
            console.log(chalk.gray('   3. 상대 경로 입력: ./docs/document.md'));
        }
        console.log();
    }

    /**
     * Interactive path input with validation
     */
    static async promptForValidPath(initialPath?: string): Promise<string | null> {
        let attempts = 0;
        const maxAttempts = 3;

        while (attempts < maxAttempts) {
            const inputPath = initialPath || '';
            const result = this.validatePath(inputPath);

            if (result.valid && result.normalizedPath) {
                return result.normalizedPath;
            }

            this.displayValidationError(result);
            attempts++;

            if (attempts >= maxAttempts) {
                console.log(chalk.red('❌ 최대 시도 횟수를 초과했습니다.\n'));
                return null;
            }
        }

        return null;
    }

    /**
     * Quick validation for CLI arguments
     */
    static quickValidate(inputPath: string): { valid: boolean; path?: string; error?: string } {
        const result = this.validatePath(inputPath);
        return {
            valid: result.valid,
            path: result.normalizedPath,
            error: result.error
        };
    }
}
