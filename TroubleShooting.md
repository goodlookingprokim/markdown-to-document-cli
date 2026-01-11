# TroubleShooting.md - 문제 해결 가이드

이 가이드는 Markdown to Document CLI 사용 중 발생할 수 있는 일반적인 문제와 해결 방법을 제공합니다.

---

# 🪟 Windows 완전 초보자를 위한 설치 가이드

> **🎯 이 가이드의 목표**: 컴퓨터에 아무것도 설치되어 있지 않은 상태에서, 마크다운 파일을 전자책(EPUB)과 PDF로 변환할 수 있는 환경을 만드는 것입니다.

---

## 🍳 요리로 이해하는 설치 과정

당신이 **맛있는 요리(전자책)**를 만들고 싶다고 상상해 보세요.

| 비유 | 실제 | 설명 |
|------|------|------|
| 🥬 **재료** | 마크다운 파일 (.md) | 당신이 작성한 글 |
| 🔥 **가스레인지** | Node.js | 요리를 할 수 있게 해주는 기본 시스템 |
| 🍳 **프라이팬** | Pandoc | 재료를 요리로 변환하는 도구 |
| 🧑‍🍳 **요리사** | NpxMagicDoc | 모든 것을 조합해서 요리를 완성하는 셰프 |
| 🖨️ **오븐** | Python + WeasyPrint | PDF라는 특별한 요리를 만들 때만 필요 |

**결론**: 가스레인지(Node.js)와 프라이팬(Pandoc)만 있으면 EPUB은 만들 수 있습니다!  
PDF도 만들고 싶다면 오븐(Python + WeasyPrint)을 추가로 설치하세요.

---

## � 설치 순서 한눈에 보기

```
┌─────────────────────────────────────────────────────────────┐
│  1단계: Node.js 설치 (가스레인지 설치)                        │
│     ↓                                                       │
│  2단계: Pandoc 설치 (프라이팬 구입)                          │
│     ↓                                                       │
│  3단계: 설치 확인 (불이 켜지는지 테스트)                      │
│     ↓                                                       │
│  🎉 EPUB 변환 가능!                                         │
│     ↓                                                       │
│  [선택] 4단계: Python 설치 (오븐 설치)                       │
│     ↓                                                       │
│  [선택] 5단계: WeasyPrint 설치 (오븐 예열)                   │
│     ↓                                                       │
│  🎉 PDF 변환도 가능!                                        │
└─────────────────────────────────────────────────────────────┘
```

---

## 1️⃣ Node.js 설치하기 (가스레인지 설치)

### 🤔 Node.js가 뭔가요?

Node.js는 **자바스크립트 프로그램을 실행할 수 있게 해주는 환경**입니다.  
NpxMagicDoc은 자바스크립트로 만들어졌기 때문에, Node.js가 있어야 실행됩니다.

요리로 비유하면, **가스레인지 없이는 요리를 할 수 없는 것**과 같습니다.

### 📥 설치 방법 (스크린샷 따라하기)

**1. Node.js 공식 사이트 방문**
```
https://nodejs.org/
```

**2. LTS 버전 다운로드 클릭**
- 사이트에 접속하면 두 개의 버튼이 보입니다
- **왼쪽 초록색 버튼 (LTS)** 을 클릭하세요
- LTS = Long Term Support = 안정적인 버전

**3. 다운로드된 파일 실행**
- `node-v20.x.x-x64.msi` 같은 파일이 다운로드됩니다
- 더블클릭해서 실행하세요

**4. 설치 마법사 따라하기**
```
[Next] 클릭
↓
☑️ "I accept the terms..." 체크 → [Next] 클릭
↓
설치 경로 그대로 두고 → [Next] 클릭
↓
⚠️ 중요! "Automatically install the necessary tools" 체크 ☑️
↓
[Next] → [Install] 클릭
↓
설치 완료되면 [Finish] 클릭
```

**5. 컴퓨터 재시작** (권장)
- 환경 변수가 적용되려면 재시작이 필요할 수 있습니다

### ✅ 설치 확인하기

**1. PowerShell 열기**
- 키보드에서 `Windows 키` + `X` 누르기
- 메뉴에서 **"Windows PowerShell"** 또는 **"터미널"** 클릭

**2. 버전 확인 명령어 입력**
```powershell
node --version
```

**3. 결과 확인**
```
v20.10.0   ← 이런 식으로 버전이 나오면 성공! 🎉
```

❌ **만약 오류가 나온다면?**
```
'node'은(는) 내부 또는 외부 명령... 으로 인식되지 않습니다.
```
→ 컴퓨터를 재시작하고 다시 시도하세요.  
→ 그래도 안 되면 Node.js를 다시 설치하세요.

---

## 2️⃣ Pandoc 설치하기 (프라이팬 구입)

### 🤔 Pandoc이 뭔가요?

Pandoc은 **문서 형식을 변환하는 만능 도구**입니다.  
마크다운을 EPUB, PDF, HTML, Word 등 거의 모든 형식으로 바꿀 수 있습니다.

요리로 비유하면, **재료를 원하는 요리로 변환하는 프라이팬**입니다.

### 📥 설치 방법 (스크린샷 따라하기)

**1. Pandoc 공식 사이트 방문**
```
https://pandoc.org/installing.html
```

**2. Windows 설치 파일 다운로드**
- 페이지에서 **"Download the latest installer"** 링크 찾기
- 또는 직접 GitHub 릴리스 페이지로 이동:
```
https://github.com/jgm/pandoc/releases/latest
```
- `pandoc-3.x.x-windows-x86_64.msi` 파일 다운로드

**3. 다운로드된 파일 실행**
- 더블클릭해서 설치 마법사 시작

**4. 설치 마법사 따라하기**
```
[Next] 클릭
↓
☑️ "I accept the terms..." 체크 → [Next] 클릭
↓
설치 경로 그대로 두고 → [Next] 클릭
↓
[Install] 클릭
↓
설치 완료되면 [Finish] 클릭
```

### ✅ 설치 확인하기

**1. 새 PowerShell 창 열기** (중요! 기존 창 말고 새 창)
- `Windows 키` + `X` → **"Windows PowerShell"** 클릭

**2. 버전 확인 명령어 입력**
```powershell
pandoc --version
```

**3. 결과 확인**
```
pandoc 3.1.9
Compiled with pandoc-types...   ← 이런 식으로 나오면 성공! 🎉
```

---

## 3️⃣ 여기까지 왔다면 EPUB 변환 가능! 🎉

축하합니다! 이제 마크다운 파일을 EPUB 전자책으로 변환할 수 있습니다.

### 🚀 바로 사용해보기

**1. PowerShell 열기**

**2. 아래 명령어 입력** (테스트용)
```powershell
npx markdown-to-document-cli@latest interactive
```

**3. 대화형 모드에서 안내에 따라 진행**
- 파일 경로 입력 (또는 파일을 PowerShell 창에 드래그 앤 드롭)
- 출력 형식 선택: `epub`
- 변환 완료!

### 💡 파일 경로 입력 팁

```powershell
# 방법 1: 드래그 앤 드롭 (가장 쉬움!)
# 파일을 PowerShell 창으로 끌어다 놓으면 경로가 자동 입력됩니다

# 방법 2: 직접 입력
npx markdown-to-document-cli@latest "C:\Users\홍길동\Documents\내문서.md"

# 방법 3: 대화형 모드
npx markdown-to-document-cli@latest interactive
```

---

## 4️⃣ [선택] Python 설치하기 (오븐 설치)

> **📌 참고**: PDF 변환이 필요 없다면 이 단계를 건너뛰세요!

### 🤔 Python이 뭔가요?

Python은 **프로그래밍 언어**입니다.  
WeasyPrint라는 PDF 변환 도구가 Python으로 만들어져서, Python이 있어야 WeasyPrint를 사용할 수 있습니다.

요리로 비유하면, **오븐을 작동시키는 전기**와 같습니다.

### 📥 설치 방법 (스크린샷 따라하기)

**1. Python 공식 사이트 방문**
```
https://www.python.org/downloads/
```

**2. 최신 버전 다운로드**
- 노란색 **"Download Python 3.x.x"** 버튼 클릭

**3. 다운로드된 파일 실행**
- `python-3.x.x-amd64.exe` 파일 더블클릭

**4. ⚠️ 매우 중요! 설치 옵션 설정**
```
┌─────────────────────────────────────────────────────────────┐
│  ☑️ "Add python.exe to PATH" ← 반드시 체크! ⚠️              │
│                                                             │
│  그 다음 "Install Now" 클릭                                 │
└─────────────────────────────────────────────────────────────┘
```

> **⚠️ "Add python.exe to PATH" 체크를 깜빡하면?**  
> Python이 설치되어도 PowerShell에서 `python` 명령어를 인식하지 못합니다.  
> 이 경우 Python을 삭제하고 다시 설치해야 합니다.

**5. 설치 완료 후 "Disable path length limit" 클릭** (나오면)

**6. 컴퓨터 재시작** (권장)

### ✅ 설치 확인하기

**1. 새 PowerShell 창 열기** (중요!)

**2. 버전 확인 명령어 입력**
```powershell
python --version
```

**3. 결과 확인**
```
Python 3.12.0   ← 이런 식으로 나오면 성공! 🎉
```

**4. pip 확인** (Python 패키지 설치 도구)
```powershell
pip --version
```

```
pip 23.3.1 from ...   ← 이런 식으로 나오면 성공! 🎉
```

❌ **만약 오류가 나온다면?**
```
'python'은(는) 내부 또는 외부 명령... 으로 인식되지 않습니다.
```
→ Python 설치 시 **"Add python.exe to PATH"** 를 체크하지 않은 것입니다.  
→ Python을 삭제하고 다시 설치하세요. 이번에는 꼭 체크!

---

## 5️⃣ [선택] WeasyPrint 설치하기 (오븐 예열)

> **📌 참고**: Python이 설치되어 있어야 합니다!

### 🤔 WeasyPrint가 뭔가요?

WeasyPrint는 **HTML/CSS를 PDF로 변환하는 도구**입니다.  
NpxMagicDoc이 마크다운을 HTML로 바꾸고, WeasyPrint가 그것을 PDF로 만듭니다.

요리로 비유하면, **오븐에서 빵을 굽는 것**과 같습니다.

### 📥 설치 방법

**1. PowerShell 열기**

**2. WeasyPrint 설치 명령어 입력**
```powershell
pip install weasyprint
```

**3. 설치 진행 확인**
```
Collecting weasyprint
  Downloading weasyprint-60.1-py3-none-any.whl (270 kB)
...
Successfully installed weasyprint-60.1   ← 성공! 🎉
```

### ✅ 설치 확인하기

```powershell
weasyprint --version
```

```
WeasyPrint version 60.1   ← 이런 식으로 나오면 성공! 🎉
```

---

## 🎉 모든 설치 완료! 최종 확인

### 📋 전체 설치 확인 명령어

PowerShell에서 아래 명령어들을 하나씩 입력해보세요:

```powershell
# 1. Node.js 확인
node --version
# 예상 결과: v20.10.0

# 2. Pandoc 확인
pandoc --version
# 예상 결과: pandoc 3.1.9

# 3. Python 확인 (PDF 변환 시 필요)
python --version
# 예상 결과: Python 3.12.0

# 4. WeasyPrint 확인 (PDF 변환 시 필요)
weasyprint --version
# 예상 결과: WeasyPrint version 60.1
```

### 🚀 변환 테스트

```powershell
# EPUB만 변환 (Node.js + Pandoc만 있으면 됨)
npx markdown-to-document-cli@latest "C:\Users\사용자\문서.md" --format epub

# PDF만 변환 (Python + WeasyPrint 필요)
npx markdown-to-document-cli@latest "C:\Users\사용자\문서.md" --format pdf

# EPUB + PDF 동시 변환
npx markdown-to-document-cli@latest "C:\Users\사용자\문서.md" --format both

# 대화형 모드 (가장 쉬움 - 안내에 따라 진행)
npx markdown-to-document-cli@latest interactive
```

---

## ❓ 자주 묻는 질문 (FAQ)

### Q: "명령어를 인식하지 못합니다" 오류가 나요

**A**: 환경 변수가 적용되지 않은 것입니다.
1. 컴퓨터를 재시작하세요
2. **새 PowerShell 창**을 열고 다시 시도하세요
3. 그래도 안 되면 해당 프로그램을 다시 설치하세요

### Q: Python 설치 시 PATH 체크를 깜빡했어요

**A**: Python을 완전히 삭제하고 다시 설치해야 합니다.
1. 설정 → 앱 → Python 찾아서 제거
2. Python 다시 다운로드
3. 설치 시 **"Add python.exe to PATH"** 반드시 체크!

### Q: EPUB만 필요한데 Python도 설치해야 하나요?

**A**: 아니요! EPUB 변환에는 Node.js와 Pandoc만 있으면 됩니다.  
Python과 WeasyPrint는 PDF 변환에만 필요합니다.

### Q: MiKTeX 대신 WeasyPrint를 권장하는 이유는?

**A**: 
- WeasyPrint: 설치 간단, 대화상자 없음, 빠름
- MiKTeX: 설치 복잡, 패키지 설치 대화상자 나타남, 설정 필요

초보자에게는 WeasyPrint가 훨씬 쉽습니다!

---

## 💡 Windows 사용 팁

1. **경로에 공백이 있으면** 따옴표로 감싸세요: `"C:\My Documents\file.md"`
2. **네트워크 드라이브** UNC 경로 지원: `\\Mac\Home\file.md`
3. **드래그 앤 드롭**: 파일을 PowerShell 창에 끌어다 놓으면 경로 자동 입력
4. **관리자 권한 불필요**: 일반 사용자 권한으로 실행 가능

---

## 목차

1. [설치 문제](#설치-문제)
2. [Windows 관련 문제](#windows-관련-문제)
3. [Pandoc 관련 문제](#pandoc-관련-문제)
4. [변환 문제](#변환-문제)
5. [ESM 모듈 오류](#esm-모듈-오류)
6. [이미지 문제](#이미지-문제)
7. [PDF 관련 문제](#pdf-관련-문제)
8. [타이포그래피 관련 문제](#타이포그래피-관련-문제)
9. [폰트 서브세팅 관련 문제](#폰트-서브세팅-관련-문제)
10. [성능 문제](#성능-문제)
11. [기타 문제](#기타-문제)

---

## 설치 문제

### 문제: "command not found: m2d"

**증상**:
```bash
m2d document.md
# zsh: command not found: m2d
```

**원인**:
- 전역 설치가 완료되지 않음
- PATH에 npm global bin이 포함되지 않음

**해결 방법**:

1. 전역 설치 확인:
```bash
npm list -g markdown-to-document-cli
```

2. 재설치:
```bash
npm uninstall -g markdown-to-document-cli
npm install -g markdown-to-document-cli
```

3. PATH 확인:
```bash
# npm global bin 경로 확인
npm config get prefix

# PATH에 추가 (macOS/Linux)
export PATH="$(npm config get prefix)/bin:$PATH"

# .zshrc 또는 .bashrc에 영구 추가
echo 'export PATH="$(npm config get prefix)/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

4. 또는 npx 사용:
```bash
npx markdown-to-document-cli@latest document.md
```

### 문제: "Cannot find module 'xxx'"

**증상**:
```bash
Error: Cannot find module 'commander'
```

**원인**:
- node_modules가 설치되지 않음
- 의존성 손상

**해결 방법**:

```bash
# node_modules 삭제
rm -rf node_modules package-lock.json

# 재설치
npm install

# 빌드
npm run build
```

### 문제: TypeScript 컴파일 오류

**증상**:
```bash
error TS2307: Cannot find module 'fs'
```

**원인**:
- @types/node가 설치되지 않음

**해결 방법**:

```bash
npm install --save-dev @types/node
```

---

## Windows 관련 문제

### 문제: PowerShell 실행 정책 오류 (매우 흔함)

**증상**:
```powershell
npx : File C:\Program Files\nodejs\npx.ps1 cannot be loaded because running scripts is disabled on this system.
For more information, see about_Execution_Policies at https:/go.microsoft.com/fwlink/?LinkID=135170.
At line:1 char:1
+ npx markdown-to-document-cli@latest interactive
+ ~~~
    + CategoryInfo          : SecurityError: (:) [], PSSecurityException
    + FullyQualifiedErrorId : UnauthorizedAccess
```

**원인**:
- Windows PowerShell의 기본 실행 정책이 스크립트 실행을 차단
- 보안 설정으로 인해 `.ps1` 스크립트(Node.js의 `npx.ps1`, `npm.ps1` 등) 실행 불가
- Windows의 기본 보안 정책

**해결 방법**:

#### **방법 1: CMD 사용 (가장 빠르고 쉬움, 강력 권장 ⭐)**

PowerShell 대신 **명령 프롬프트(CMD)**를 사용하면 실행 정책 문제가 전혀 발생하지 않습니다:

**CMD 실행 방법**:
1. `Win + R` 키 누르기
2. `cmd` 입력 후 Enter
3. 또는 시작 메뉴에서 "명령 프롬프트" 검색

```cmd
# CMD에서 실행
npx markdown-to-document-cli@latest interactive

# 또는 전역 설치 후
m2d interactive

# 파일 변환
npx markdown-to-document-cli@latest document.md
```

**장점**:
- ✅ 설정 변경 불필요
- ✅ 관리자 권한 불필요
- ✅ 즉시 사용 가능
- ✅ 모든 기능 정상 작동

#### **방법 2: 실행 정책 변경 (영구적 해결)**

PowerShell을 계속 사용하고 싶다면 실행 정책을 변경하세요:

**단계**:
1. PowerShell을 **관리자 권한**으로 실행
   - 시작 메뉴에서 "PowerShell" 검색
   - 우클릭 → "관리자 권한으로 실행"

2. 다음 명령어 실행:
```powershell
# 현재 사용자에 대해 실행 정책 변경
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# 확인 메시지가 나오면 'Y' 입력
```

3. 일반 PowerShell 창을 닫고 새로 열기

4. 다시 시도:
```powershell
npx markdown-to-document-cli@latest interactive
```

**설명**:
- `RemoteSigned`: 로컬 스크립트는 실행 허용, 다운로드한 스크립트는 서명 필요
- `CurrentUser`: 현재 사용자에게만 적용 (시스템 전체 변경 없음)

#### **방법 3: 일회성 우회 (임시 해결)**

관리자 권한 없이 현재 PowerShell 세션에서만 허용:

```powershell
# 현재 세션에서만 실행 정책 우회
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process

# 이제 npx 실행 가능
npx markdown-to-document-cli@latest interactive
```

**주의**: PowerShell 창을 닫으면 다시 원래대로 돌아갑니다.

#### **방법 4: 직접 Node 실행**

실행 정책을 완전히 우회:

```powershell
# npx 대신 node로 직접 실행
node "C:\Users\YourName\AppData\Roaming\npm\node_modules\markdown-to-document-cli\dist\cli.js" interactive
```

---

### 문제: Windows 경로 인식 오류

**증상**:
```
❌ 파일을 찾을 수 없습니다: C:\Users\username\document.md
```

**원인**:
- Windows 경로 구분자(`\`)와 Unix 경로 구분자(`/`) 혼용
- 공백이 포함된 경로

**해결 방법**:

1. **드래그 앤 드롭 사용** (가장 쉬움):
   - 파일 탐색기에서 파일을 CMD/PowerShell 창으로 드래그

2. **따옴표 사용**:
   ```cmd
   m2d "C:\Users\John Doe\Documents\file.md"
   ```

3. **경로 복사**:
   - 파일 탐색기에서 파일 선택
   - `Shift + 우클릭` → "경로 복사"
   - CMD/PowerShell에 붙여넣기

---

## Pandoc 관련 문제

### 문제: "Pandoc을 찾을 수 없습니다"

**증상**:
```
❌ Error: Pandoc을 찾을 수 없습니다. Pandoc을 설치하세요.
```

**원인**:
- Pandoc이 설치되지 않음
- PATH에 Pandoc이 없음

**해결 방법**:

1. Pandoc 설치 확인:
```bash
pandoc --version
```

2. Pandoc 설치:

**macOS**:
```bash
brew install pandoc
```

**Windows**:
```bash
winget install --id JohnMacFarlane.Pandoc
```

**Linux (Ubuntu/Debian)**:
```bash
sudo apt-get update
sudo apt-get install pandoc
```

**Linux (Fedora/RHEL)**:
```bash
sudo dnf install pandoc
```

3. 커스텀 경로 지정:
```bash
m2d document.md --pandoc-path /usr/local/bin/pandoc
```

4. 의존성 확인:
```bash
m2d check
```

### 문제: "Pandoc version too old"

**증상**:
```
Error: Pandoc 2.19+ is required
```

**원인**:
- Pandoc 버전이 너무 오래됨

**해결 방법**:

1. 현재 버전 확인:
```bash
pandoc --version
```

2. 업그레이드:

**macOS**:
```bash
brew upgrade pandoc
```

**Windows**:
```bash
winget upgrade --id JohnMacFarlane.Pandoc
```

**Linux**:
```bash
sudo apt-get update
sudo apt-get install --only-upgrade pandoc
```

### 문제: Pandoc 변환 실패

**증상**:
```
❌ EPUB 변환 실패: pandoc: error ...
```

**원인**:
- Pandoc 인자 오류
- 입력 파일 문제
- Pandoc 버전 호환성

**해결 방법**:

1. 상세 로그 확인:
```bash
m2d document.md --verbose
```

2. Pandoc 버전 확인:
```bash
pandoc --version
```

3. 입력 파일 검증:
```bash
# 파일 존재 확인
ls -la document.md

# 파일 내용 확인
cat document.md | head -20
```

4. 간단한 테스트:
```bash
# 직접 Pandoc 실행
pandoc document.md -o test.epub
```

---

## 변환 문제

### 문제: 파일 경로에 백슬래시가 포함되어 오류 발생

**증상**:
```
❌ 파일을 찾을 수 없습니다: /Users/username/My\ Documents/file.md
>> 파일을 찾을 수 없습니다.
```

**원인**:
- 경로에 백슬래시 이스케이프(`\`)가 포함됨
- 공백이 있는 디렉토리명에서 자주 발생
- 터미널 자동완성이나 복사-붙여넣기 시 발생

**해결 방법**:

**방법 1: 드래그 앤 드롭 (가장 쉬움)**
```bash
# 파일을 터미널 창으로 드래그하세요
# 경로가 자동으로 올바르게 입력됩니다
```

**방법 2: 따옴표로 감싸기**
```bash
# 큰따옴표 사용
m2d "/Users/username/My Documents/file.md"

# 작은따옴표 사용
m2d '/Users/username/My Documents/file.md'
```

**방법 3: 백슬래시 제거**
```bash
# ❌ 잘못된 예
m2d /Users/username/My\ Documents/file.md

# ✅ 올바른 예
m2d "/Users/username/My Documents/file.md"
```

**자동 수정 기능**:
CLI가 자동으로 다음을 처리합니다:
- 백슬래시 이스케이프 제거
- 따옴표 제거
- 경로 정규화
- 파일 존재 여부 확인

---

### 문제: "입력 파일을 찾을 수 없습니다"

**증상**:
```
❌ Error: Input file not found: /path/to/document.md
```

**원인**:
- 파일 경로 오류
- 파일이 존재하지 않음

**해결 방법**:

1. 파일 존재 확인:
```bash
ls -la /path/to/document.md
```

2. 상대 경로 사용:
```bash
# 현재 디렉토리
m2d document.md

# 상대 경로
m2d ./docs/document.md
```

3. 절대 경로 사용:
```bash
m2d /Users/username/docs/document.md
```

---

### 문제: Windows 네트워크 경로 오류 (v1.5.4+에서 해결됨)

**증상**:
```
❌ 파일을 찾을 수 없습니다: \\Mac\Home\README.md
```

**원인**:
- Windows에서 네트워크 공유 폴더의 파일 경로를 복사하면 UNC 경로 형식(`\\ServerName\ShareName\path`)으로 복사됨
- v1.5.3 이하 버전에서는 UNC 경로를 인식하지 못함

**해결 방법**:

#### 옵션 1: 최신 버전으로 업데이트 (권장)

v1.5.4 이상에서는 UNC 경로를 자동으로 인식합니다:

```bash
# 최신 버전으로 업데이트
npm install -g markdown-to-document-cli@latest

# 또는 npx로 최신 버전 사용
npx markdown-to-document-cli@latest interactive
```

#### 옵션 2: 로컬 드라이브에 복사

네트워크 파일을 로컬 드라이브로 복사:

```cmd
# Windows
copy \\Mac\Home\README.md C:\Users\username\Documents\
m2d C:\Users\username\Documents\README.md
```

#### 옵션 3: 네트워크 드라이브 매핑

네트워크 공유를 드라이브 문자로 매핑:

```cmd
# Windows에서 네트워크 드라이브 매핑
net use Z: \\Mac\Home

# 매핑된 드라이브 사용
m2d Z:\README.md
```

**지원되는 UNC 경로 형식 (v1.5.4+)**:
```
✅ \\Mac\Home\document.md
✅ \\ServerName\ShareName\folder\file.md
✅ \\192.168.1.100\Documents\test.md
✅ //Mac/Home/document.md (자동으로 백슬래시로 변환됨)
```

### 문제: "검증 오류: N개 발견"

**증상**:
```
❌ 검증 오류: 3개 발견
```

**원인**:
- 문서에 구문 오류가 있음
- 검증 모듈이 문제를 감지

**해결 방법**:

1. 상세 로그 확인:
```bash
m2d document.md --verbose
```

2. 자동 수정 활성화:
```bash
m2d document.md
```

3. 검증 건너뛰기:
```bash
m2d document.md --no-validate
```

4. 수동 수정:
검증 리포트를 확인하고 문제를 직접 수정

### 문제: YAML 구문 오류

**증상**:
```
⚠️ YAML 구문 오류: 콜론(:)이 누락됨
```

**원인**:
- YAML frontmatter 구문 오류

**해결 방법**:

**잘못된 예**:
```yaml
---
title 문서 제목
author 저자명
---
```

**올바른 예**:
```yaml
---
title: 문서 제목
author: 저자명
---
```

### 문제: Obsidian 링크 변환 오류

**증상**:
```
⚠️ 경고: Obsidian 링크 발견
```

**원인**:
- Obsidian 링크 문법 사용

**해결 방법**:

1. 자동 수정 확인:
```bash
m2d document.md
```

2. 수동 변환:
```markdown
<!-- Obsidian 문법 -->
[[링크]]

<!-- 표준 마크다운 -->
[링크](링크.md)
```

---

## ESM 모듈 오류

### 문제: "require is not defined"

**증상**:
```
✖ 변환 실패

❌ 오류:
   • require is not defined
```

또는:
```
[INFO] Step 4/6: Assemble
✖ 변환 실패
❌ 오류: require is not defined in ES module scope
```

**원인**:
- v1.5.2 이하 버전에서 발생하는 ESM/CommonJS 호환성 문제
- `fileUtils.ts`에서 CommonJS의 `require('os')`를 사용하여 발생
- Node.js의 ESM 모듈 환경에서는 `require` 함수를 사용할 수 없음

**해결 방법**:

**방법 1: 최신 버전으로 업데이트 (권장)**

v1.5.3 이상에서 수정되었습니다:

```bash
# 캐시 클리어 후 최신 버전 실행
npx clear-npx-cache
npx markdown-to-document-cli@latest interactive

# 또는 전역 설치 업데이트
npm uninstall -g markdown-to-document-cli
npm install -g markdown-to-document-cli
```

**방법 2: 특정 버전 지정**

```bash
# v1.5.3 이상 사용
npx markdown-to-document-cli@1.5.3 interactive
```

**확인 방법**:

```bash
# 설치된 버전 확인
npm list -g markdown-to-document-cli

# 또는 npx로 버전 확인
npx markdown-to-document-cli@latest --version
```

**기술적 배경**:
- Node.js의 `type: "module"` 설정으로 인해 ESM 모듈 시스템 사용
- ESM에서는 `import` 구문만 사용 가능
- v1.5.3에서 `require('os')`를 `import * as os from 'os'`로 변경하여 해결

---

## 이미지 문제

### 문제: 이미지 형식 오류 (.shtml, HTML 파일)

**증상**:
```
[WARNING] Could not convert image .../xxx.shtml: Cannot load file
  Jpeg Invalid marker used
  PNG Invalid PNG file, signature broken
  ...
  
! LaTeX Error: Cannot determine size of graphic in .../xxx.shtml (no BoundingBox)
```

**원인**:
- 마크다운 파일에 **HTML 페이지 URL**이 이미지로 참조됨
- `.shtml`, `.html`, `.htm` 등 웹 페이지 파일을 이미지로 사용
- Pandoc이 이를 다운로드하지만 이미지 형식이 아니어서 변환 실패

**문제가 되는 마크다운 예시**:
```markdown
![이미지](https://example.com/page.shtml)
![설명](http://site.com/document.html)
```

**해결 방법**:

#### 옵션 1: 실제 이미지 URL로 교체 (권장)

웹 페이지 대신 실제 이미지 파일 URL 사용:

```markdown
# ❌ 잘못된 예
![로고](https://example.com/about.shtml)

# ✅ 올바른 예
![로고](https://example.com/images/logo.png)
```

#### 옵션 2: 이미지 다운로드 후 로컬 파일 사용

1. 웹 페이지에서 실제 이미지 찾기
2. 이미지 다운로드 (우클릭 → 이미지 저장)
3. 로컬 경로로 참조:

```markdown
![로고](./images/logo.png)
```

#### 옵션 3: 잘못된 이미지 참조 제거

이미지가 필수가 아니라면 해당 라인 삭제:

```markdown
# 이 줄을 삭제
![이미지](https://example.com/page.shtml)
```

#### 옵션 4: 마크다운 파일 검사

잘못된 이미지 참조 찾기:

```bash
# Windows (PowerShell)
Select-String -Path "document.md" -Pattern "!\[.*\]\(.*\.shtml\)"
Select-String -Path "document.md" -Pattern "!\[.*\]\(.*\.html\)"

# macOS/Linux
grep -n "!\[.*\](.*\.shtml)" document.md
grep -n "!\[.*\](.*\.html)" document.md
```

**지원되는 이미지 형식**:
```
✅ PNG (.png)
✅ JPEG (.jpg, .jpeg)
✅ GIF (.gif)
✅ SVG (.svg)
✅ WebP (.webp)
✅ BMP (.bmp)

❌ HTML (.html, .htm, .shtml)
❌ 텍스트 파일 (.txt, .md)
❌ 문서 파일 (.pdf, .docx)
```

**참고**:
- 이 오류는 **소스 마크다운 파일의 문제**입니다
- 변환 도구가 아닌 **마크다운 파일을 수정**해야 합니다
- 웹 페이지 스크린샷을 이미지로 저장하여 사용할 수 있습니다

---

### 문제: "Image not found"

**증상**:
```
⚠️ Image not found: ./images/photo.png
```

**원인**:
- 이미지 파일이 존재하지 않음
- 경로가 잘못됨

**해결 방법**:

1. 이미지 존재 확인:
```bash
ls -la ./images/photo.png
```

2. 이미지 위치 확인:
이미지는 다음 위치에서 검색됩니다:
- 마크다운 파일과 동일한 디렉토리
- `images/` 폴더
- `attachments/` 폴더
- `assets/` 폴더
- `media/` 폴더

3. 절대 경로 사용:
```markdown
![설명](/absolute/path/to/image.png)
```

4. 이미지 복사:
```bash
cp /path/to/image.png ./images/
```

### 문제: "지원하지 않는 이미지 형식"

**증상**:
```
⚠️ 지원하지 않는 이미지 형식: bmp
```

**원인**:
- 지원하지 않는 이미지 형식 사용

**해결 방법**:

지원하는 형식:
- PNG
- JPG/JPEG
- GIF
- SVG
- WebP

변환:
```bash
# BMP → PNG
convert image.bmp image.png

# 또는 온라인 변환 도구 사용
```

### 문제: 이미지 alt 텍스트 경고

**증상**:
```
⚠️ 이미지 alt 텍스트가 없습니다.
```

**원인**:
- 접근성을 위해 alt 텍스트가 필요함

**해결 방법**:

```markdown
<!-- 잘못된 예 -->
![](image.png)

<!-- 올바른 예 -->
![이미지 설명](image.png)
```

---

## PDF 관련 문제

### 문제: "PDF 변환 실패 - PDF 엔진을 찾을 수 없습니다"

**증상**:
```
❌ PDF 변환 실패: xelatex not found. Please select a different --pdf-engine or install xelatex
```
또는
```
❌ PDF 엔진을 찾을 수 없습니다. WeasyPrint, XeLaTeX, 또는 PDFLaTeX를 설치하세요.
```

**원인**:
- PDF 생성에 필요한 엔진(WeasyPrint, XeLaTeX, PDFLaTeX)이 설치되지 않음
- `--pdf-engine=auto` 옵션 사용 시 사용 가능한 엔진이 없음

**해결 방법**:

**옵션 1: WeasyPrint 설치 (권장)**
```bash
# Python pip 사용
pip install weasyprint

# 또는 Python 3
pip3 install weasyprint
```

**옵션 2: XeLaTeX 설치 (한글 지원 우수)**
```bash
# macOS (Homebrew)
brew install --cask basictex
# 설치 후 PATH 업데이트
eval "$(/usr/libexec/path_helper)"

# 또는 전체 TeX Live 설치
brew install --cask mactex

# Linux (Ubuntu/Debian)
sudo apt-get install texlive-xetex texlive-fonts-recommended

# Linux (Fedora)
sudo dnf install texlive-xetex

# Windows
# https://www.tug.org/texlive/ 에서 설치 프로그램 다운로드
```

**옵션 3: PDFLaTeX 설치**
```bash
# macOS
brew install --cask basictex

# Linux (Ubuntu/Debian)
sudo apt-get install texlive-latex-base

# Windows
# https://www.tug.org/texlive/ 에서 설치 프로그램 다운로드
```

**설치 확인**:
```bash
# WeasyPrint 확인
weasyprint --version

# XeLaTeX 확인
xelatex --version

# PDFLaTeX 확인
pdflatex --version
```

**특정 엔진 지정**:
```bash
# 자동 선택 (기본값)
m2d document.md --pdf-engine auto

# WeasyPrint 사용
m2d document.md --pdf-engine weasyprint

# XeLaTeX 사용
m2d document.md --pdf-engine xelatex

# PDFLaTeX 사용
m2d document.md --pdf-engine pdflatex
```

### 문제: PDF 변환이 멈추거나 시간 초과

**증상**:
```
[INFO] Step 5/6: Convert (PDF)
💡 PDF 변환은 최대 2분 소요될 수 있습니다. 잠시만 기다려주세요...
(프로세스가 멈춤 또는 2분 후 시간 초과 오류)
```

또는:
```
❌ PDF 변환 실패: PDF 변환 시간 초과 (2분).
```

**원인**:
- **Windows MiKTeX**: 패키지 설치 대화상자가 백그라운드에서 표시되어 프로세스 차단
- **대용량 문서**: 변환에 2분 이상 소요
- **PDF 엔진 문제**: XeLaTeX/PDFLaTeX 실행 중 오류로 입력 대기

**해결 방법**:

#### 옵션 1: MiKTeX 자동 설치 활성화 (Windows 사용자) ⭐

**문제**: MiKTeX가 패키지 설치 대화상자를 표시하지만 CLI에서는 응답할 수 없음

**해결**:
```
1. 현재 프로세스 중단 (Ctrl+C)
2. MiKTeX Console 실행 (관리자 권한)
3. Settings → General → "Install missing packages on-the-fly" → Always
4. 다시 변환 실행
```

이제 패키지가 자동으로 설치되어 대화상자가 나타나지 않습니다.

#### 옵션 2: WeasyPrint 사용 (가장 간단)

MiKTeX 문제를 완전히 우회:

```bash
# WeasyPrint 설치
pip install weasyprint

# WeasyPrint로 PDF 생성
m2d document.md --pdf-engine weasyprint
```

**장점**:
- 패키지 관리 불필요
- 빠른 변환 속도
- 대화상자 없음

#### 옵션 3: 대용량 문서 분할

문서가 너무 큰 경우:

```bash
# 문서를 여러 파일로 분할
# 각 파일을 개별적으로 변환
m2d chapter1.md --format pdf
m2d chapter2.md --format pdf
```

#### 옵션 4: 다른 PDF 엔진 시도

```bash
# PDFLaTeX 사용
m2d document.md --pdf-engine pdflatex

# 또는 자동 선택
m2d document.md --pdf-engine auto
```

**참고**:
- v1.5.6부터 PDF 변환에 2분 타임아웃 적용
- 타임아웃 발생 시 명확한 오류 메시지와 해결 방법 제공
- EPUB 변환은 정상 작동하므로 PDF만 문제가 있는 경우 위 방법 시도

---

### 문제: Windows MiKTeX 패키지 설치 대화상자 (unicode-math.sty, special.map 등)

**증상**:
Windows에서 PDF 변환 시 다음과 같은 패키지 설치 대화상자가 **반복적으로** 나타남:
```
This required file could not be found:
  unicode-math.sty (또는 special.map, fontspec.sty 등)

The file is a part of this package:
  unicode-math (또는 fontname, fontspec 등)
```

> **⚠️ 중요**: 대화상자가 계속 나타나는 것은 정상입니다. XeLaTeX는 10개 이상의 패키지가 필요하므로 각각에 대해 대화상자가 나타납니다.

**원인**:
- MiKTeX가 필요한 LaTeX 패키지를 자동으로 다운로드하려고 시도
- `unicode-math`, `fontname`, `fontspec`, `xetex` 등 10개 이상의 패키지가 누락됨
- XeLaTeX 사용 시 한글 폰트 처리를 위해 필요한 패키지들

**🚀 빠른 해결 (30초)**:
```
1. 현재 대화상자 "Cancel" 클릭
2. Windows 시작 메뉴 → "MiKTeX Console" 실행
3. Settings → General → "Install missing packages on-the-fly" → Always
4. 다시 PDF 변환 실행 → 자동으로 모든 패키지 설치됨
```

**해결 방법**:

#### 옵션 1: 자동 설치 활성화 (가장 권장) ⭐

**대화상자가 계속 나타나는 이유**:
- XeLaTeX는 `unicode-math`, `fontname`, `fontspec`, `xetex` 등 10개 이상의 패키지가 필요합니다
- 각 패키지마다 대화상자가 나타나므로 매우 번거롭습니다

**해결 방법 - 자동 설치 활성화**:

1. **현재 대화상자는 "Cancel" 클릭** (일단 중단)

2. **MiKTeX Console 실행**:
   - Windows 시작 메뉴에서 "MiKTeX Console" 검색 및 실행

3. **자동 설치 설정**:
   ```
   Settings → General → "Install missing packages on-the-fly"
   → Always (또는 Yes) 선택
   → OK 클릭
   ```

4. **다시 PDF 변환 실행**:
   ```bash
   m2d document.md --format pdf
   ```
   - 이제 대화상자 없이 자동으로 모든 패키지가 설치됩니다

**또는 수동으로 모든 패키지 설치** (대화상자가 계속 나타나는 경우):
- 각 대화상자에서 "Install" 클릭
- 필요한 패키지: `unicode-math`, `fontname`, `fontspec`, `xetex`, `lm-math`, `amsmath`, `geometry`, `hyperref` 등
- 약 10-15개의 패키지 설치 후 완료됩니다

#### 옵션 2: 수동으로 필요한 패키지 설치

MiKTeX Console에서 직접 설치:
```
1. MiKTeX Console 실행
2. Packages 탭 클릭
3. 검색창에서 다음 패키지 검색 및 설치:
   - unicode-math
   - fontspec
   - xetex
   - lm-math
   - amsmath
```

#### 옵션 3: WeasyPrint 사용 (LaTeX 불필요)

MiKTeX 패키지 문제를 피하려면 WeasyPrint를 사용하세요:

```bash
# Python 및 WeasyPrint 설치
pip install weasyprint

# WeasyPrint로 PDF 생성
m2d document.md --pdf-engine weasyprint
```

**장점**:
- LaTeX 패키지 관리 불필요
- 설치가 간단함
- 한글 지원 우수

#### 옵션 4: 전체 TeX Live 설치

MiKTeX 대신 전체 TeX Live 설치:
```
1. https://www.tug.org/texlive/ 방문
2. install-tl-windows.exe 다운로드
3. 전체 설치 (약 5GB, 모든 패키지 포함)
```

**참고**:
- 첫 PDF 변환 시 여러 패키지 설치 대화상자가 나타날 수 있습니다
- 모두 "Install"을 클릭하면 이후에는 나타나지 않습니다
- 자동 설치를 활성화하면 사용자 개입 없이 진행됩니다

---

### 문제: MiKTeX 폰트 오류 "The font 'Noto Sans KR' cannot be found"

**증상**:
```
! Package fontspec Error: The font "Noto Sans KR" cannot be found.
xelatex: security risk: running with elevated privileges
miktex-maketfm: major issue: So far, you have not checked for MiKTeX updates.
Couldn't open `Noto Sans .cfg'
```

**원인**:
- XeLaTeX가 시스템에 설치된 "Noto Sans KR" 폰트를 찾지 못함
- MiKTeX가 관리자 권한으로 실행되어 보안 경고 발생
- MiKTeX 업데이트가 필요함

**해결 방법**:

#### 옵션 1: WeasyPrint 사용 (가장 간단) ⭐

XeLaTeX 대신 WeasyPrint를 사용하면 폰트 문제가 없습니다:

```bash
# Python 및 WeasyPrint 설치
pip install weasyprint

# WeasyPrint로 PDF 생성
m2d document.md --pdf-engine weasyprint
```

**장점**:
- 시스템 폰트 자동 인식
- MiKTeX 패키지 관리 불필요
- 보안 경고 없음
- 한글 완벽 지원

#### 옵션 2: Noto Sans KR 폰트 설치

Windows에 Noto Sans KR 폰트가 없는 경우:

1. **Google Fonts에서 다운로드**:
   - https://fonts.google.com/noto/specimen/Noto+Sans+KR 방문
   - "Download family" 클릭
   - ZIP 파일 압축 해제

2. **폰트 설치**:
   - `.ttf` 파일들을 모두 선택
   - 우클릭 → "설치" 또는 "모든 사용자용으로 설치"
   - 컴퓨터 재시작

3. **다시 변환 시도**:
   ```bash
   m2d document.md --format pdf
   ```

#### 옵션 3: MiKTeX 업데이트 및 권한 문제 해결

1. **MiKTeX Console을 관리자 권한으로 실행**:
   - Windows 시작 메뉴에서 "MiKTeX Console" 검색
   - 우클릭 → "관리자 권한으로 실행"

2. **업데이트 확인 및 설치**:
   ```
   Updates 탭 클릭
   → "Check for updates" 클릭
   → 업데이트 있으면 "Update now" 클릭
   ```

3. **자동 패키지 설치 활성화**:
   ```
   Settings → General
   → "Install missing packages on-the-fly" → Always
   ```

4. **다시 변환 시도**

#### 옵션 4: 기본 폰트 사용

Noto Sans KR 대신 Windows 기본 폰트 사용:

```bash
# 폰트 지정 없이 변환 (기본 폰트 사용)
m2d document.md --format pdf --pdf-engine xelatex
```

**참고**:
- XeLaTeX는 시스템에 설치된 폰트만 사용 가능
- WeasyPrint는 웹 폰트와 시스템 폰트 모두 사용 가능
- 한글 문서는 WeasyPrint 사용을 권장

---

### 문제: 한글 폰트 렌더링 오류

**증상**:
```
PDF에서 한글이 깨짐
```

**원인**:
- PDF 엔진이 한글 폰트를 찾지 못함

**해결 방법**:

1. XeLaTeX 사용:
```bash
m2d document.md --format pdf --pdf-engine xelatex
```

2. 시스템 폰트 확인:
```bash
# macOS
fc-list :lang=ko

# Linux
fc-list :lang=ko
```

3. 커스텀 CSS 사용:
```css
@font-face {
  font-family: 'Noto Sans CJK KR';
  src: url('/path/to/NotoSansCJKkr-Regular.otf');
}

body {
  font-family: 'Noto Sans CJK KR', sans-serif;
}
```

### 문제: PDF 페이지 레이아웃 오류

**증상**:
```
PDF에서 여백이나 페이지 크기가 이상함, 또는 레이아웃이 완전히 엉망으로 표시됨
```

**원인**:
- 구 버전(v1.1.4 이하): 표지 생성 시 전체 HTML 구조 중복으로 인한 레이아웃 붕괴
- `box-sizing` 설정 미비로 인한 여백 계산 오류
- 한글 텍스트의 부자연스러운 줄바꿈

**해결 방법**:

1. **최신 버전 업데이트 (권장)**:
   v1.1.5부터는 HTML Fragment 방식을 사용하여 레이아웃 붕괴 문제를 완전히 해결했습니다.
   ```bash
   npx markdown-to-document-cli@latest interactive
   ```

2. **커스텀 CSS 조정**:
   여백 문제가 지속된다면 `box-sizing: border-box`가 적용되어 있는지 확인하세요.

3. **한글 가독성 설정**:
   v1.1.5+ 에서는 `word-break: keep-all`이 기본 적용되어 단어 단위로 줄바꿈이 일어납니다.

---

## 타이포그래피 관련 문제

### 문제: "Typography preset not found"

**증상**:
```bash
Error: Typography preset not found: custom
```

**원인**:
- 존재하지 않는 타이포그래피 프리셋 지정

**해결 방법**:

1. 사용 가능한 프리셋 확인:
```bash
m2d list-presets
```

2. 올바른 프리셋 사용:
```bash
# 올바른 프리셋
m2d document.md --typography novel
m2d document.md --typography presentation
m2d document.md --typography review
m2d document.md --typography ebook
```

### 문제: 폰트가 올바르게 적용되지 않음

**증상**:
```
변환된 문서에서 폰트가 기본 폰트로 표시됨
```

**원인**:
- 시스템에 해당 폰트가 설치되지 않음
- CSS가 올바르게 적용되지 않음

**해결 방법**:

1. 한국어 폰트 설치 확인:
```bash
# macOS
fc-list | grep -i "noto"

# Linux
fc-list | grep -i "noto"
```

2. 커스텀 CSS 사용:
```bash
m2d document.md --css custom.css
```

`custom.css` 예시:
```css
@font-face {
  font-family: 'Noto Sans CJK KR';
  src: url('NotoSansCJKKR-Regular.woff2') format('woff2');
}

body {
  font-family: 'Noto Sans CJK KR', sans-serif;
}
```

3. 시스템 폰트 사용:
```css
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
```

### 문제: 페이지 여백이 올바르지 않음

**증상**:
```
PDF에서 여백이 너무 넓거나 좁음
```

**원인**:
- 타이포그래피 프리셋의 여백 설정이 적합하지 않음

**해결 방법**:

1. 다른 프리셋 시도:
```bash
# 넓은 여백이 필요한 경우
m2d document.md --typography presentation

# 좁은 여백이 필요한 경우
m2d document.md --typography review
```

2. 커스텀 CSS로 여백 조정:
```css
@page {
  margin-top: 20mm;
  margin-bottom: 20mm;
  margin-left: 15mm;
  margin-right: 15mm;
}
```

### 문제: EPUB에서 한글 폰트가 깨지거나 기본 서체로 보임

**증상**:
```
전자책 리더기에서 한글이 명조/고딕이 아닌 시스템 기본 서체로 표시됨
```

**원인**:
- EPUB 파일 내부에 폰트가 직접 포함(Embedding)되지 않음

**해결 방법**:

1. **자동 임베딩 사용 (v1.1.4+)**:
   최신 버전은 macOS 시스템의 Noto Sans/Serif KR 폰트를 자동으로 찾아 EPUB에 포함시킵니다. 별도의 설정 없이 변환하세요.

2. **폰트 서브세팅 활성화**:
   파일 용량을 줄이면서 폰트를 확실히 포함하려면 `--font-subsetting` 옵션을 사용하세요.
   ```bash
   m2d document.md --font-subsetting
   ```

---

## 폰트 서브세팅 관련 문제

### 문제: "Font not found"

**증상**:
```bash
Error: Input font not found: /path/to/font.ttf
```

**원인**:
- 폰트 파일 경로가 올바르지 않음
- 폰트 파일이 존재하지 않음

**해결 방법**:

1. 폰트 파일 경로 확인:
```bash
ls -la /path/to/font.ttf
```

2. 상대 경로 사용:
```bash
# 프로젝트 내 fonts 폴더
m2d document.md --font-subsetting
```

3. 절대 경로 사용:
```bash
m2d document.md --font-subsetting --font-path /absolute/path/to/font.ttf
```

### 문제: 폰트 서브세팅이 작동하지 않음

**증상**:
```
폰트 서브세팅 옵션을 사용해도 파일 크기가 감소하지 않음
```

**원인**:
- fontkit이 설치되지 않음
- 폰트 형식이 지원되지 않음

**해결 방법**:

1. fontkit 설치 확인:
```bash
npm list fontkit
```

2. fontkit 재설치:
```bash
npm uninstall fontkit
npm install fontkit
```

3. 지원되는 폰트 형식 확인:
```bash
# 지원되는 형식: TTF, OTF, WOFF, WOFF2
file font.ttf
```

4. 폰트 형식 변환:
```bash
# TTF을 WOFF2로 변환 (예시)
pip install fonttools
pyftsubset font.ttf --output-file=font.woff2 --flavor=woff2
```

### 문제: 캐시 문제

**증상**:
```
폰트 캐시가 오래된 폰트를 사용함
```

**원인**:
- 폰트 캐시가 갱신되지 않음

**해결 방법**:

1. 캐시 삭제:
```bash
# 프로젝트 내 캐시 삭제
rm -rf .font-cache

# 시스템 임시 캐시 삭제
rm -rf /tmp/markdown-to-document-pandoc/font-cache
```

2. 캐시 비활성화 후 재시도:
```bash
m2d document.md --no-cache
```

---

## 성능 문제

### 문제: 변환이 너무 느림

**증상**:
```
대용량 문서 변환 시 시간이 오래 걸림
```

**원인**:
- 많은 이미지
- 복잡한 문서 구조
- 느린 PDF 엔진

**해결 방법**:

1. 이미지 최적화:
```bash
# 이미지 압축
convert image.png -quality 85 image-optimized.png

# 이미지 크기 조정
convert image.png -resize 1920x1080 image-resized.png
```

2. 검증 건너뛰기:
```bash
m2d document.md --no-validate
```

3. 더 빠른 PDF 엔진 사용:
```bash
m2d document.md --format pdf --pdf-engine pdflatex
```

4. 폰트 서브세팅:
```bash
m2d document.md --font-subsetting
```

### 문제: 메모리 부족

**증상**:
```
JavaScript heap out of memory
```

**원인**:
- 대용량 문서 처리
- Node.js 메모리 제한

**해결 방법**:

```bash
# 메모리 증가
NODE_OPTIONS="--max-old-space-size=4096" m2d document.md
```

---

## 기타 문제

### 문제: 권한 오류

**증상**:
```
Error: EACCES: permission denied
```

**원인**:
- 쓰기 권한 없음
- 전역 설치 권한 문제

**해결 방법**:

1. 출력 디렉토리 권한 확인:
```bash
ls -la ./output
chmod 755 ./output
```

2. sudo 사용 (macOS/Linux):
```bash
sudo npm install -g markdown-to-document-cli
```

3. npx 사용 (권한 문제 회피):
```bash
npx markdown-to-document-cli@latest document.md
```

### 문제: 임시 파일 정리

**증상**:
```
임시 파일이 남아있음
```

**원인**:
- 변환 중단으로 임시 파일 미정리

**해결 방법**:

```bash
# 임시 파일 삭제
rm -rf /tmp/markdown-to-document

# 또는
rm -rf $TMPDIR/markdown-to-document
```

### 문제: 디버깅

**증상**:
```
자세한 오류 정보가 필요함
```

**해결 방법**:

1. 상세 로그 활성화:
```bash
m2d document.md --verbose
```

2. DEBUG 환경 변수:
```bash
DEBUG=true m2d document.md
```

3. Pandoc 직접 실행:
```bash
pandoc document.md -o test.epub --verbose
```

---

## 도움 요청

위의 해결 방법으로 문제가 해결되지 않으면:

1. **정보 수집**:
```bash
# 버전 정보
m2d --version
node --version
npm --version
pandoc --version

# 상세 로그
m2d document.md --verbose > debug.log 2>&1
```

2. **GitHub Issues**:
   - [새 이슈 생성](https://github.com/goodlookingprokim/markdown-to-document-cli/issues)
   - 디버그 로그와 오류 메시지 포함

3. **Email**:
   - edulovesai@gmail.com

---

## 자주 묻는 질문 (FAQ)

### Q: 옵시디언 없이 사용할 수 있나요?
A: 네, 옵시디언 플러그인에서 독립형 CLI 도구로 변환되었습니다. 옵시디언 없이 사용할 수 있습니다.

### Q: Windows에서 사용할 수 있나요?
A: 네, Windows, macOS, Linux 모두 지원합니다.

### Q: 상업적으로 사용할 수 있나요?
A: 네, MIT 라이선스로 상업적 사용이 가능합니다.

### Q: 한글 지원하나요?
A: 네, 완벽하게 한글을 지원합니다.

### Q: 배치 처리가 가능한가요?
A: 현재는 단일 파일만 지원합니다. 배치 처리는 향후 계획에 있습니다.

---

**마지막 업데이트**: 2026-01-06 (v1.2.7)
