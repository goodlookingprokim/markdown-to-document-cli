# Windows UNC Network Path Support Fix

## Problem Description

When testing on Windows with network-mounted Mac shares, copying file paths from Windows Explorer results in UNC (Universal Naming Convention) paths like:

```
\\Mac\Home\README.md
```

The CLI was failing to recognize these as valid Windows paths, causing validation errors.

## Root Cause Analysis

### Top-Down (Application Layer)
1. User copies path from Windows Explorer → Gets UNC path `\\Mac\Home\README.md`
2. CLI receives this path → Path validator doesn't recognize it as valid
3. `PathValidator.isWindowsPath()` only checked for drive letters (`C:\`, `D:\`)
4. UNC paths failed validation because they didn't match the regex pattern

### Bottom-Up (System Layer)
1. Windows network shares use `\\ServerName\ShareName\path` format
2. This is fundamentally different from local Windows paths (`C:\path`)
3. Node.js `path.normalize()` and `path.isAbsolute()` handle UNC paths differently
4. The original code didn't account for network paths at all

## Solution Implemented

### 1. Enhanced UNC Path Detection

**File**: `src/utils/pathValidator.ts`

Updated `isWindowsPath()` method to detect both drive letter and UNC paths:

```typescript
private static isWindowsPath(inputPath: string): boolean {
    // Check for Windows drive letter patterns: C:\, D:\, etc.
    const hasDriveLetter = /^[a-zA-Z]:[\\]/.test(inputPath);
    // Check for UNC paths: \\server\share or //server/share
    const isUNCPath = /^[\\]{2}[^\\]+[\\][^\\]+/.test(inputPath) || /^\/\/[^\/]+\/[^\/]+/.test(inputPath);
    return hasDriveLetter || isUNCPath;
}
```

**Detects**:
- `\\Mac\Home\file.md` (backslash UNC)
- `//Mac/Home/file.md` (forward slash UNC)
- `C:\Users\file.md` (drive letter)

### 2. UNC Path Normalization

Updated `normalizePath()` to handle UNC paths correctly:

```typescript
if (isWindowsPath) {
    // Windows path (drive letter or UNC): Keep backslashes as path separators
    // Only handle escaped spaces in Windows paths
    cleaned = cleaned.replace(/\ /g, ' ');

    // Convert forward slashes to backslashes for UNC paths like //Mac/Home/file.md
    if (/^\/\/[^\/]+\/[^\/]+/.test(cleaned)) {
        cleaned = cleaned.replace(/\//g, '\\');
    }

    // Normalize Windows path separators (handles mixed slashes)
    cleaned = path.normalize(cleaned);
}
```

**Handles**:
- Converts `//Mac/Home` → `\\Mac\Home`
- Preserves backslashes in Windows paths
- Removes escaped spaces

### 3. Absolute Path Recognition

Fixed `path.isAbsolute()` check to recognize UNC paths:

```typescript
// Resolve to absolute path if relative
// Note: UNC paths (\\server\share) are absolute but path.isAbsolute() may not recognize them on non-Windows
const isUNCPath = /^[\\]{2}[^\\]+[\\][^\\]+/.test(cleaned);
if (!path.isAbsolute(cleaned) && !isUNCPath) {
    cleaned = path.resolve(process.cwd(), cleaned);
}
```

**Prevents**: UNC paths from being incorrectly resolved as relative paths

### 4. Updated Error Messages and Documentation

Added UNC path examples to:
- Error messages in `PathValidator.generatePathSuggestions()`
- Help text in `PathValidator.displayValidationError()`
- Interactive mode guidance in `cli.ts`
- README documentation

## Supported Path Formats

### Windows Local Paths
```
C:\Users\username\document.md
D:\Projects\README.md
```

### Windows UNC Network Paths (NEW)
```
\\Mac\Home\document.md
\\ServerName\ShareName\folder\file.md
\\192.168.1.100\Documents\test.md
//Mac/Home/document.md (auto-converted to backslashes)
```

### Unix/Mac Paths
```
/Users/username/document.md
/home/user/document.md
```

### Relative Paths
```
./docs/document.md
../project/README.md
```

## Testing

The fix has been tested with various path formats:
- ✅ UNC paths with backslashes
- ✅ UNC paths with forward slashes (auto-converted)
- ✅ UNC paths with IP addresses
- ✅ Quoted UNC paths
- ✅ UNC paths with spaces
- ✅ Regular Windows drive letter paths
- ✅ Unix/Mac absolute paths
- ✅ Relative paths

## User Impact

### Before Fix
```bash
❌ 파일을 찾을 수 없습니다: \\Mac\Home\README.md
💡 도움말:
   • 경로 형식을 확인하세요
   • Windows: C:\Users\username\file.md
```

### After Fix
```bash
✅ 파일 경로 인식 성공
📄 파일 정보:
   경로: \\Mac\Home\README.md
   크기: 18.13 KB
   수정일: 2026-01-11
```

## Files Modified

1. `src/utils/pathValidator.ts` - Core path validation logic
2. `src/cli.ts` - Interactive mode guidance
3. `README.md` - Documentation with UNC examples

## Version

This fix will be included in version 1.5.4+

## References

- [Windows UNC Path Documentation](https://docs.microsoft.com/en-us/windows/win32/fileio/naming-a-file#unc-names)
- [Node.js path.normalize() behavior](https://nodejs.org/api/path.html#pathnormalizepath)
