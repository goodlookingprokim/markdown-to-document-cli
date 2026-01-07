/**
 * Metadata Utilities
 * 
 * Extract and parse metadata from markdown files
 */

export interface MarkdownMetadata {
    title?: string;
    author?: string;
}

/**
 * Extract metadata from frontmatter
 */
export function extractMetadata(content: string): MarkdownMetadata {
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!frontmatterMatch) return {};

    const frontmatter = frontmatterMatch[1];
    const titleMatch = frontmatter.match(/^title:\s*["']?(.+?)["']?\s*$/m);
    const authorMatch = frontmatter.match(/^author:\s*["']?(.+?)["']?\s*$/m);

    return {
        title: titleMatch?.[1]?.trim(),
        author: authorMatch?.[1]?.trim(),
    };
}
