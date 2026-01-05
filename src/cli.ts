#!/usr/bin/env node

/**
 * Markdown to Document CLI
 * 
 * Usage:
 *   npx markdown-to-document-cli <input.md>
 *   m2d <input.md> [options]
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import inquirer from 'inquirer';
import { MarkdownToDocument } from './index.js';
import { DEFAULT_CONFIG, TYPOGRAPHY_PRESETS, COVER_THEMES } from './utils/constants.js';
import { Logger } from './utils/common.js';
import * as path from 'path';
import * as fs from 'fs';

const program = new Command();

// Configure CLI
program
    .name('markdown-to-document')
    .alias('m2d')
    .description('Professional-grade EPUB/PDF conversion tool for Markdown files')
    .version('1.0.0')
    .argument('<input>', 'Input markdown file path')
    .option('-o, --output <path>', 'Output directory')
    .option('-f, --format <format>', 'Output format (epub, pdf, both)', 'epub')
    .option('-t, --typography <preset>', 'Typography preset (novel, presentation, review, ebook)', 'ebook')
    .option('-c, --cover <theme>', 'Cover theme')
    .option('--no-validate', 'Skip content validation')
    .option('--no-auto-fix', 'Disable auto-fix')
    .option('--toc-depth <number>', 'Table of contents depth', '2')
    .option('--no-toc', 'Disable table of contents')
    .option('--pdf-engine <engine>', 'PDF engine (pdflatex, xelatex, weasyprint)', 'weasyprint')
    .option('--paper-size <size>', 'Paper size (a4, letter)', 'a4')
    .option('--font-subsetting', 'Enable font subsetting')
    .option('--css <path>', 'Custom CSS file path')
    .option('--pandoc-path <path>', 'Custom Pandoc executable path')
    .option('-v, --verbose', 'Verbose output')
    .action(async (input, options) => {
        try {
            // Enable verbose logging if requested
            if (options.verbose) {
                Logger.setEnabled(true);
                process.env.DEBUG = 'true';
            }

            // Resolve input path
            const inputPath = path.resolve(input);

            // Check if input file exists
            if (!fs.existsSync(inputPath)) {
                console.error(chalk.red(`❌ Error: Input file not found: ${inputPath}`));
                process.exit(1);
            }

            // Check if input is markdown
            if (!inputPath.endsWith('.md')) {
                console.error(chalk.yellow('⚠️  Warning: Input file does not have .md extension'));
            }

            console.log(chalk.cyan.bold('\n📚 Markdown to Document CLI\n'));

            // Initialize converter
            const spinner = ora('Initializing...').start();
            const converter = new MarkdownToDocument(options.pandocPath);

            const initResult = await converter.initialize();
            if (!initResult.success) {
                spinner.fail('Initialization failed');
                console.error(chalk.red(`❌ ${initResult.error}`));
                console.log(chalk.yellow('\n' + MarkdownToDocument.getInstallInstructions()));
                process.exit(1);
            }

            spinner.succeed('Initialized successfully');

            // Prepare conversion options
            const conversionOptions = {
                inputPath,
                outputPath: options.output ? path.resolve(options.output) : undefined,
                format: options.format as 'epub' | 'pdf' | 'both',
                typographyPreset: options.typography as any,
                coverTheme: options.cover,
                validateContent: options.validate !== false,
                autoFix: options.autoFix !== false,
                tocDepth: parseInt(options.tocDepth, 10),
                includeToc: options.toc !== false,
                pdfEngine: options.pdfEngine as any,
                paperSize: options.paperSize as any,
                enableFontSubsetting: options.fontSubsetting,
                cssPath: options.css ? path.resolve(options.css) : undefined,
            };

            // Show conversion info
            console.log(chalk.gray('─'.repeat(50)));
            console.log(chalk.bold('📄 Input:'), chalk.cyan(inputPath));
            console.log(chalk.bold('📤 Format:'), chalk.cyan(conversionOptions.format.toUpperCase()));
            console.log(chalk.bold('🎨 Typography:'), chalk.cyan(TYPOGRAPHY_PRESETS[conversionOptions.typographyPreset]?.name || conversionOptions.typographyPreset));
            if (conversionOptions.coverTheme) {
                console.log(chalk.bold('🖼️  Cover:'), chalk.cyan(COVER_THEMES[conversionOptions.coverTheme]?.name || conversionOptions.coverTheme));
            }
            console.log(chalk.gray('─'.repeat(50)) + '\n');

            // Start conversion
            const convertSpinner = ora('Converting document...').start();

            const result = await converter.convert(conversionOptions);

            if (result.success) {
                convertSpinner.succeed('Conversion completed!');

                // Show validation report if available
                if (result.validationReport) {
                    const report = result.validationReport;
                    console.log(chalk.gray('\n📊 Validation Report:'));

                    if (report.fixedIssues > 0) {
                        console.log(chalk.green(`  ✅ Fixed: ${report.fixedIssues} issues`));
                    }
                    if (report.warnings > 0) {
                        console.log(chalk.yellow(`  ⚠️  Warnings: ${report.warnings}`));
                    }
                    if (report.errors > 0) {
                        console.log(chalk.red(`  ❌ Errors: ${report.errors}`));
                    }
                }

                // Show warnings
                if (result.warnings.length > 0) {
                    console.log(chalk.yellow('\n⚠️  Warnings:'));
                    result.warnings.forEach(warning => {
                        console.log(chalk.yellow(`  • ${warning}`));
                    });
                }

                // Show output files
                console.log(chalk.green('\n✅ Output files:'));
                if (result.epubPath) {
                    console.log(chalk.green(`  📖 EPUB:  ${result.epubPath}`));
                }
                if (result.pdfPath) {
                    console.log(chalk.green(`  📄 PDF:   ${result.pdfPath}`));
                }

                console.log(chalk.green('\n🎉 Conversion successful!\n'));
            } else {
                convertSpinner.fail('Conversion failed');

                console.log(chalk.red('\n❌ Errors:'));
                result.errors.forEach(error => {
                    console.log(chalk.red(`  • ${error}`));
                });

                if (result.warnings.length > 0) {
                    console.log(chalk.yellow('\n⚠️  Warnings:'));
                    result.warnings.forEach(warning => {
                        console.log(chalk.yellow(`  • ${warning}`));
                    });
                }

                console.log(chalk.red('\n❌ Conversion failed!\n'));
                process.exit(1);
            }
        } catch (error) {
            console.error(chalk.red('\n❌ Unexpected error:'));
            console.error(chalk.red(error instanceof Error ? error.message : String(error)));

            if (options.verbose) {
                console.error(chalk.red('\nStack trace:'));
                console.error(error);
            }

            process.exit(1);
        }
    });

// Interactive mode
program
    .command('interactive')
    .alias('i')
    .description('Interactive mode with guided prompts')
    .action(async () => {
        console.log(chalk.cyan.bold('\n' + '─'.repeat(60)));
        console.log(chalk.cyan.bold('  Markdown to Document - Interactive Mode'));
        console.log(chalk.cyan.bold('─'.repeat(60) + '\n'));

        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'inputPath',
                message: chalk.yellow('📄 Input markdown file path:'),
                validate: (input: string) => {
                    // 자동으로 따옴표 제거
                    const cleanedInput = input.trim().replace(/^['"]|['"]$/g, '');
                    const resolvedPath = path.resolve(cleanedInput);
                    if (!fs.existsSync(resolvedPath)) {
                        return chalk.red('✗ File not found. Please enter a valid path.');
                    }
                    return true;
                },
                transformer: (input: string) => {
                    // 입력값 표시 시에도 따옴표 제거
                    return input.trim().replace(/^['"]|['"]$/g, '');
                },
            },
            {
                type: 'input',
                name: 'customTitle',
                message: chalk.yellow('📖 Book title (leave empty to use auto-detected):'),
                default: '',
            },
            {
                type: 'input',
                name: 'customAuthor',
                message: chalk.yellow('✍️  Author name (leave empty to use auto-detected):'),
                default: '',
            },
            {
                type: 'list',
                name: 'format',
                message: chalk.yellow('📤 Output format:'),
                choices: [
                    { name: chalk.green('📖 EPUB only'), value: 'epub' },
                    { name: chalk.blue('📄 PDF only'), value: 'pdf' },
                    { name: chalk.magenta('📚 Both EPUB and PDF'), value: 'both' },
                ],
                default: 'epub',
            },
            {
                type: 'list',
                name: 'typographyPreset',
                message: chalk.yellow('🎨 Typography preset:'),
                choices: Object.values(TYPOGRAPHY_PRESETS).map(preset => ({
                    name: `${chalk.cyan(preset.name)} - ${chalk.gray(preset.description)}`,
                    value: preset.id,
                })),
                default: 'ebook',
            },
            {
                type: 'list',
                name: 'coverTheme',
                message: chalk.yellow('🖼️  Cover theme (optional):'),
                choices: [
                    { name: chalk.gray('None'), value: null },
                    ...Object.values(COVER_THEMES).map(theme => ({
                        name: `${chalk.cyan(theme.name)} - ${chalk.gray(theme.description)}`,
                        value: theme.id,
                    })),
                ],
                default: null,
            },
            {
                type: 'confirm',
                name: 'validateContent',
                message: chalk.yellow('🔍 Enable content validation?'),
                default: true,
            },
            {
                type: 'confirm',
                name: 'autoFix',
                message: chalk.yellow('🔧 Enable auto-fix for detected issues?'),
                default: true,
            },
            {
                type: 'input',
                name: 'outputPath',
                message: chalk.yellow('📁 Output directory (leave empty for same as input):'),
                default: '',
            },
        ]);

        try {
            console.log(chalk.gray('\n' + '─'.repeat(60) + '\n'));

            const spinner = ora({
                text: chalk.cyan('⚙️  Initializing...'),
                spinner: 'dots',
            }).start();

            const converter = new MarkdownToDocument();

            const initResult = await converter.initialize();
            if (!initResult.success) {
                spinner.fail(chalk.red('❌ Initialization failed'));
                console.error(chalk.red(`❌ ${initResult.error}`));
                console.log(chalk.yellow('\n' + MarkdownToDocument.getInstallInstructions()));
                process.exit(1);
            }

            spinner.succeed(chalk.green('✅ Initialized successfully'));

            // 따옴표 제거 후 경로 해결
            const cleanedInputPath = answers.inputPath.trim().replace(/^['"]|['"]$/g, '');

            const conversionOptions = {
                inputPath: path.resolve(cleanedInputPath),
                outputPath: answers.outputPath ? path.resolve(answers.outputPath) : undefined,
                format: answers.format as 'epub' | 'pdf' | 'both',
                typographyPreset: answers.typographyPreset as any,
                coverTheme: answers.coverTheme as string | undefined,
                validateContent: answers.validateContent,
                autoFix: answers.autoFix,
                tocDepth: 2,
                includeToc: true,
                customTitle: answers.customTitle || undefined,
                customAuthor: answers.customAuthor || undefined,
            };

            const convertSpinner = ora({
                text: chalk.cyan('🔄 Converting document...'),
                spinner: 'dots',
            }).start();

            const result = await converter.convert(conversionOptions);

            if (result.success) {
                convertSpinner.succeed(chalk.green('✅ Conversion completed!'));

                console.log(chalk.gray('\n' + '─'.repeat(60)));
                console.log(chalk.green.bold('\n📦 Output Files:\n'));

                if (result.epubPath) {
                    console.log(chalk.green(`  📖 EPUB:  ${result.epubPath}`));
                }
                if (result.pdfPath) {
                    console.log(chalk.blue(`  📄 PDF:   ${result.pdfPath}`));
                }

                console.log(chalk.gray('\n' + '─'.repeat(60)));
                console.log(chalk.green.bold('\n🎉 Conversion successful!\n'));
            } else {
                convertSpinner.fail(chalk.red('❌ Conversion failed'));
                console.log(chalk.red('\n❌ Errors:'));
                result.errors.forEach(error => {
                    console.log(chalk.red(`  • ${error}`));
                });
                console.log(chalk.red('\n❌ Conversion failed!\n'));
                process.exit(1);
            }
        } catch (error) {
            console.error(chalk.red('\n❌ Error:'), error instanceof Error ? error.message : String(error));
            process.exit(1);
        }
    });

// List presets command
program
    .command('list-presets')
    .description('List available typography presets')
    .action(() => {
        console.log(chalk.cyan.bold('\n📝 Available Typography Presets:\n'));

        Object.values(TYPOGRAPHY_PRESETS).forEach(preset => {
            console.log(chalk.bold(`  ${preset.id}:`), chalk.cyan(preset.name));
            console.log(chalk.gray(`    ${preset.description}`));
            console.log(chalk.gray(`    Font size: ${preset.fontSize}pt | Line height: ${preset.lineHeight}`));
            console.log();
        });
    });

// List themes command
program
    .command('list-themes')
    .description('List available cover themes')
    .action(() => {
        console.log(chalk.cyan.bold('\n🎨 Available Cover Themes:\n'));

        const categories = {
            basic: 'Basic Themes',
            extended: 'Extended Themes',
        };

        Object.entries(categories).forEach(([category, title]) => {
            console.log(chalk.bold(`\n  ${title}:`));
            const themes = Object.values(COVER_THEMES).filter(t => t.category === category);
            themes.forEach(theme => {
                console.log(chalk.gray(`    • ${theme.id}: ${theme.description}`));
            });
        });
        console.log();
    });

// Check dependencies command
program
    .command('check')
    .description('Check if required dependencies are installed')
    .action(async () => {
        console.log(chalk.cyan.bold('\n🔍 Checking Dependencies...\n'));

        const converter = new MarkdownToDocument();
        const result = await converter.initialize();

        if (result.success) {
            console.log(chalk.green('✅ All dependencies are installed!\n'));
        } else {
            console.log(chalk.red('❌ Dependency check failed\n'));
            console.log(chalk.yellow(result.error || 'Unknown error'));
            console.log(chalk.yellow('\n' + MarkdownToDocument.getInstallInstructions()));
            process.exit(1);
        }
    });

// Parse arguments
program.parse(process.argv);

// Show help if no arguments provided
if (!process.argv.slice(2).length) {
    program.outputHelp();
}
