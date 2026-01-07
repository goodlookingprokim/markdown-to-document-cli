/**
 * Choice Utilities
 * 
 * Generate choice lists for inquirer prompts
 */

import inquirer from 'inquirer';
import chalk from 'chalk';
import { TYPOGRAPHY_PRESETS, COVER_THEMES } from './constants.js';
import type { MarkdownAnalysisResult } from '../services/MarkdownAnalyzer.js';

type ChoiceOption = { name: string; value: string } | inquirer.Separator;

/**
 * Get typography preset choices with recommended preset highlighted
 */
export function getTypographyPresetChoices(analysisResult: MarkdownAnalysisResult): ChoiceOption[] {
    const presetCategories = {
        'Basic': ['novel', 'presentation', 'review', 'ebook'],
        'Content-focused': ['text_heavy', 'table_heavy', 'image_heavy', 'balanced'],
        'Document Type': ['report', 'manual', 'magazine'],
    };

    const choices: ChoiceOption[] = [];

    for (const [category, presetIds] of Object.entries(presetCategories)) {
        choices.push(new inquirer.Separator(chalk.bold(`\n── ${category} ──`)));

        for (const presetId of presetIds) {
            const preset = TYPOGRAPHY_PRESETS[presetId];
            if (preset) {
                const isRecommended = presetId === analysisResult.recommendedPreset;
                const name = isRecommended
                    ? chalk.green(`★ ${preset.name}`) + chalk.gray(` - ${preset.description}`) + chalk.green(' (권장)')
                    : chalk.cyan(preset.name) + chalk.gray(` - ${preset.description}`);
                choices.push({ name, value: presetId });
            }
        }
    }

    return choices;
}

/**
 * Get simplified preset choices (top 6 most useful)
 */
export function getSimplifiedPresetChoices(recommendedPreset: string): ChoiceOption[] {
    const topPresets = ['ebook', 'novel', 'report', 'presentation', 'table_heavy', 'image_heavy'];

    return topPresets.map(presetId => {
        const preset = TYPOGRAPHY_PRESETS[presetId];
        if (!preset) return null;

        const isRecommended = presetId === recommendedPreset;
        const name = isRecommended
            ? chalk.green(`★ ${preset.name}`) + chalk.gray(` - ${preset.description}`)
            : chalk.cyan(preset.name) + chalk.gray(` - ${preset.description}`);
        return { name, value: presetId };
    }).filter((choice): choice is { name: string; value: string } => choice !== null);
}

/**
 * Get cover theme choices grouped by category
 */
export function getCoverThemeChoices(): ChoiceOption[] {
    const themeCategories: Record<string, string[]> = {
        'Basic': ['apple', 'modern_gradient', 'dark_tech', 'nature', 'classic_book', 'minimalist'],
        'Professional': ['corporate', 'academic', 'magazine'],
        'Creative': ['sunset', 'ocean', 'aurora', 'rose_gold'],
        'Seasonal': ['spring', 'autumn', 'winter'],
    };

    const choices: ChoiceOption[] = [];

    for (const [category, themeIds] of Object.entries(themeCategories)) {
        choices.push(new inquirer.Separator(chalk.bold(`\n── ${category} ──`)));

        for (const themeId of themeIds) {
            const theme = COVER_THEMES[themeId];
            if (theme) {
                choices.push({
                    name: chalk.cyan(theme.name) + chalk.gray(` - ${theme.description}`),
                    value: themeId,
                });
            }
        }
    }

    return choices;
}

/**
 * Get simplified cover theme choices (top 6)
 */
export function getSimplifiedThemeChoices(): ChoiceOption[] {
    const topThemes = ['apple', 'modern_gradient', 'academic', 'corporate', 'minimalist', 'classic_book'];

    return topThemes.map(themeId => {
        const theme = COVER_THEMES[themeId];
        if (!theme) return null;
        return {
            name: chalk.cyan(theme.name) + chalk.gray(` - ${theme.description}`),
            value: themeId,
        };
    }).filter((choice): choice is { name: string; value: string } => choice !== null);
}
