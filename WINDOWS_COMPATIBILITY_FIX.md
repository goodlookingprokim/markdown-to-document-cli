# Windows 호환성 종합 수정 - v1.5.1

## 개요

Windows 환경에서 프로그램 사용 시 발생할 수 있는 잠재적 문제들을 종합적으로 검토하고 수정했습니다.

---

## 🔍 발견된 문제 및 수정 내역

### **🔴 Critical Issue #1: Temp Directory - Unix 경로 하드코딩**

#### **문제점**
**위치**: `src/utils/fileUtils.ts:83-87`

```typescript
// 수정 전 (BROKEN)
export function getTempDir(): string {
    const tempDir = path.join(process.env.TMPDIR || '/tmp', 'markdown-to-document');
    ensureDirectory(tempDir);
    return tempDir;
}
```

**Root Cause**:
- Fallback 경로가 `/tmp` (Unix 전용)
- Windows에는 `/tmp` 디렉토리가 존재하지 않음
- `process.env.TMPDIR`도 Windows에서는 설정되지 않음
- Windows는 `TEMP` 또는 `TMP` 환경 변수 사용

**영향**:
- Windows에서 임시 파일 생성 실패
- 변환 프로세스 전체 중단
- "Cannot create directory /tmp/markdown-to-document" 오류 발생

#### **수정 내용**
```typescript
// 수정 후 (FIXED)
export function getTempDir(): string {
    // Use Node.js os.tmpdir() for cross-platform compatibility
    // Works on Windows (C:\Users\...\AppData\Local\Temp), macOS (/var/folders/...), Linux (/tmp)
    const os = require('os');
    const tempDir = path.join(os.tmpdir(), 'markdown-to-document');
    ensureDirectory(tempDir);
    return tempDir;
}
```

**해결 방법**:
- `os.tmpdir()` 사용으로 플랫폼 자동 감지
- Windows: `C:\Users\<username>\AppData\Local\Temp`
- macOS: `/var/folders/...`
- Linux: `/tmp`

---

### **🔴 Critical Issue #2: common.ts의 잘못된 getTempDir 구현**

#### **문제점**
**위치**: `src/utils/common.ts:78-84`

```typescript
// 수정 전 (BROKEN)
export function getTempDir(): string {
    const tempDir = (process.env.TMPDIR || '/tmp') + '/markdown-to-document';
    if (!import('fs').then(fs => fs.existsSync(tempDir))) {
        import('fs').then(fs => fs.mkdirSync(tempDir, { recursive: true }));
    }
    return tempDir;
}
```

**Root Cause (Multiple Issues)**:
1. **Unix 경로 하드코딩**: 동일한 `/tmp` 문제
2. **비동기 로직 오류**: 동기 함수에서 `import()` (Promise) 사용
3. **타이밍 이슈**: 디렉토리 생성 완료 전에 경로 반환
4. **코드 중복**: fileUtils.ts와 중복 구현

**영향**:
- 디렉토리가 생성되지 않은 상태에서 경로 반환
- 파일 쓰기 실패
- 예측 불가능한 동작

#### **수정 내용**
```typescript
// 수정 후 (FIXED)
// getTempDir moved to fileUtils.ts to avoid duplication
// Import from fileUtils.ts instead: import { getTempDir } from './fileUtils.js';
```

**해결 방법**:
- `common.ts`에서 완전히 제거
- `fileUtils.ts`의 올바른 구현만 사용
- 중복 제거로 유지보수성 향상

---

### **🔴 Critical Issue #3: 하드코딩된 macOS 폰트 경로**

#### **문제점**
**위치**: `src/services/PandocService.ts:242-253`

```typescript
// 수정 전 (BROKEN)
const fontsToEmbed = [
    '/System/Library/Fonts/Supplemental/NotoSansKR-Regular.otf',
    '/System/Library/Fonts/Supplemental/NotoSansKR-Bold.otf',
    '/System/Library/Fonts/Supplemental/NotoSerifKR-Regular.otf',
    '/System/Library/Fonts/Supplemental/NotoSerifKR-Bold.otf'
];

for (const fontPath of fontsToEmbed) {
    if (fs.existsSync(fontPath)) {
        args.push('--epub-embed-font', fontPath);
    }
}
```

**Root Cause**:
- macOS 시스템 폰트 경로만 하드코딩
- Windows 폰트 경로 미지원: `C:\Windows\Fonts\`
- Linux 폰트 경로 미지원: `/usr/share/fonts/`

**영향**:
- Windows/Linux에서 한글 폰트 임베딩 실패
- EPUB에서 한글이 깨지거나 표시되지 않음
- 폰트 fallback으로 인한 레이아웃 깨짐

#### **수정 내용**
```typescript
// 수정 후 (FIXED)
private getPlatformFontPaths(): string[] {
    const platform = process.platform;

    if (platform === 'win32') {
        // Windows font paths
        const windir = process.env.WINDIR || 'C:\\Windows';
        return [
            path.join(windir, 'Fonts', 'malgun.ttf'),      // Malgun Gothic
            path.join(windir, 'Fonts', 'malgunbd.ttf'),    // Malgun Gothic Bold
            path.join(windir, 'Fonts', 'batang.ttc'),      // Batang
            path.join(windir, 'Fonts', 'gulim.ttc'),       // Gulim
        ];
    } else if (platform === 'darwin') {
        // macOS font paths
        return [
            '/System/Library/Fonts/Supplemental/NotoSansKR-Regular.otf',
            '/System/Library/Fonts/Supplemental/NotoSansKR-Bold.otf',
            '/System/Library/Fonts/Supplemental/NotoSerifKR-Regular.otf',
            '/System/Library/Fonts/Supplemental/NotoSerifKR-Bold.otf'
        ];
    } else {
        // Linux font paths
        return [
            '/usr/share/fonts/truetype/noto/NotoSansCJK-Regular.ttc',
            '/usr/share/fonts/truetype/noto/NotoSansCJK-Bold.ttc',
            '/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc',
            '/usr/share/fonts/opentype/noto/NotoSerifCJK-Regular.ttc',
        ];
    }
}
```

**해결 방법**:
- 플랫폼별 폰트 경로 자동 감지
- Windows: Malgun Gothic, Batang, Gulim 사용
- macOS: Noto Sans/Serif KR 사용
- Linux: Noto CJK 폰트 사용

---

### **🟡 Medium Issue #4: PDF 엔진 경로 감지 - Unix 중심**

#### **문제점**
**위치**: `src/services/PandocService.ts:439-454`

```typescript
// 수정 전 (INCOMPLETE)
private findPdfEnginePath(engine: string): string {
    if (engine === 'weasyprint') {
        const locations = [
            `${process.env.HOME}/.local/bin/weasyprint`,
            '/usr/local/bin/weasyprint',
            '/opt/homebrew/bin/weasyprint',
            '/usr/bin/weasyprint',
        ];
        for (const loc of locations) {
            if (fs.existsSync(loc)) {
                return loc;
            }
        }
    }
    return engine;
}
```

**Root Cause**:
- Unix/macOS 경로만 검색
- Windows 경로 완전 누락
- `process.env.HOME`은 Windows에서 `undefined` (Windows는 `USERPROFILE` 사용)

**영향**:
- Windows에서 WeasyPrint 자동 감지 실패
- 수동으로 경로 지정 필요
- PDF 생성 불가

#### **수정 내용**
```typescript
// 수정 후 (FIXED)
private findPdfEnginePath(engine: string): string {
    if (engine === 'weasyprint') {
        const platform = process.platform;
        let locations: string[] = [];

        if (platform === 'win32') {
            // Windows paths for WeasyPrint
            const userProfile = process.env.USERPROFILE || 'C:\\Users\\Default';
            const pythonVersions = ['Python312', 'Python311', 'Python310', 'Python39', 'Python38'];
            
            locations = [
                path.join(userProfile, 'AppData', 'Local', 'Programs', 'Python', 'Python312', 'Scripts', 'weasyprint.exe'),
                path.join(userProfile, 'AppData', 'Roaming', 'Python', 'Python312', 'Scripts', 'weasyprint.exe'),
                'C:\\Python312\\Scripts\\weasyprint.exe',
                'C:\\Python311\\Scripts\\weasyprint.exe',
                'C:\\Python310\\Scripts\\weasyprint.exe',
                'weasyprint',
            ];

            // Add dynamic Python version paths
            for (const pyVer of pythonVersions) {
                locations.push(path.join(userProfile, 'AppData', 'Local', 'Programs', 'Python', pyVer, 'Scripts', 'weasyprint.exe'));
                locations.push(`C:\\${pyVer}\\Scripts\\weasyprint.exe`);
            }
        } else {
            // Unix/macOS paths
            const home = process.env.HOME || '';
            locations = [
                `${home}/.local/bin/weasyprint`,
                '/usr/local/bin/weasyprint',
                '/opt/homebrew/bin/weasyprint',
                '/usr/bin/weasyprint',
                'weasyprint',
            ];
        }

        for (const loc of locations) {
            if (fs.existsSync(loc)) {
                return loc;
            }
        }
    }
    return engine;
}
```

**해결 방법**:
- Windows Python 설치 경로 다중 검색
- Python 3.8 ~ 3.12 버전 모두 지원
- 사용자별 설치 및 시스템 전역 설치 모두 감지

---

## 📊 수정 요약

| 문제 | 심각도 | 파일 | 상태 |
|------|--------|------|------|
| Temp 디렉토리 Unix 경로 하드코딩 | 🔴 Critical | `utils/fileUtils.ts` | ✅ 수정 완료 |
| common.ts 비동기 로직 오류 | 🔴 Critical | `utils/common.ts` | ✅ 수정 완료 |
| macOS 폰트 경로 하드코딩 | 🔴 Critical | `services/PandocService.ts` | ✅ 수정 완료 |
| PDF 엔진 경로 Unix 중심 | 🟡 Medium | `services/PandocService.ts` | ✅ 수정 완료 |
| 경로 입력 인식 실패 | 🔴 Critical | `utils/pathValidator.ts` | ✅ 수정 완료 (이전) |

---

## 🧪 테스트 시나리오

### Windows 환경 테스트

#### 0. **PowerShell 실행 정책 테스트 (필수 선행 테스트)**

**테스트 목적**: Windows에서 가장 흔한 오류인 PowerShell 실행 정책 문제 확인

```powershell
# PowerShell에서 npx 실행 시도
npx markdown-to-document-cli@latest --version
```

**예상 오류**:
```powershell
npx : File C:\Program Files\nodejs\npx.ps1 cannot be loaded because running scripts is disabled on this system.
```

**해결 방법 테스트**:

**방법 1: CMD 사용 (권장)**
```cmd
# CMD(명령 프롬프트) 실행
cmd

# npx 실행
npx markdown-to-document-cli@latest --version
```

**예상 결과**:
- ✅ 오류 없이 버전 정보 출력
- ✅ 모든 기능 정상 작동

**방법 2: 실행 정책 변경**
```powershell
# PowerShell 관리자 권한으로 실행
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# 일반 PowerShell에서 재시도
npx markdown-to-document-cli@latest --version
```

**예상 결과**:
- ✅ 실행 정책 변경 성공
- ✅ npx 정상 실행

**방법 3: 일회성 우회**
```powershell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
npx markdown-to-document-cli@latest --version
```

**예상 결과**:
- ✅ 현재 세션에서만 실행 가능

---

#### 1. **기본 변환 테스트**
```cmd
# CMD (권장) 또는 PowerShell (실행 정책 변경 후)
m2d C:\Users\username\Documents\test.md
```

**예상 결과**:
- ✅ 경로 인식 성공
- ✅ 임시 파일 생성: `C:\Users\username\AppData\Local\Temp\markdown-to-document\`
- ✅ 한글 폰트 임베딩 (Malgun Gothic)
- ✅ EPUB/PDF 생성 성공

#### 2. **Interactive 모드 테스트**
```powershell
m2d interactive
# 파일 드래그앤드롭 또는 경로 입력
```

**예상 결과**:
- ✅ Windows 경로 예시 표시: `C:\Users\username\document.md`
- ✅ 드래그앤드롭 경로 인식
- ✅ 따옴표 처리 정상

#### 3. **PDF 엔진 자동 감지 테스트**
```powershell
# WeasyPrint 설치 후
pip install weasyprint
m2d test.md --format pdf
```

**예상 결과**:
- ✅ WeasyPrint 자동 감지
- ✅ PDF 생성 성공

#### 4. **공백 포함 경로 테스트**
```powershell
m2d "C:\Users\John Doe\My Documents\test.md"
```

**예상 결과**:
- ✅ 공백 포함 경로 정상 처리
- ✅ 변환 성공

---

## 🔧 수정된 파일 목록

### 1. **`src/utils/fileUtils.ts`**
- `getTempDir()`: `os.tmpdir()` 사용으로 변경
- 크로스 플랫폼 호환성 확보

### 2. **`src/utils/common.ts`**
- 잘못된 `getTempDir()` 구현 제거
- 중복 코드 제거

### 3. **`src/services/PandocService.ts`**
- `getPlatformFontPaths()`: 플랫폼별 폰트 경로 메서드 추가
- `findPdfEnginePath()`: Windows 경로 검색 로직 추가
- Import 수정: `getTempDir`을 `fileUtils.js`에서 가져오도록 변경

### 4. **`src/utils/pathValidator.ts`** (이전 수정)
- `isWindowsPath()`: Windows 경로 감지 메서드 추가
- `normalizePath()`: 플랫폼별 경로 처리 로직 추가
- 플랫폼별 오류 메시지 개선

---

## 🎯 Windows 사용자를 위한 가이드

### 설치 및 설정

#### 1. **필수 요구사항**
```powershell
# Node.js 설치 확인
node --version  # v18 이상

# Pandoc 설치
choco install pandoc

# 설치 확인
pandoc --version
```

#### 2. **PDF 생성을 위한 추가 설치**
```powershell
# Python 설치
choco install python

# WeasyPrint 설치 (권장)
pip install weasyprint

# 또는 LaTeX 설치 (고급)
# https://www.tug.org/texlive/ 에서 다운로드
```

#### 3. **한글 폰트 확인**
Windows에는 기본적으로 한글 폰트가 설치되어 있습니다:
- Malgun Gothic (맑은 고딕)
- Batang (바탕)
- Gulim (굴림)

추가 폰트가 필요한 경우:
- Noto Sans KR: https://fonts.google.com/noto/specimen/Noto+Sans+KR

### 사용 방법

#### **방법 1: 드래그앤드롭**
1. PowerShell 또는 CMD 열기
2. `m2d interactive` 입력
3. 마크다운 파일을 터미널 창으로 드래그

#### **방법 2: 경로 복사**
1. 파일 탐색기에서 파일 선택
2. Shift + 우클릭 → "경로 복사"
3. 터미널에 붙여넣기

#### **방법 3: 직접 입력**
```powershell
m2d C:\Users\YourName\Documents\file.md
```

---

## 🐛 알려진 제한사항

### Windows 특정 이슈

1. **긴 경로 (260자 제한)**
   - Windows의 MAX_PATH 제한
   - 해결: 짧은 경로 사용 또는 긴 경로 지원 활성화

2. **특수 문자 파일명**
   - Windows에서 금지된 문자: `< > : " / \ | ? *`
   - 자동으로 `_`로 치환됨

3. **관리자 권한**
   - 일반적으로 불필요
   - 시스템 디렉토리 접근 시에만 필요

---

## 📈 성능 영향

모든 수정사항은 성능에 부정적 영향 없음:
- 플랫폼 감지: 한 번만 실행 (O(1))
- 경로 검색: 최대 10-15개 경로 검색 (O(n), n ≤ 15)
- 폰트 감지: 파일 존재 확인만 수행

---

## 🔄 마이그레이션 가이드

기존 사용자는 추가 작업 불필요:
- ✅ 기존 설정 파일 호환
- ✅ 기존 명령어 동일하게 작동
- ✅ 자동으로 새 로직 적용

---

## 🧪 검증 체크리스트

### 개발자용 테스트

#### 실행 환경 테스트
- [ ] **PowerShell 실행 정책 오류 재현 및 해결 확인**
  - [ ] 기본 PowerShell에서 오류 발생 확인
  - [ ] CMD에서 정상 작동 확인
  - [ ] 실행 정책 변경 후 PowerShell 정상 작동 확인
- [ ] Windows 10/11에서 기본 변환 테스트
- [ ] PowerShell에서 드래그앤드롭 테스트
- [ ] CMD에서 경로 입력 테스트
- [ ] Git Bash에서 경로 테스트

#### 경로 및 파일명 테스트
- [ ] 공백 포함 경로 테스트
- [ ] 한글 파일명 테스트
- [ ] 특수문자 포함 경로 테스트

#### 기능 테스트
- [ ] WeasyPrint 자동 감지 테스트
- [ ] 한글 폰트 임베딩 확인
- [ ] EPUB 한글 표시 확인
- [ ] PDF 한글 표시 확인

---

## 📝 버전 정보

- **수정 버전**: v1.5.1
- **수정 날짜**: 2026-01-08
- **영향 범위**: Windows, macOS, Linux (모든 플랫폼)
- **하위 호환성**: ✅ 완전 호환

---

## 🙏 기여자

이 수정사항은 Windows 사용자 피드백을 바탕으로 작성되었습니다.

---

## 📞 문제 보고

Windows 환경에서 여전히 문제가 발생하는 경우:
1. GitHub Issues에 보고
2. 다음 정보 포함:
   - Windows 버전
   - PowerShell/CMD 버전
   - 오류 메시지 전문
   - `m2d check` 실행 결과
