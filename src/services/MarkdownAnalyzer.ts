/**
 * Markdown Analyzer Service
 * 
 * Analyzes markdown content for Obsidian syntax and output optimization needs
 */

export interface MarkdownAnalysisResult {
    hasObsidianImages: boolean;
    hasObsidianLinks: boolean;
    hasHighlights: boolean;
    hasCallouts: boolean;
    hasLongCodeLines: boolean;
    hasComplexTables: boolean;
    hasMultipleH1: boolean;
    hasFrontmatter: boolean;
    imageCount: number;
    tableCount: number;
    codeBlockCount: number;
    wordCount: number;
    recommendPreprocess: boolean;
    recommendedPreset: string;
    issues: string[];
}

export class MarkdownAnalyzer {
    /**
     * Analyze markdown content for Obsidian syntax and output optimization needs
     */
    analyze(content: string): MarkdownAnalysisResult {
        const result: MarkdownAnalysisResult = {
            hasObsidianImages: false,
            hasObsidianLinks: false,
            hasHighlights: false,
            hasCallouts: false,
            hasLongCodeLines: false,
            hasComplexTables: false,
            hasMultipleH1: false,
            hasFrontmatter: false,
            imageCount: 0,
            tableCount: 0,
            codeBlockCount: 0,
            wordCount: 0,
            recommendPreprocess: false,
            recommendedPreset: 'ebook',
            issues: [],
        };

        // Check for YAML frontmatter
        result.hasFrontmatter = /^---\n[\s\S]*?\n---/.test(content);

        // Check for Obsidian image syntax: ![[image]]
        const obsidianImageMatches = content.match(/!\[\[([^\]]+)\]\]/g);
        result.hasObsidianImages = !!obsidianImageMatches;
        if (obsidianImageMatches) {
            result.issues.push(`Obsidian 이미지 문법 ${obsidianImageMatches.length}개 발견`);
        }

        // Check for Obsidian internal links: [[link]]
        const obsidianLinkMatches = content.match(/(?<!!)\[\[([^\]]+)\]\]/g);
        result.hasObsidianLinks = !!obsidianLinkMatches;
        if (obsidianLinkMatches) {
            result.issues.push(`Obsidian 내부 링크 ${obsidianLinkMatches.length}개 발견`);
        }

        // Check for highlights: ==text==
        const highlightMatches = content.match(/==([^=]+)==/g);
        result.hasHighlights = !!highlightMatches;
        if (highlightMatches) {
            result.issues.push(`하이라이트 문법 ${highlightMatches.length}개 발견`);
        }

        // Check for callouts: > [!type]
        const calloutMatches = content.match(/>\s*\[!(\w+)\]/g);
        result.hasCallouts = !!calloutMatches;
        if (calloutMatches) {
            result.issues.push(`콜아웃 ${calloutMatches.length}개 발견`);
        }

        // Count images (standard markdown)
        const standardImageMatches = content.match(/!\[([^\]]*)\]\([^)]+\)/g);
        result.imageCount = (obsidianImageMatches?.length || 0) + (standardImageMatches?.length || 0);

        // Count tables
        const tableMatches = content.match(/\|.*\|.*\n\|[-:| ]+\|/g);
        result.tableCount = tableMatches?.length || 0;

        // Check for complex tables (>5 columns or very long cells)
        if (tableMatches) {
            for (const table of tableMatches) {
                const columns = (table.match(/\|/g)?.length || 0) - 1;
                if (columns > 5) {
                    result.hasComplexTables = true;
                    result.issues.push('5열 초과 복잡한 표 발견');
                    break;
                }
            }
        }

        // Count code blocks and check for long lines
        const codeBlockMatches = content.match(/```[\s\S]*?```/g);
        result.codeBlockCount = codeBlockMatches?.length || 0;
        if (codeBlockMatches) {
            for (const block of codeBlockMatches) {
                const lines = block.split('\n');
                for (const line of lines) {
                    if (line.length > 100) {
                        result.hasLongCodeLines = true;
                        result.issues.push('100자 초과 코드 라인 발견 (PDF 잘림 위험)');
                        break;
                    }
                }
                if (result.hasLongCodeLines) break;
            }
        }

        // Check for multiple H1
        const h1Matches = content.match(/^#\s+[^\n]+/gm);
        result.hasMultipleH1 = (h1Matches?.length || 0) > 1;
        if (result.hasMultipleH1) {
            result.issues.push(`H1 제목 ${h1Matches?.length}개 발견 (1개 권장)`);
        }

        // Word count (rough estimate)
        const textOnly = content.replace(/```[\s\S]*?```/g, '').replace(/[#*`\[\]()]/g, '');
        result.wordCount = textOnly.split(/\s+/).filter(w => w.length > 0).length;

        // Determine if preprocessing is recommended
        result.recommendPreprocess =
            result.hasObsidianImages ||
            result.hasObsidianLinks ||
            result.hasHighlights ||
            result.hasCallouts ||
            result.hasLongCodeLines ||
            result.hasComplexTables ||
            result.hasMultipleH1;

        // Recommend typography preset based on content analysis
        if (result.imageCount > 10) {
            result.recommendedPreset = 'image_heavy';
        } else if (result.tableCount > 5) {
            result.recommendedPreset = 'table_heavy';
        } else if (result.codeBlockCount > 10) {
            result.recommendedPreset = 'manual';
        } else if (result.wordCount > 10000) {
            result.recommendedPreset = 'text_heavy';
        } else {
            result.recommendedPreset = 'balanced';
        }

        return result;
    }

    /**
     * Display analysis result to console
     */
    displayResult(result: MarkdownAnalysisResult, chalk: any): void {
        console.log(chalk.bold('📊 문서 분석 결과:\n'));

        // Statistics
        console.log(chalk.gray('  📝 단어 수:'), chalk.cyan(`약 ${result.wordCount.toLocaleString()}개`));
        console.log(chalk.gray('  🖼️  이미지:'), chalk.cyan(`${result.imageCount}개`));
        console.log(chalk.gray('  📊 표:'), chalk.cyan(`${result.tableCount}개`));
        console.log(chalk.gray('  💻 코드 블록:'), chalk.cyan(`${result.codeBlockCount}개`));
        console.log(chalk.gray('  📋 Frontmatter:'), result.hasFrontmatter ? chalk.green('있음') : chalk.yellow('없음'));

        // Issues found
        if (result.issues.length > 0) {
            console.log(chalk.yellow('\n⚠️  발견된 이슈:'));
            result.issues.forEach(issue => {
                console.log(chalk.yellow(`  • ${issue}`));
            });
        } else {
            console.log(chalk.green('\n✅ 특별한 이슈 없음 - 표준 Markdown'));
        }

        // Recommendation
        console.log(chalk.bold('\n💡 권장 사항:'));
        if (result.recommendPreprocess) {
            console.log(chalk.green('  → 문서 최적화가 필요하지만, 변환 과정에서 자동으로 적용됩니다.'));
        } else {
            console.log(chalk.blue('  → 바로 변환해도 안정적입니다.'));
        }
        console.log(chalk.gray(`  → 추천 프리셋: ${result.recommendedPreset}`));
    }
}
