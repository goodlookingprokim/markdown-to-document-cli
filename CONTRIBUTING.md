# Contributing Guide

이 문서는 Markdown to Document CLI 프로젝트에 기여하는 방법을 설명합니다.

---

## 개발 환경 설정

### 필수 요구사항

- **Node.js**: 18.0.0 이상
- **Pandoc**: 2.19 이상

### 저장소 클론

```bash
git clone https://github.com/goodlookingprokim/markdown-to-document-cli.git
cd markdown-to-document-cli
```

### 의존성 설치

```bash
npm install
```

### 빌드

```bash
npm run build
```

### 개발 모드 (감시 모드)

```bash
npm run dev
```

### 테스트

```bash
npm test
```

### 코드 품질

```bash
# ESLint
npm run lint

# Prettier
npm run format
```

---

## 로컬 테스트

### 전역 설치 (npm link)

로컬에서 개발 중인 버전을 전역으로 테스트:

```bash
npm link
```

이후 `m2d` 명령어로 어디서든 사용할 수 있습니다.

### 링크 해제

```bash
npm unlink
```

---

## NPM 배포

### 로그인

```bash
npm login
```

### 버전 업데이트

```bash
# 패치 버전 (1.0.0 -> 1.0.1)
npm version patch

# 마이너 버전 (1.0.0 -> 1.1.0)
npm version minor

# 메이저 버전 (1.0.0 -> 2.0.0)
npm version major
```

### 배포

```bash
npm publish
```

---

## 필수 도구 설치

### Node.js

```bash
# 버전 확인
node --version  # >= 18.0.0
npm --version
```

### Pandoc

| OS | 설치 명령어 |
|----|------------|
| macOS | `brew install pandoc` |
| Windows | `choco install pandoc` 또는 winget |
| Ubuntu/Debian | `sudo apt-get install pandoc` |
| Fedora | `sudo dnf install pandoc` |

### PDF 엔진 (선택사항)

| 엔진 | 설치 | 특징 |
|------|------|------|
| **WeasyPrint** | `pip install weasyprint` | 권장, 가장 쉬움 |
| **XeLaTeX** | macOS: `brew install --cask basictex` | 전문 출판 품질 |

---

## 프로젝트 구조

```
src/
├── cli.ts              # CLI 진입점
├── index.ts            # 메인 라이브러리
├── types/              # TypeScript 타입
├── services/           # 핵심 서비스
│   ├── PandocService.ts
│   ├── TypographyService.ts
│   ├── FontSubsetter.ts
│   ├── CoverService.ts
│   └── ContentValidator.ts
└── utils/              # 유틸리티 함수
    ├── constants.ts
    ├── fileUtils.ts
    └── markdownUtils.ts
```

---

## 코드 스타일

### TypeScript

- 모든 함수에 타입 명시
- `any` 타입 사용 금지
- `interface` 우선 사용

### 커밋 메시지

```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅
refactor: 리팩토링
test: 테스트 추가
chore: 빌드, 설정 변경
```

예시:
```bash
git commit -m "feat: Add dark mode support for cover themes"
git commit -m "fix: Handle UNC paths on Windows"
git commit -m "docs: Update installation guide"
```

---

## Pull Request 가이드

1. **Fork** 저장소
2. **Branch** 생성: `git checkout -b feature/my-feature`
3. **Commit** 작성
4. **Push**: `git push origin feature/my-feature`
5. **PR** 생성

### PR 체크리스트

- [ ] 코드가 빌드됨 (`npm run build`)
- [ ] 테스트 통과 (`npm test`)
- [ ] 린트 통과 (`npm run lint`)
- [ ] 문서 업데이트 (필요시)

---

## 문제 해결

### 빌드 오류

```bash
rm -rf node_modules
npm install
npm run build
```

### Pandoc 경로 문제

```bash
# 경로 확인
which pandoc

# 커스텀 경로 지정
m2d document.md --pandoc-path /path/to/pandoc
```

### Windows PowerShell 실행 정책

```powershell
# 관리자 권한으로
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

또는 CMD 사용 권장.

---

## 연락처

- **GitHub**: [@goodlookingprokim](https://github.com/goodlookingprokim)
- **Email**: edulovesai@gmail.com
- **Issues**: [GitHub Issues](https://github.com/goodlookingprokim/markdown-to-document-cli/issues)

---

**감사합니다!** 🙏
