# Project.md - Markdown to Document CLI

## 프로젝트 개요

**Markdown to Document CLI**는 옵시디언 플러그인 "Markdown to Document Pro"의 핵심 기능을 NPM/NPX 패키지로 변환한 프로젝트입니다. 마크다운 문서를 전문 출판 수준의 EPUB/PDF로 변환하는 CLI 도구를 제공합니다.

## 프로젝트 목표

1. **옵시디언 종속성 제거**: 옵시디언 플러그인 API 의존성을 제거하고 독립형 CLI 도구로 변환
2. **NPM/NPX 패키지화**: 전역 설치 없이 `npx`로 바로 사용 가능한 패키지 제공
3. **핵심 기능 유지**: 8개 검증 모듈, 타이포그래피 프리셋, 자동 수정 등 핵심 기능 보존
4. **사용성 향상**: 인터랙티브 모드, 상세한 오류 메시지, 진행 상황 표시

## 기술 스택

### 핵심 기술
- **언어**: TypeScript 5.3+
- **런타임**: Node.js 18+
- **모듈 시스템**: ES Modules (`type: "module"`)
- **번들러**: TypeScript Compiler (tsc)

### CLI 프레임워크
- **Commander.js**: CLI 인터페이스 프레임워크
- **Chalk**: 터미널 색상 출력
- **Ora**: 로딩 스피너
- **Inquirer**: 인터랙티브 프롬프트

### 변환 엔진
- **Pandoc 2.19+**: 문서 변환 엔진
- **WeasyPrint**: PDF 생성 엔진 (선택사항)

### 유틸리티
- **fontkit**: 폰트 처리
- **glob**: 파일 패턴 매칭
- **yaml**: YAML 파싱

## 아키텍처

### 디렉토리 구조

```
src/
├── types/              # 타입 정의
│   ├── index.ts       # 핵심 타입 (ConversionOptions, ConversionResult, etc.)
│   └── validators.ts  # 검증기 타입
├── utils/             # 유틸리티 함수
│   ├── constants.ts   # 상수 및 설정 (TYPOGRAPHY_PRESETS, COVER_THEMES)
│   ├── fileUtils.ts   # 파일 처리 유틸리티
│   ├── markdownUtils.ts  # 마크다운 처리 유틸리티
│   └── common.ts      # 공통 유틸리티 (Logger, etc.)
├── services/          # 핵심 서비스
│   ├── PandocService.ts       # Pandoc 변환 엔진
│   ├── MarkdownPreprocessor.ts  # 마크다운 전처리
│   └── ContentValidator.ts    # 8개 검증 모듈
├── index.ts           # 메인 API (MarkdownToDocument 클래스)
└── cli.ts             # CLI 인터페이스
```

### 핵심 컴포넌트

#### 1. MarkdownToDocument (메인 클래스)
- **역할**: 변환 프로세스 조율
- **주요 메서드**:
  - `initialize()`: 의존성 확인 (Pandoc)
  - `convert()`: 전체 변환 프로세스 실행

#### 2. PandocService
- **역할**: Pandoc을 통한 EPUB/PDF 변환
- **주요 메서드**:
  - `checkPandocAvailable()`: Pandoc 설치 확인
  - `toEpub()`: EPUB 변환
  - `toPdf()`: PDF 변환

#### 3. MarkdownPreprocessor
- **역할**: 마크다운 전처리 (Obsidian 문법 변환, 이미지 경로 해결)
- **주요 메서드**:
  - `preprocess()`: 전처리 파이프라인 실행
  - `generateCleanMarkdown()`: YAML frontmatter 포함 마크다운 생성

#### 4. ContentValidator
- **역할**: 8개 검증 모듈 실행
- **검증 모듈**:
  1. Frontmatter 검증
  2. 제목 검증
  3. 링크 검증
  4. 이미지 검증
  5. 표 검증
  6. 구문 검증
  7. 특수문자 검증
  8. 접근성 검증
- **주요 메서드**:
  - `validate()`: 전체 검증 실행
  - `autoFix()`: 자동 수정 적용

## 변환 프로세스

```
1. 입력 파일 검증
   ↓
2. 콘텐츠 검증 (8개 모듈)
   ↓
3. 자동 수정 (선택사항)
   ↓
4. 마크다운 전처리
   - Obsidian 문법 변환
   - 이미지 경로 해결
   - YAML frontmatter 생성
   ↓
5. 임시 파일 생성
   ↓
6. Pandoc 변환
   - EPUB 변환 (선택)
   - PDF 변환 (선택)
   ↓
7. 출력 파일 생성
   ↓
8. 임시 파일 정리
```

## 타이포그래피 프리셋

### 소설 (Novel)
- **용도**: 장편 소설, 에세이
- **특징**: 16pt, 들여쓰기, 양쪽 정렬, 1.8 줄 간격
- **폰트**: Noto Serif CJK KR

### 발표 (Presentation)
- **용도**: 프레젠테이션, 강의
- **특징**: 18pt, 큰 글씨, 넓은 여백, 1.6 줄 간격
- **폰트**: Noto Sans CJK KR

### 리뷰 (Review)
- **용도**: 검토용 문서
- **특징**: 11pt, 촘촘한 레이아웃, 1.4 줄 간격
- **폰트**: Noto Sans CJK KR

### 전자책 (Ebook)
- **용도**: 일반 전자책
- **특징**: 14pt, 균형잡힌 레이아웃, 1.6 줄 간격
- **폰트**: Noto Sans CJK KR

## 검증 모듈 상세

### 1. Frontmatter 검증
- **목적**: YAML 구문 오류 감지
- **검사 항목**: 콜론(:) 누락, 잘못된 구문
- **자동 수정**: 없음 (경고만)

### 2. 제목 검증
- **목적**: 제목 구조 검증
- **검사 항목**: H1 중복, 레벨 갭
- **자동 수정**: 없음 (경고만)

### 3. 링크 검증
- **목적**: 링크 형식 검증
- **검사 항목**: Obsidian 링크, 빈 URL
- **자동 수정**: Obsidian 링크 → 표준 마크다운 링크

### 4. 이미지 검증
- **목적**: 이미지 접근성 검증
- **검사 항목**: alt 텍스트, 파일 형식
- **자동 수정**: 없음 (경고만)

### 5. 표 검증
- **목적**: 표 구조 검증
- **검사 항목**: 열 일관성
- **자동 수정**: 없음 (경고만)

### 6. 구문 검증
- **목적**: 코드 블록 구문 검증
- **검사 항목**: 닫히지 않은 코드 블록, 인라인 코드
- **자동 수정**: 닫히지 않은 코드 블록 자동 닫기

### 7. 특수문자 검증
- **목적**: 렌더링 문제 가능성 검증
- **검사 항목**: 이모지, ASCII 다이어그램
- **자동 수정**: 없음 (경고만)

### 8. 접근성 검증
- **목적**: WCAG 2.1 AA 표준 준수
- **검사 항목**: H1 존재, 긴 문단
- **자동 수정**: 없음 (경고만)

## CLI 명령어

### 기본 변환
```bash
m2d <input.md> [options]
```

### 인터랙티브 모드
```bash
m2d interactive
```

### 유틸리티 명령어
```bash
m2d list-presets    # 타이포그래피 프리셋 목록
m2d list-themes     # 표지 테마 목록
m2d check           # 의존성 확인
```

## 환경 변수

- `DEBUG`: 상세 로그 출력 (`true`로 설정)
- `TMPDIR`: 임시 파일 디렉토리 (기본값: 시스템 기본값)

## 의존성 관리

### 필수 의존성
- Node.js 18+
- Pandoc 2.19+

### 선택적 의존성
- WeasyPrint (PDF 생성)

### NPM 의존성
- **프로덕션**: commander, chalk, ora, inquirer, yaml, fontkit, glob
- **개발**: @types/node, @types/inquirer, typescript, eslint, prettier

## 빌드 및 배포

### 빌드
```bash
npm run build
```

### 로컬 테스트
```bash
npm link
m2d check
```

### NPM 배포
```bash
npm login
npm publish
```

## 테스트 전략

### 단위 테스트 (계획)
- 각 서비스 클래스별 테스트
- 유틸리티 함수 테스트
- 검증 모듈 테스트

### 통합 테스트 (계획)
- 전체 변환 프로세스 테스트
- 다양한 입력 파일 테스트
- 에러 처리 테스트

## 성능 최적화

### 이미지 처리
- 병렬 이미지 경로 해결
- 중복 이미지 검사 제거

### 파일 I/O
- 임시 파일 재사용
- 비동기 파일 처리

### Pandoc 호출
- execFile 사용 (보안 및 성능)
- 버전별 최적화된 인자 사용

## 보안 고려사항

### 명령 인젝션 방지
- `execFile` 사용 (인자를 배열로 전달)
- 경로 검증 (특수문자 차단)

### 파일 접근
- 절대 경로 사용
- 입력 파일 검증

### 임시 파일
- 시스템 임시 디렉토리 사용
- 사용 후 자동 정리

## 향후 계획

### 단기 (v1.1)
- [ ] 단위 테스트 추가
- [ ] 폰트 서브세팅 기능 완성
- [ ] 표지 생성 기능 구현

### 중기 (v1.5)
- [ ] 커스텀 CSS 템플릿
- [ ] 배치 처리 모드
- [ ] 플러그인 시스템

### 장기 (v2.0)
- [ ] 웹 UI
- [ ] 클라우드 변환
- [ ] 협업 기능

## 라이선스

MIT License

## 연락처

- **GitHub**: [@bluelion79](https://github.com/bluelion79)
- **Email**: bluelion79@gmail.com

---

**마지막 업데이트**: 2025-01-05
