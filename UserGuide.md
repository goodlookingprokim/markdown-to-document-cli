# UserGuide.md - 사용자 가이드

## 시작하기

Markdown to Document CLI는 마크다운 문서를 전문 출판 수준의 EPUB/PDF로 변환하는 도구입니다. 이 가이드를 통해 기본 사용법부터 고급 기능까지 학습할 수 있습니다.

## 설치

### 방법 1: NPX로 바로 사용 (추천)

설치 없이 바로 사용할 수 있습니다:

```bash
npx markdown-to-document-cli document.md
```

### 방법 2: 전역 설치

시스템 전체에서 사용하려면 전역 설치:

```bash
npm install -g markdown-to-document-cli
```

설치 후 어디서든 `m2d` 명령어로 사용:

```bash
m2d document.md
```

### 방법 3: 프로젝트 로컬 설치

프로젝트에만 설치:

```bash
npm install markdown-to-document-cli
```

`npx`로 실행:

```bash
npx markdown-to-document-cli document.md
```

## 필수 요구사항

### 1. Node.js

Node.js 18.0 이상이 필요합니다:

```bash
node --version
```

### 2. Pandoc

Pandoc 2.19 이상이 필요합니다:

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

설치 확인:
```bash
pandoc --version
```

### 3. WeasyPrint (선택사항, PDF 생성용)

```bash
pip install weasyprint
```

## 타이포그래피 프리셋

### 프리셋 개요

4가지 타이포그래피 프리셋을 제공하여 다양한 용도에 최적화된 출력을 생성합니다:

| 프리셋 | 용도 | 폰트 크기 | 줄 간격 | 정렬 |
|--------|------|-----------|---------|------|
| **소설** | 장편 소설, 에세이 | 16pt | 1.8 | 양쪽 정렬 |
| **발표** | 프레젠테이션, 강의 | 18pt | 1.6 | 왼쪽 정렬 |
| **리뷰** | 검토용 문서 | 15pt | 1.7 | 왼쪽 정렬 |
| **전자책** | 일반 전자책 | 14pt | 1.6 | 왼쪽 정렬 |

### 소설 프리셋

장편 소설과 에세이에 최적화되어 있습니다:

- **세리프 폰트**: Noto Serif CJK KR
- **들여쓰기**: 첫 문단 2em
- **양쪽 정렬**: 깔끔한 레이아웃
- **하이픈 처리**: 단어 끊기 활성화
- **페이지 나누기**: 제목에서 페이지 나눔 방지

```bash
m2d novel.md --typography novel
```

### 발표 프리셋

프레젠테이션과 강의 자료에 적합합니다:

- **산세리프 폰트**: Noto Sans CJK KR
- **큰 글씨**: 18pt 기본 크기
- **넓은 여백**: 30mm 상하 여백
- **제목 강조**: H1-H2에 밑줄 추가
- **왼쪽 정렬**: 가독성 향상

```bash
m2d presentation.md --typography presentation
```

### 리뷰 프리셋

기술 문서와 검토용 자료에 적합합니다:

- **산세리프 폰트**: Noto Sans CJK KR
- **코드 강조**: 코드 블록 배경색
- **인용구 스타일**: 왼쪽 테두리
- **촘촘한 레이아웃**: 정보 밀도 높임

```bash
m2d review.md --typography review
```

### 전자책 프리셋

일반 전자책 리더에 최적화되어 있습니다:

- **산세리프 폰트**: Noto Sans CJK KR
- **균형잡힌 레이아웃**: 14pt, 1.6 줄 간격
- **페이지 나누기**: 최적화
- **이미지 캡션**: 중앙 정렬, 이탤릭체

```bash
m2d ebook.md --typography ebook
```

## 폰트 서브세팅

### 개요

FontSubsetter는 문서에 실제 사용된 문자만 포함하여 폰트 크기를 최대 99% 감소시킵니다.

### 장점

- **파일 크기 감소**: 전체 폰트 대비 99% 크기 감소
- **빠른 로딩**: 작은 파일 크기로 빠른 로딩
- **캐싱**: 재사용을 위한 폰트 캐시
- **다양한 형식**: WOFF2, TTF, OTF 지원

### 사용법

```bash
m2d document.md --font-subsetting
```

### 작동 방식

1. 문서 내 모든 문자 추출
2. 사용된 문자만 포함하여 폰트 서브셋 생성
3. WOFF2 형식으로 변환
4. 캐시에 저장하여 재사용

### 캐시 관리

캐시는 기본적으로 프로젝트 내 `.font-cache` 디렉토리에 저장됩니다.

## 고급 기능

### 동적 CSS 생성

TypographyService는 타이포그래피 프리셋을 기반으로 동적으로 CSS를 생성합니다:

- **루트 스타일**: 폰트 크기, 줄 간격
- **본문 스타일**: 폰트 패밀리, 정렬, 하이픈
- **페이지 스타일**: 여백, 크기 (PDF)
- **단락 스타일**: 간격, 들여쓰기
- **제목 스타일**: 크기, 여백, 폰트 두께

### 커스텀 CSS

자신만의 CSS를 추가할 수 있습니다:

```bash
m2d document.md --css custom.css
```

커스텀 CSS는 타이포그래피 프리셋 CSS 뒤에 적용됩니다.

### 한국어 폰트 지원

기본 한국어 폰트 스택:

- **세리프**: Noto Serif CJK KR, Noto Serif KR, Batang, 바탕
- **산세리프**: Noto Sans CJK KR, Noto Sans KR, Malgun Gothic, 맑은 고딕
- **모노스페이스**: Noto Sans Mono CJK KR, D2Coding

## 기본 사용법

### 첫 번째 변환

```bash
m2d my-document.md
```

이 명령은:
1. `my-document.md` 파일을 읽습니다
2. 콘텐츠를 검증하고 자동 수정합니다
3. 타이포그래피 프리셋 CSS를 생성합니다
4. EPUB 파일을 생성합니다 (`my-document.epub`)

### PDF 변환

```bash
m2d my-document.md --format pdf
```

### EPUB + PDF 동시 변환

```bash
m2d my-document.md --format both
```

## 옵션 상세

### 출력 형식 (`-f, --format`)

```bash
m2d document.md --format epub    # EPUB만
m2d document.md --format pdf     # PDF만
m2d document.md --format both    # 둘 다
```

### 출력 디렉토리 (`-o, --output`)

```bash
m2d document.md --output ./dist
```

### 타이포그래피 프리셋 (`-t, --typography`)

```bash
m2d document.md --typography novel         # 소설
m2d document.md --typography presentation  # 발표
m2d document.md --typography review        # 리뷰
m2d document.md --typography ebook         # 전자책 (기본값)
```

### 표지 테마 (`-c, --cover`)

```bash
m2d document.md --cover apple
m2d document.md --cover modern_gradient
m2d document.md --cover dark_tech
```

사용 가능한 테마 목록:
```bash
m2d list-themes
```

### 검증 옵션

```bash
# 검증 건너뛰기
m2d document.md --no-validate

# 자동 수정 비활성화
m2d document.md --no-auto-fix
```

### 목차 옵션

```bash
# 목차 깊이 설정
m2d document.md --toc-depth 3

# 목차 비활성화
m2d document.md --no-toc
```

### PDF 옵션

```bash
# PDF 엔진 선택
m2d document.md --format pdf --pdf-engine weasyprint
m2d document.md --format pdf --pdf-engine pdflatex
m2d document.md --format pdf --pdf-engine xelatex

# 용지 크기
m2d document.md --format pdf --paper-size a4
m2d document.md --format pdf --paper-size letter
```

### 고급 옵션

```bash
# 폰트 서브세팅 (파일 크기 감소)
m2d document.md --font-subsetting

# 커스텀 CSS
m2d document.md --css ./custom.css

# 커스텀 Pandoc 경로
m2d document.md --pandoc-path /usr/local/bin/pandoc

# 상세 로그
m2d document.md --verbose
```

## 인터랙티브 모드

인터랙티브 모드는 사용자 친화적인 프롬프트를 통해 변환 옵션을 선택할 수 있습니다:

```bash
m2d interactive
# 또는
m2d i
```

### 기능

- ✅ **따옴표 자동 제거**: 파일 경로의 따옴표를 자동으로 제거하여 복사-붙여넣기 편의성 향상
- 🎨 **색상 코딩된 프롬프트**: 각 질문에 이모지와 색상으로 시각적 개선
- 📊 **개선된 스피너**: 변환 진행 상황을 더 명확하게 표시
- 📦 **더 나은 출력 포맷팅**: 결과를 구분선으로 구분하여 가독성 향상
- 📖 **책 제목/저자명 직접 입력**: 자동 감지된 메타데이터 대신 직접 입력 가능

### 사용 예시

단계별 질문에 답하면 됩니다:

```
────────────────────────────────────────────────────────────
  Markdown to Document - Interactive Mode
────────────────────────────────────────────────────────────

? 📄 Input markdown file path: ./my-document.md
? 📖 Book title (leave empty to use auto-detected): My Custom Title
? ✍️  Author name (leave empty to use auto-detected): John Doe
? 📤 Output format: 📖 EPUB only
? 🎨 Typography preset: Ebook - 일반 전자책
? 🖼️  Cover theme (optional): None
? 🔍 Enable content validation? Yes
? 🔧 Enable auto-fix for detected issues? Yes
? 📁 Output directory (leave empty for same as input): ./output

────────────────────────────────────────────────────────────

⚙️  Initializing...
✅ Initialized successfully

🔄 Converting document...
✅ Conversion completed!

────────────────────────────────────────────────────────────

📦 Output Files:

  📖 EPUB:  ./output/My Custom Title.epub

────────────────────────────────────────────────────────────

🎉 Conversion successful!
```

### 팁

- 파일 경로를 복사할 때 따옴표가 포함되어도 자동으로 처리됩니다
- 터미널에서 파일을 드래그 앤 드롭하여 경로를 입력할 수 있습니다
- 책 제목과 저자명을 직접 입력하면 자동 감지된 값을 대체합니다
- 빈 값으로 두면 자동 감지된 메타데이터를 사용합니다
- 모든 질문에 기본값이 제공되므로 Enter 키만 눌러도 됩니다

## YAML Frontmatter

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

### 필드 설명

| 필드 | 설명 | 필수 여부 |
|------|------|----------|
| `title` | 문서 제목 | 아니오 (파일명 사용) |
| `subtitle` | 부제목 | 아니오 |
| `author` | 저자명 | 아니오 |
| `language` | 언어 코드 | 아니오 (기본값: ko) |
| `date` | 날짜 | 아니오 (오늘 날짜 사용) |
| `description` | 설명 | 아니오 |
| `isbn` | ISBN | 아니오 |
| `publisher` | 출판사 | 아니오 |

## 타이포그래피 프리셋 상세

### 소설 (Novel)

**사용 사례**: 장편 소설, 에세이, 문학 작품

**특징**:
- 폰트 크기: 16pt
- 줄 간격: 1.8
- 정렬: 양쪽 정렬
- 들여쓰기: 있음
- 폰트: Noto Serif CJK KR (명조체)

**예시**:
```bash
m2d novel.md --typography novel
```

### 발표 (Presentation)

**사용 사례**: 프레젠테이션, 강의 자료, 슬라이드

**특징**:
- 폰트 크기: 18pt
- 줄 간격: 1.6
- 정렬: 왼쪽 정렬
- 여백: 넓음
- 폰트: Noto Sans CJK KR (고딕체)

**예시**:
```bash
m2d slides.md --typography presentation
```

### 리뷰 (Review)

**사용 사례**: 검토용 문서, 기술 문서, 보고서

**특징**:
- 폰트 크기: 11pt
- 줄 간격: 1.4
- 정렬: 왼쪽 정렬
- 레이아웃: 촘촘함
- 폰트: Noto Sans CJK KR (고딕체)

**예시**:
```bash
m2d review.md --typography review
```

### 전자책 (Ebook)

**사용 사례**: 일반 전자책, 가이드북, 매뉴얼

**특징**:
- 폰트 크기: 14pt
- 줄 간격: 1.6
- 정렬: 양쪽 정렬
- 레이아웃: 균형잡힘
- 폰트: Noto Sans CJK KR (고딕체)

**예시**:
```bash
m2d ebook.md --typography ebook
```

## 검증 기능

### 자동 검증

기본적으로 8개 검증 모듈이 자동으로 실행됩니다:

1. **Frontmatter 검증**: YAML 구문 오류
2. **제목 검증**: H1 중복, 레벨 갭
3. **링크 검증**: Obsidian 링크, 빈 URL
4. **이미지 검증**: alt 텍스트, 파일 형식
5. **표 검증**: 열 일관성
6. **구문 검증**: 닫히지 않은 코드 블록
7. **특수문자 검증**: 이모지, ASCII 다이어그램
8. **접근성 검증**: H1 존재, 긴 문단

### 자동 수정

기본적으로 자동 수정이 활성화됩니다:

- Obsidian 링크 → 표준 마크다운 링크
- 닫히지 않은 코드 블록 자동 닫기

### 검증 리포트

변환 완료 후 검증 리포트가 표시됩니다:

```
📊 Validation Report:
  ✅ Fixed: 5 issues
  ⚠️  Warnings: 2
  ❌ Errors: 0
```

## 이미지 처리

### 이미지 경로

이미지는 다음 위치에서 자동으로 검색됩니다:

1. 마크다운 파일과 동일한 디렉토리
2. `images/` 폴더
3. `attachments/` 폴더
4. `assets/` 폴더
5. `media/` 폴더

### 이미지 형식

지원하는 형식:
- PNG
- JPG/JPEG
- GIF
- SVG
- WebP

### 이미지 참조

```markdown
<!-- 표준 마크다운 -->
![이미지 설명](./images/photo.png)

<!-- Obsidian 문법 (자동 변환됨) -->
![[photo.png]]
![[photo.png|이미지 설명]]
```

## 프로그래밍 방식 사용

Node.js 코드에서 직접 사용할 수 있습니다:

```javascript
import { MarkdownToDocument } from 'markdown-to-document-cli';

const converter = new MarkdownToDocument();

// 초기화
const initResult = await converter.initialize();
if (!initResult.success) {
  console.error(initResult.error);
  process.exit(1);
}

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

## 실전 예제

### 예제 1: 소설 EPUB 변환

```bash
m2d my-novel.md \
  --format epub \
  --typography novel \
  --output ./books
```

### 예제 2: 발표용 PDF

```bash
m2d presentation.md \
  --format pdf \
  --typography presentation \
  --pdf-engine weasyprint \
  --paper-size a4
```

### 예제 3: 기술 문서 (EPUB + PDF)

```bash
m2d technical-doc.md \
  --format both \
  --typography review \
  --output ./docs \
  --toc-depth 3
```

### 예제 4: 검증 없이 빠르게 변환

```bash
m2d quick-document.md \
  --format epub \
  --no-validate \
  --no-auto-fix
```

### 예제 5: 커스텀 CSS 적용

```bash
m2d styled-doc.md \
  --format epub \
  --css ./custom-styles.css
```

## 팁과 모범 사례

### 1. 파일 명명

의미 있는 파일명 사용:
```bash
# 좋은 예
m2d 2025-01-05-technical-guide.md

# 피해야 할 예
m2d doc.md
```

### 2. 디렉토리 구조

```
project/
├── documents/
│   ├── chapter1.md
│   ├── chapter2.md
│   └── images/
│       ├── diagram1.png
│       └── diagram2.png
├── output/
└── custom.css
```

### 3. YAML Frontmatter 사용

항상 frontmatter 추가:
```yaml
---
title: 명확한 제목
author: 저자명
date: 2025-01-05
---
```

### 4. 이미지 alt 텍스트

항상 alt 텍스트 추가:
```markdown
![시스템 아키텍처 다이어그램](./architecture.png)
```

### 5. 제목 구조

계층적 제목 사용:
```markdown
# H1 (문서당 하나만)

## H2

### H3

#### H4
```

## 유틸리티 명령어

### 프리셋 목록

```bash
m2d list-presets
```

### 테마 목록

```bash
m2d list-themes
```

### 의존성 확인

```bash
m2d check
```

## 도움말

```bash
m2d --help
```

## 다음 단계

- [TroubleShooting.md](TroubleShooting.md) - 문제 해결 가이드
- [Project.md](Project.md) - 프로젝트 문서
- [CHANGELOG.md](CHANGELOG.md) - 변경 로그
- [GitHub Repository](https://github.com/goodlookingprokim/markdown-to-document-cli) - 소스 코드

---

**마지막 업데이트**: 2025-01-05
