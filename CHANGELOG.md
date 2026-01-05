# CHANGELOG.md

All notable changes to Markdown to Document CLI will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.5] - 2026-01-05

### Fixed
- **PDF Layout Reconstruction**: 
  - Fixed major layout collapse by changing cover generation from full HTML to fragments using `--include-before-body`.
  - Implemented `box-sizing: border-box` across all elements to prevent layout calculation errors.
  - Added `#title-block-header { display: none; }` to suppress Pandoc's default title block.
  - Improved page breaking with `break-before: page` for H1 and `break-inside: avoid` for tables, code blocks, and blockquotes.
- **Korean Typography Optimization**:
  - Forced `word-break: keep-all` and `overflow-wrap: break-word` for better Korean text flow.
  - Integrated Noto Sans KR Google Fonts import into the main PDF stylesheet.
  - Added widow and orphan control (`orphans: 3`, `widows: 3`) for professional page flow.

---

## [1.1.4] - 2026-01-05

### Added
- **Automatic Cover Generation**: 
  - Integrated `CoverService` to generate professional book covers for both EPUB and PDF.
  - EPUB covers are generated as high-quality SVG images.
  - PDF covers are generated as full-page HTML templates.
  - Supports all defined themes (Apple, Modern Gradient, Dark Tech, etc.).
- **EPUB Font Embedding**:
  - Automatically embeds Noto Sans KR and Noto Serif KR fonts into EPUB files.
  - Ensures consistent typography across all e-reader devices.
- **PDF Readability Improvements**:
  - Enhanced PDF CSS template for better Korean font rendering.
  - Forced Noto Sans KR as the primary font for PDF generation via WeasyPrint.

### Fixed
- **Author/Title Recognition**:
  - Fixed "Unknown Author" issue by correctly prioritizing manual input from interactive mode.
  - Ensured metadata overrides are correctly written to the temporary Markdown frontmatter.
- **Conversion Quality**:
  - Improved CSS base styles for images, blockquotes, tables, and code blocks.

---

## [1.1.3] - 2026-01-05

### Changed
- **Interactive Mode Output Format Order**: Reordered output format options
  - Changed order to: Both EPUB and PDF, PDF only, EPUB only
  - Changed default format to 'both' for better user experience

---

## [1.1.2] - 2026-01-05

### Added
- **Custom Title and Author**: Interactive mode now allows manual input of book title and author
  - Custom title and author override auto-detected values
  - Empty values fall back to auto-detection
  - Improved flexibility for document metadata

### Changed
- **Interactive Mode UI**: Simplified header design with clean line separators
  - Replaced box-style borders with simple line separators
  - Better compatibility with various terminal widths
- **Enhanced Font Stacks**: Improved Korean font support with additional fallback fonts
  - Added Source Han Serif KR, Source Han Sans KR
  - Added AppleMyungjo, Apple SD Gothic Neo for macOS
  - Added Source Code Pro for monospace

### Fixed
- Interactive mode header rendering issues on different terminal widths

---

## [1.1.1] - 2026-01-05

### Added
- **Interactive Mode Improvements**: Enhanced user experience with better visual design
  - Box-style header with decorative borders
  - Color-coded prompts with emojis
  - Improved spinner animations
  - Better output formatting with separators

### Changed
- **Automatic Quote Removal**: File paths in interactive mode now automatically remove surrounding quotes
  - No need for users to manually remove quotes from copied paths
  - Applied to both validation and path resolution
  - Improved user experience for terminal users

### Fixed
- File path validation in interactive mode now handles quoted paths correctly

---

## [1.1.0] - 2026-01-05

### Added
- **TypographyService**: Advanced typography preset management with 4 presets (novel, presentation, review, ebook)
  - Custom font stacks for Korean fonts (Noto Sans CJK KR, Noto Serif CJK KR)
  - Detailed CSS rules for each preset
  - Page margin, line height, and heading scale configuration
- **FontSubsetter**: Font subsetting service for 99% file size reduction
  - Character extraction and analysis
  - Font caching mechanism
  - Support for WOFF2, TTF, OTF formats
- **PandocService Enhancements**: Integrated TypographyService and FontSubsetter
  - Dynamic CSS generation based on typography presets
  - Automatic typography CSS application during conversion
  - Enhanced temp directory management

### Changed
- Improved conversion quality to match original Obsidian plugin
- Better Korean font support with proper font stacks
- Enhanced CSS generation with typography presets
- Fixed fontkit import for ES module compatibility

### Fixed
- Fontkit CommonJS/ES module compatibility issues
- TypeScript type errors for fontkit API
- Typography preset CSS generation

---

## [1.0.1] - 2025-01-05

### Added
- GitHub repository integration
- Updated repository URL to goodlookingprokim/markdown-to-document-cli
- Updated homepage and bugs URLs

### Changed
- Updated package.json with correct GitHub repository information
- Updated documentation with new GitHub links

---

## [1.0.0] - 2025-01-05

### Added
- **Core Features**
  - Markdown to EPUB conversion
  - Markdown to PDF conversion
  - Simultaneous EPUB + PDF conversion
  - YAML frontmatter support
  - Automatic table of contents generation
  - Chapter splitting (H1-based)

- **Validation Modules**
  - Frontmatter validation (YAML syntax)
  - Heading validation (duplicate H1, level gaps)
  - Link validation (Obsidian links, empty URLs)
  - Image validation (alt text, file format)
  - Table validation (column consistency)
  - Syntax validation (unclosed code blocks)
  - Special character validation (emojis, ASCII diagrams)
  - Accessibility validation (H1 presence, long paragraphs)

- **Typography Presets**
  - Novel: 16pt, serif, justified, 1.8 line-height
  - Presentation: 18pt, sans-serif, left-aligned, 1.6 line-height
  - Review: 11pt, sans-serif, left-aligned, 1.4 line-height
  - Ebook: 14pt, sans-serif, justified, 1.6 line-height

- **CLI Features**
  - Interactive mode with guided prompts
  - Command-line options for all features
  - Progress indicators
  - Colored terminal output
  - Verbose logging
  - Dependency checking

- **Utilities**
  - `list-presets`: Show available typography presets
  - `list-themes`: Show available cover themes
  - `check`: Verify Pandoc installation

- **Documentation**
  - README.md with quick start guide
  - UserGuide.md with detailed usage instructions
  - Project.md with technical documentation
  - TroubleShooting.md with problem-solving guide
  - INSTALL.md with installation instructions

### Technical Details
- **Language**: TypeScript 5.3+
- **Runtime**: Node.js 18+
- **Module System**: ES Modules
- **Dependencies**:
  - commander: CLI framework
  - chalk: Terminal colors
  - ora: Loading spinners
  - inquirer: Interactive prompts
  - yaml: YAML parsing
  - fontkit: Font processing
  - glob: File pattern matching

### Dependencies
- **Required**: Node.js 18+, Pandoc 2.19+
- **Optional**: WeasyPrint (for PDF generation)

### Known Limitations
- Single file conversion only (batch processing planned for v1.5)
- Font subsetting not fully implemented (planned for v1.1)
- Cover generation not fully implemented (planned for v1.1)
- No web UI (planned for v2.0)

### Breaking Changes
- None (initial release)

---

## [Upcoming]

### [1.1.0] - Planned
- Font subsetting implementation
- Cover generation functionality
- Unit tests
- Performance improvements
- Bug fixes

### [1.5.0] - Planned
- Custom CSS templates
- Batch processing mode
- Plugin system
- More typography presets
- More cover themes

### [2.0.0] - Planned
- Web UI
- Cloud conversion
- Collaboration features
- Advanced formatting options
- Export to more formats (DOCX, RTF)

---

## Version History Format

### Version Numbering
- **Major version (X.0.0)**: Breaking changes, major features
- **Minor version (0.X.0)**: New features, backward compatible
- **Patch version (0.0.X)**: Bug fixes, minor improvements

### Change Types
- **Added**: New features
- **Changed**: Changes to existing functionality
- **Deprecated**: Features that will be removed in future
- **Removed**: Removed features
- **Fixed**: Bug fixes
- **Security**: Security vulnerability fixes

---

## Contributing to Changelog

When contributing to this project, please update this file:

1. Add entries under the `[Unreleased]` section
2. Use the format: `- **[Type]**: Description`
3. Be specific about what changed
4. Reference related issues if applicable

Example:
```markdown
### Added
- **Feature**: New typography preset for academic papers (#123)
- **CLI**: New `--batch` option for batch processing (#124)

### Fixed
- **Bug**: Fixed image path resolution on Windows (#125)
- **Performance**: Improved conversion speed for large documents (#126)
```

---

## Release Process

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Create git tag
4. Publish to NPM
5. Create GitHub release

---

**Maintained by**: 잘생김프로쌤 (bluelion79)
**Last Updated**: 2025-01-05
