# WeasyPrint GTK Windows 트러블슈팅 완벽 가이드

> **핵심 해결책**: Windows에서 WeasyPrint PDF 변환 시 GTK 런타임 오류가 발생하면, **UCRT64 대신 MINGW64** 라이브러리를 사용하세요.

---

## 문제 증상

```
OSError: cannot load library 'C:\msys64\ucrt64\bin\libgobject-2.0-0.dll': error 0x7e
```

또는:

```
❌ 오류:
   • PDF 변환 실패: WeasyPrint GTK 런타임 오류!
```

---

## 근본 원인 분석

### Root Cause (Top-Down)

```
사용자가 PDF 변환 실행
    ↓
WeasyPrint가 cffi 라이브러리를 통해 GTK DLL 로드 시도
    ↓
cffi.dlopen()이 libgobject-2.0-0.dll 로드 시도
    ↓
❌ UCRT64 DLL과 cffi 호환성 문제로 error 0x7e 발생
```

### Root Cause (Bottom-Up)

```
cffi의 DLL 로딩 방식이 UCRT64 라이브러리와 호환되지 않음
    ↑
UCRT64는 Universal C Runtime 기반으로 빌드됨
    ↑
cffi는 MINGW64 (MSVCRT 기반) DLL과 더 잘 호환됨
    ↑
Python ctypes.WinDLL()은 정상 로드되지만 cffi.dlopen()은 실패
```

### 핵심 발견

| 로딩 방식 | UCRT64 DLL | MINGW64 DLL |
|-----------|------------|-------------|
| `ctypes.WinDLL()` | ✅ 성공 | ✅ 성공 |
| `cffi.dlopen()` | ❌ 실패 (0x7e) | ✅ 성공 |

**결론**: cffi와 UCRT64 간 호환성 문제. MINGW64 사용으로 해결.

---

## 해결 방법

### Step 1: MSYS2 설치 확인

```cmd
dir C:\msys64
```

MSYS2가 없다면: https://www.msys2.org/ 에서 설치

---

### Step 2: MINGW64 GTK3 설치

**시작메뉴 → "MSYS2 MINGW64" 실행** (UCRT64 아님!)

```bash
pacman -S --needed mingw-w64-x86_64-gtk3
```

---

### Step 3: PATH 환경변수 변경

#### GUI 방법

1. `Windows + R` → `sysdm.cpl` → Enter
2. **고급** 탭 → **환경 변수**
3. **시스템 변수**에서 `Path` 선택 → **편집**
4. `C:\msys64\ucrt64\bin` 찾아서 **삭제** 또는
5. `C:\msys64\mingw64\bin` **추가** (맨 위로 이동 권장)
6. **확인** 클릭

#### PowerShell 방법 (관리자 권한)

```powershell
# UCRT64 제거하고 MINGW64 추가
[Environment]::SetEnvironmentVariable("Path", "C:\msys64\mingw64\bin;" + [Environment]::GetEnvironmentVariable("Path", "Machine").Replace("C:\msys64\ucrt64\bin;", ""), "Machine")
```

---

### Step 4: 검증

**새 터미널 창**에서:

```cmd
weasyprint --version
```

**예상 출력**:
```
WeasyPrint version 67.0
```

---

## 환경별 차이점

### MSYS2 환경 비교

| 환경 | 런타임 | Python cffi 호환성 | 권장 |
|------|--------|-------------------|------|
| **UCRT64** | Universal CRT | ❌ 문제 있음 | - |
| **MINGW64** | MSVCRT | ✅ 호환됨 | ⭐ |
| **MINGW32** | MSVCRT (32bit) | 미테스트 | - |
| **CLANG64** | UCRT + Clang | 미테스트 | - |

### Python 버전별 상황

| Python | cffi 2.0 | cffi 1.17 | 권장 |
|--------|----------|-----------|------|
| 3.14.x | ❌ 문제 | ❌ 빌드 불가 | Python 3.13 사용 |
| 3.13.x | ❌ 문제 | ✅ (MINGW64) | ⭐ |
| 3.12.x | 미테스트 | ✅ (예상) | - |

---

## 진단 명령어 모음

### DLL 존재 확인
```cmd
dir C:\msys64\mingw64\bin\libgobject*.dll
dir C:\msys64\mingw64\bin\libcairo*.dll
dir C:\msys64\mingw64\bin\libpango*.dll
```

### PATH 확인
```cmd
echo %PATH% | findstr /i "mingw64"
```

### Python에서 DLL 로드 테스트
```cmd
python -c "import ctypes;ctypes.WinDLL(r'C:\msys64\mingw64\bin\libgobject-2.0-0.dll');print('SUCCESS')"
```

### WeasyPrint 버전 확인
```cmd
weasyprint --version
```

---

## 트러블슈팅

### 문제: "MSYS2 MINGW64" 터미널을 찾을 수 없음

**해결**: 시작메뉴에서 "MSYS2"로 검색하면 여러 터미널 옵션이 나옵니다.
- `MSYS2 MINGW64` ← 이것을 선택
- `MSYS2 UCRT64` ← 사용하지 마세요
- `MSYS2 MSYS` ← 패키지 설치용 아님

### 문제: PATH 변경 후에도 오류 발생

**해결**:
1. 모든 터미널 창 닫기
2. 컴퓨터 재시작
3. 새 터미널에서 테스트

### 문제: Python 3.14에서 cffi 1.17 빌드 실패

**해결**: Python 3.13 설치 후 사용

```cmd
choco install python313 -y
C:\Python313\python.exe -m pip install weasyprint
C:\Python313\python.exe -m pip install cffi==1.17.1
```

### 문제: "libgobject-2.0-0.dll을 찾을 수 없습니다"

**해결**: GTK3 패키지 설치

```bash
# MSYS2 MINGW64 터미널에서
pacman -S --needed mingw-w64-x86_64-gtk3
```

---

## 최적 환경 구성 요약

```
✅ Python: 3.13.x (3.14는 cffi 호환성 문제)
✅ cffi: 1.17.1 (2.0.0은 DLL 로딩 문제)
✅ MSYS2 환경: MINGW64 (UCRT64 대신)
✅ PATH: C:\msys64\mingw64\bin (ucrt64 제거)
✅ WeasyPrint: 최신 버전 (67.0+)
```

---

## 관련 파일

- `src/services/PandocService.ts`: PDF 엔진 로직
- `src/utils/dependencyChecker.ts`: 의존성 체크 및 가이드

---

## 참고 링크

- [WeasyPrint 공식 설치 가이드](https://doc.courtbouillon.org/weasyprint/stable/first_steps.html#windows)
- [MSYS2 공식 사이트](https://www.msys2.org/)
- [cffi GitHub Issues](https://github.com/python-cffi/cffi/issues)

---

**작성일**: 2026-01-12
**테스트 환경**: Windows 11, Python 3.13.11, WeasyPrint 67.0, MSYS2 MINGW64
