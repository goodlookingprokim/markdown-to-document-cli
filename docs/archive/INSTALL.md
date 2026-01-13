# 설치 및 빌드 가이드

---

**마지막 업데이트**: 2026-01-06 (v1.2.7)

---

## 의존성 설치

```bash
npm install
```

## 빌드

```bash
npm run build
```

## 개발 모드

```bash
npm run dev
```

## 테스트

```bash
npm test
```

## 전역 설치 (선택사항)

```bash
npm link
```

이후 `m2d` 명령어로 어디서든 사용할 수 있습니다.

## NPM 배포

```bash
# 로그인
npm login

# 배포
npm publish
```

## 필수 시스템 요구사항

### Node.js 설치

**최소 버전**: Node.js 18.0.0 이상

```bash
# 버전 확인
node --version
npm --version
```

### Pandoc 설치

```bash
# macOS
brew install pandoc

# Windows
choco install pandoc

# Linux
sudo apt-get install pandoc
```

### ⚠️ Windows 사용자 주의사항

#### PowerShell 실행 정책 오류

Windows에서 `npx` 또는 `m2d` 실행 시 다음 오류가 발생할 수 있습니다:

```powershell
npx : File C:\Program Files\nodejs\npx.ps1 cannot be loaded because running scripts is disabled on this system.
```

**해결 방법**:

**옵션 1: CMD 사용 (권장)**
```cmd
# PowerShell 대신 CMD(명령 프롬프트) 사용
# Win + R → cmd 입력
npx markdown-to-document-cli@latest interactive
```

**옵션 2: 실행 정책 변경**
```powershell
# PowerShell 관리자 권한으로 실행 후
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

자세한 내용은 [TroubleShooting.md](./TroubleShooting.md#windows-관련-문제)를 참조하세요.

### PDF 엔진 설치 (선택사항)

PDF 변환을 위해서는 최소 1개의 PDF 엔진이 필요합니다.

#### WeasyPrint (권장)

가장 쉽고 빠른 방법입니다:

```bash
pip install weasyprint
```

💡 Python이 없다면 [python.org](https://www.python.org/downloads/)에서 먼저 설치하세요.

⚠️ **Windows 사용자 필수**: WeasyPrint는 GTK 런타임이 필요합니다!

```powershell
# 1. MSYS2 설치: https://www.msys2.org/
# 2. MSYS2 UCRT64 터미널에서 GTK3 전체 설치:
pacman -S mingw-w64-ucrt-x86_64-gtk3

# 3. 시스템 PATH에 추가: C:\msys64\ucrt64\bin
# 4. 새 터미널 열고 확인: weasyprint --version
```

자세한 내용: [TroubleShooting.md](./TroubleShooting.md#문제-weasyprint-cannot-load-library-libgobject-오류-windows)

#### XeLaTeX (한글 최적화)

전문 출판 수준의 품질을 원한다면:

```bash
# macOS
brew install --cask basictex

# Windows
choco install miktex

# Linux (Ubuntu/Debian)
sudo apt-get install texlive-xetex texlive-fonts-recommended
```

⚠️ 설치 후 터미널을 다시 시작하세요.  
🪟 **Windows**: MiKTeX 설치 후 첫 실행 시 패키지 자동 설치를 허용하세요.

#### 설치 확인

```bash
# WeasyPrint 확인
weasyprint --version

# XeLaTeX 확인
xelatex --version
```

## 문제 해결

### 빌드 오류

```bash
# node_modules 삭제 후 재설치
rm -rf node_modules
npm install
npm run build
```

### Pandoc 경로 문제

```bash
# Pandoc 경로 확인
which pandoc

# 커스텀 경로 지정
m2d document.md --pandoc-path /path/to/pandoc
```
