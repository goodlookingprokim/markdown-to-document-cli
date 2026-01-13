# Windows 완전 초보자를 위한 설치 가이드

> **목표**: 컴퓨터에 아무것도 설치되어 있지 않은 상태에서, 마크다운 파일을 전자책(EPUB)과 PDF로 변환할 수 있는 환경을 만드는 것입니다.

---

## 요리로 이해하는 설치 과정

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

## 설치 순서 한눈에 보기

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

## 1단계: Node.js 설치하기 (가스레인지 설치)

### Node.js가 뭔가요?

Node.js는 **자바스크립트 프로그램을 실행할 수 있게 해주는 환경**입니다.
NpxMagicDoc은 자바스크립트로 만들어졌기 때문에, Node.js가 있어야 실행됩니다.

요리로 비유하면, **가스레인지 없이는 요리를 할 수 없는 것**과 같습니다.

### 설치 방법

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

### 설치 확인하기

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

## 2단계: Pandoc 설치하기 (프라이팬 구입)

### Pandoc이 뭔가요?

Pandoc은 **문서 형식을 변환하는 만능 도구**입니다.
마크다운을 EPUB, PDF, HTML, Word 등 거의 모든 형식으로 바꿀 수 있습니다.

요리로 비유하면, **재료를 원하는 요리로 변환하는 프라이팬**입니다.

### 설치 방법

**방법 A: winget 사용 (권장)**
```powershell
winget install --id JohnMacFarlane.Pandoc
```

**방법 B: 직접 다운로드**

1. **Pandoc 공식 사이트 방문**
```
https://pandoc.org/installing.html
```

2. **Windows 설치 파일 다운로드**
- 페이지에서 **"Download the latest installer"** 링크 찾기
- 또는 직접 GitHub 릴리스 페이지로 이동:
```
https://github.com/jgm/pandoc/releases/latest
```
- `pandoc-3.x.x-windows-x86_64.msi` 파일 다운로드

3. **다운로드된 파일 실행**
- 더블클릭해서 설치 마법사 시작

4. **설치 마법사 따라하기**
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

### 설치 확인하기

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

## 3단계: 여기까지 왔다면 EPUB 변환 가능! 🎉

축하합니다! 이제 마크다운 파일을 EPUB 전자책으로 변환할 수 있습니다.

### 바로 사용해보기

**1. PowerShell 열기**

**2. 아래 명령어 입력** (테스트용)
```powershell
npx markdown-to-document-cli@latest interactive
```

**3. 대화형 모드에서 안내에 따라 진행**
- 파일 경로 입력 (또는 파일을 PowerShell 창에 드래그 앤 드롭)
- 출력 형식 선택: `epub`
- 변환 완료!

### 파일 경로 입력 팁

```powershell
# 방법 1: 드래그 앤 드롭 (가장 쉬움!)
# 파일을 PowerShell 창으로 끌어다 놓으면 경로가 자동 입력됩니다

# 방법 2: 직접 입력
npx markdown-to-document-cli@latest "C:\Users\홍길동\Documents\내문서.md"

# 방법 3: 대화형 모드
npx markdown-to-document-cli@latest interactive
```

---

## 4단계: [선택] Python 설치하기 (오븐 설치)

> **참고**: PDF 변환이 필요 없다면 이 단계를 건너뛰세요!

### Python이 뭔가요?

Python은 **프로그래밍 언어**입니다.
WeasyPrint라는 PDF 변환 도구가 Python으로 만들어져서, Python이 있어야 WeasyPrint를 사용할 수 있습니다.

요리로 비유하면, **오븐을 작동시키는 전기**와 같습니다.

### 설치 방법

**방법 A: winget 사용 (권장)**
```powershell
winget install --id Python.Python.3.12
```

**방법 B: 직접 다운로드**

1. **Python 공식 사이트 방문**
```
https://www.python.org/downloads/
```

2. **최신 버전 다운로드**
- 노란색 **"Download Python 3.x.x"** 버튼 클릭

3. **다운로드된 파일 실행**
- `python-3.x.x-amd64.exe` 파일 더블클릭

4. **⚠️ 매우 중요! 설치 옵션 설정**
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

5. **설치 완료 후 "Disable path length limit" 클릭** (나오면)

6. **컴퓨터 재시작** (권장)

### 설치 확인하기

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

## 5단계: [선택] WeasyPrint 설치하기 (오븐 예열)

> **참고**: Python이 설치되어 있어야 합니다!

### WeasyPrint가 뭔가요?

WeasyPrint는 **HTML/CSS를 PDF로 변환하는 도구**입니다.
NpxMagicDoc이 마크다운을 HTML로 바꾸고, WeasyPrint가 그것을 PDF로 만듭니다.

요리로 비유하면, **오븐에서 빵을 굽는 것**과 같습니다.

### 왜 WeasyPrint인가요?

| 항목 | WeasyPrint | MiKTeX (LaTeX) |
|------|------------|----------------|
| **설치** | 간단 (pip 한 줄) | 복잡 (수 GB 다운로드) |
| **대화상자** | 없음 | 패키지 설치 대화상자 반복 |
| **Mac과 동일** | ✅ 100% 동일한 결과 | ❌ HTML 태그 노출, 레이아웃 깨짐 |
| **한글** | ✅ 완벽 지원 | ⚠️ 폰트 설정 필요 |

### 설치 방법

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

### GTK 런타임 설치 (필수!)

WeasyPrint는 GTK 런타임 라이브러리가 필요합니다.

**1. MSYS2 설치**
- https://www.msys2.org/ 에서 다운로드 및 설치

**2. MSYS2 MINGW64 터미널 열기**
- 시작 메뉴에서 **"MSYS2 MINGW64"** 검색 (⚠️ UCRT64 아님!)

**3. GTK3 패키지 설치**
```bash
pacman -S --needed mingw-w64-x86_64-gtk3
```

**4. 시스템 PATH 설정**
- `Win + R` → `sysdm.cpl` → 고급 → 환경 변수 → Path 편집
- 다음 경로 추가: `C:\msys64\mingw64\bin`
- ⚠️ `C:\msys64\ucrt64\bin`이 있다면 **제거**하세요 (호환성 문제)

**5. 새 PowerShell 열고 테스트**
```powershell
weasyprint --version
```

```
WeasyPrint version 60.1   ← 이런 식으로 나오면 성공! 🎉
```

> **상세 가이드**: [WEASYPRINT_GTK_WINDOWS_FIX.md](./WEASYPRINT_GTK_WINDOWS_FIX.md)

---

## 모든 설치 완료! 최종 확인

### 전체 설치 확인 명령어

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

### 변환 테스트

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

## 터미널 사용 팁

### 붙여넣기 방법

Windows CMD나 PowerShell에서 명령어를 붙여넣을 때 **Ctrl+V가 작동하지 않는 경우**가 있습니다.

| 방법 | 설명 |
|------|------|
| **마우스 오른쪽 클릭** | 가장 확실! 클릭만 하면 붙여넣기 |
| **Ctrl+Shift+V** | 일부 최신 터미널에서 작동 |
| **Windows Terminal 설치** | Microsoft Store에서 설치, Ctrl+V 기본 지원 |

> **팁**: CMD 창 제목 표시줄 우클릭 → 속성 → "Ctrl 키 바로 가기 사용" 체크하면 Ctrl+V 활성화!

### 경로 입력 팁

1. **경로에 공백이 있으면** 따옴표로 감싸세요: `"C:\My Documents\file.md"`
2. **네트워크 드라이브** UNC 경로 지원: `\\Mac\Home\file.md`
3. **드래그 앤 드롭**: 파일을 PowerShell 창에 끌어다 놓으면 경로 자동 입력

---

## 흔한 문제 해결

### "'m2d' 인식 안됨"

**해결**: npx 사용
```powershell
npx markdown-to-document-cli@latest interactive
```

### "'node' 인식 안됨"

**해결**: 컴퓨터 재시작 후 새 PowerShell 열기

### "'python' 인식 안됨"

**해결**: Python 삭제 → 재설치 시 **PATH 체크**

### PowerShell 실행 정책 오류

**증상**:
```
npx : File C:\Program Files\nodejs\npx.ps1 cannot be loaded because running scripts is disabled
```

**해결 방법**:

**방법 1: CMD 사용 (가장 쉬움)**
- `Win + R` → `cmd` 입력 → Enter
- CMD에서 명령어 실행

**방법 2: 실행 정책 변경**
```powershell
# 관리자 PowerShell에서 실행
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### WeasyPrint "cannot load library" 오류

**증상**:
```
OSError: cannot load library 'libgobject-2.0-0.dll': error 0x7e
```

**해결**: 위의 "GTK 런타임 설치" 섹션 참조

> **더 많은 문제 해결**: [TroubleShooting.md](./TroubleShooting.md)

---

## 자주 묻는 질문 (FAQ)

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
- WeasyPrint: 설치 간단, 대화상자 없음, Mac과 동일한 결과
- MiKTeX: 설치 복잡, 패키지 설치 대화상자 반복, HTML 태그 노출 문제

초보자에게는 WeasyPrint가 훨씬 쉽습니다!

### Q: UCRT64 대신 MINGW64를 사용해야 하는 이유는?

**A**: WeasyPrint의 cffi 라이브러리가 UCRT64와 호환성 문제가 있습니다.
- UCRT64: `error 0x7e` 오류 발생
- MINGW64: 정상 작동

---

**마지막 업데이트**: 2026-01-13 (v1.5.16)
