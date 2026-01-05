# Markdown to Document CLI

> 🚀 전문 출판 수준의 EPUB/PDF 변환 도구

마크다운 문서를 **완벽한 품질의 EPUB/PDF**로 변환하는 CLI 도구입니다. 옵시디언 플러그인 "Markdown to Document Pro"의 핵심 기능을 NPM/NPX 패키지로 제공합니다.

## ✨ 주요 기능

### 📚 핵심 변환 기능
- **EPUB 3.3 / PDF** 형식 지원
- **4가지 타이포그래피 프리셋** (소설, 발표, 리뷰, 전자책)
- **자동 목차 생성** (계층형 네비게이션)
- **챕터별 파일 분리** (H1 기준)

### 🔍 8개 검증 모듈 (자동 수정)
1. **Frontmatter 검증**: YAML 구문 오류 자동 수정
2. **제목 검증**: H1 중복 감지, 레벨 갭 수정
3. **링크 검증**: Obsidian 링크 자동 변환 (`[[링크]]` → `[링크](링크)`)
4. **이미지 검증**: 파일 존재, 크기, alt 텍스트 확인
5. **표 검증**: 열 일관성, 헤더 자동 추가
6. **구문 검증**: 닫히지 않은 코드 블록 자동 수정
7. **특수문자 검증**: 이모지 처리, ASCII 다이어그램 경고
8. **접근성 검증**: WCAG 2.1 AA 표준 준수

### 🎨 타이포그래피 프리셋

| 프리셋 | 용도 | 특징 |
|--------|------|------|
| **소설** | 장편 소설, 에세이 | 16pt, 들여쓰기, 양쪽 정렬 |
| **발표** | 프레젠테이션, 강의 | 18pt, 큰 글씨, 넓은 여백 |
| **리뷰** | 검토용 문서 | 11pt, 촘촘한 레이아웃 |
| **전자책** | 일반 전자책 | 14pt, 균형잡힌 레이아웃 |

## 📦 설치

### NPX로 바로 사용 (설치 불필요)

```bash
npx markdown-to-document-cli input.md
```

### 전역 설치

```bash
npm install -g markdown-to-document-cli
```

### 로컬 설치

```bash
npm install markdown-to-document-cli
```

## 🚀 사용법

### 기본 사용법

```bash
# EPUB 변환
npx markdown-to-document-cli document.md

# PDF 변환
npx markdown-to-document-cli document.md --format pdf

# EPUB + PDF 동시 변환
npx markdown-to-document-cli document.md --format both

# 전역 설치 후 사용
m2d document.md
```

### 옵션

```bash
m2d document.md [options]

옵션:
  -o, --output <path>          출력 디렉토리
  -f, --format <format>        출력 형식 (epub, pdf, both) [기본값: epub]
  -t, --typography <preset>    타이포그래피 프리셋 (novel, presentation, review, ebook) [기본값: ebook]
  -c, --cover <theme>          표지 테마
  --no-validate                콘텐츠 검증 건너뛰기
  --no-auto-fix                자동 수정 비활성화
  --toc-depth <number>         목차 깊이 [기본값: 2]
  --no-toc                     목차 비활성화
  --pdf-engine <engine>        PDF 엔진 (pdflatex, xelatex, weasyprint) [기본값: weasyprint]
  --paper-size <size>          용지 크기 (a4, letter) [기본값: a4]
  --font-subsetting            폰트 서브세팅 활성화
  --css <path>                 커스텀 CSS 파일 경로
  --pandoc-path <path>         Pandoc 실행 파일 경로
  -v, --verbose                상세 출력
  -h, --help                   도움말 표시
```

### 예제

```bash
# 소설용 타이포그래피로 EPUB 변환
m2d novel.md --format epub --typography novel

# 발표용 PDF 생성
m2d presentation.md --format pdf --typography presentation --pdf-engine weasyprint

# 출력 디렉토리 지정
m2d document.md --output ./output

# 커스텀 CSS 적용
m2d document.md --css ./custom.css

# 검증 없이 빠르게 변환
m2d document.md --no-validate --no-auto-fix

# 상세 로그 출력
m2d document.md --verbose
```

### 인터랙티브 모드

```bash
m2d interactive
```

가이드에 따라 옵션을 선택할 수 있습니다.

### 프리셋 및 테마 목록

```bash
# 타이포그래피 프리셋 목록
m2d list-presets

# 표지 테마 목록
m2d list-themes

# 의존성 확인
m2d check
```

## ⚙️ 필수 요구사항

### Pandoc 설치

Pandoc 2.19+ 이상이 필요합니다.

#### macOS
```bash
brew install pandoc
```

#### Windows
```bash
winget install --id JohnMacFarlane.Pandoc
```

#### Linux
```bash
sudo apt-get install pandoc
```

### WeasyPrint (PDF 생성, 선택사항)

```bash
pip install weasyprint
```

## 📝 프로그래밍 방식 사용

```javascript
import { MarkdownToDocument } from 'markdown-to-document-cli';

const converter = new MarkdownToDocument();

// 초기화
await converter.initialize();

// 변환
const result = await converter.convert({
  inputPath: './document.md',
  outputPath: './output',
  format: 'epub',
  typographyPreset: 'ebook',
  validateContent: true,
  autoFix: true,
});

if (result.success) {
  console.log('변환 성공!', result.epubPath);
} else {
  console.error('변환 실패:', result.errors);
}
```

## 🎯 YAML Frontmatter

문서 상단에 메타데이터를 추가할 수 있습니다:

```yaml
---
title: 문서 제목
subtitle: 부제목
author: 저자명
language: ko
date: 2025-01-05
description: 문서 설명
isbn: 978-0-1234-5678-9
publisher: 출판사명
---

# 문서 내용
```

## 🔬 검증 리포트 예시

```
=== 검증 완료 ===

✅ 수정됨: 5건
  • Obsidian 링크 3개 변환
  • 코드 블록 1개 자동 닫기
  • 제목 공백 1개 조정

⚠️ 경고: 2건
  • 긴 제목 감지 (자동 조정됨)
  • ASCII 다이어그램 (이미지 권장)

❌ 오류: 0건

총 7개 문제 발견, 5개 자동 수정
```

## 📊 기술 스택

- **언어**: TypeScript 5.3+
- **런타임**: Node.js 18+
- **변환 엔진**: Pandoc 2.19+
- **CLI 프레임워크**: Commander.js
- **PDF 엔진**: WeasyPrint (선택사항)

## 🐛 문제 해결

### Pandoc을 찾을 수 없음

```bash
# Pandoc 설치 확인
pandoc --version

# 커스텀 경로 지정
m2d document.md --pandoc-path /path/to/pandoc
```

### PDF 변환 실패

```bash
# WeasyPrint 설치
pip install weasyprint

# 또는 다른 PDF 엔진 사용
m2d document.md --format pdf --pdf-engine pdflatex
```

### 이미지를 찾을 수 없음

이미지 파일이 마크다운 파일과 동일한 디렉토리 또는 `images/`, `attachments/` 폴더에 있는지 확인하세요.

## 📄 라이선스

MIT License - [LICENSE](LICENSE) 파일 참조

## 🙏 감사의 말

- [Obsidian](https://obsidian.md) 팀의 훌륭한 플랫폼
- [Pandoc](https://pandoc.org) 개발자들
- 원본 옵시디언 플러그인 [Markdown to Document Pro](https://github.com/bluelion79/obsidian-markdown-to-document)

## 📧 문의

- GitHub: [@bluelion79](https://github.com/bluelion79)
- Email: bluelion79@gmail.com

---

**Made with ❤️ by 잘생김프로쌤**
