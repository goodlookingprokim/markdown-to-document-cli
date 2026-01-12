/**
 * Dependency Checker - Proactive installation guidance
 * 
 * Checks for required dependencies and provides user-friendly installation instructions
 */

import { execFile } from 'child_process';
import { promisify } from 'util';
import chalk from 'chalk';

const execFileAsync = promisify(execFile);

// Platform detection
const isWindows = process.platform === 'win32';

export interface DependencyStatus {
    name: string;
    required: boolean;
    installed: boolean;
    version?: string;
    installInstructions: InstallInstructions;
}

export interface InstallInstructions {
    description: string;
    macOS: string[];
    linux: string[];
    windows: string[];
    windowsDetailed?: WindowsDetailedInstructions;
    notes?: string;
}

export interface WindowsDetailedInstructions {
    steps: WindowsInstallStep[];
    copyableCommands?: string[];
    troubleshooting?: string[];
}

export interface WindowsInstallStep {
    title: string;
    description: string;
    command?: string;
    url?: string;
}

export class DependencyChecker {
    /**
     * Check if a command is available
     */
    private async isCommandAvailable(command: string, args: string[] = ['--version']): Promise<{ available: boolean; version?: string }> {
        try {
            const { stdout } = await execFileAsync(command, args, { timeout: 5000 });
            const versionMatch = stdout.match(/(\d+\.\d+(?:\.\d+)?)/);
            return {
                available: true,
                version: versionMatch ? versionMatch[1] : 'installed'
            };
        } catch {
            return { available: false };
        }
    }

    /**
     * Check if a Python package is installed (cross-platform)
     */
    private async isPythonPackageInstalled(packageName: string): Promise<{ available: boolean; version?: string }> {
        // Try multiple methods to detect Python packages
        const pythonCommands = isWindows ? ['python', 'python3', 'py'] : ['python3', 'python'];

        for (const pythonCmd of pythonCommands) {
            try {
                // Method 1: Try pip show (most reliable)
                const { stdout } = await execFileAsync(pythonCmd, ['-m', 'pip', 'show', packageName], { timeout: 10000 });
                const versionMatch = stdout.match(/Version:\s*(\d+\.\d+(?:\.\d+)?)/);
                if (versionMatch) {
                    return { available: true, version: versionMatch[1] };
                }
                return { available: true, version: 'installed' };
            } catch {
                // Continue to next python command
            }
        }

        // Method 2: Try direct command (works if Scripts folder is in PATH)
        try {
            const cmd = isWindows ? `${packageName}.exe` : packageName;
            const { stdout } = await execFileAsync(cmd, ['--version'], { timeout: 5000 });
            const versionMatch = stdout.match(/(\d+\.\d+(?:\.\d+)?)/);
            return { available: true, version: versionMatch ? versionMatch[1] : 'installed' };
        } catch {
            // Not available via direct command
        }

        return { available: false };
    }

    /**
     * Check Node.js
     */
    private async checkNode(): Promise<DependencyStatus> {
        const result = await this.isCommandAvailable('node');
        return {
            name: 'Node.js',
            required: true,
            installed: result.available,
            version: result.version,
            installInstructions: {
                description: 'JavaScript 런타임 - CLI가 실행되는 기반',
                macOS: ['brew install node', '또는 https://nodejs.org 에서 다운로드'],
                linux: ['sudo apt-get install nodejs npm', '또는 https://nodejs.org 에서 다운로드'],
                windows: ['https://nodejs.org 에서 LTS 버전 다운로드 후 설치'],
                windowsDetailed: {
                    steps: [
                        {
                            title: '1. Node.js 다운로드',
                            description: '아래 링크를 클릭하여 Node.js 공식 사이트에서 LTS 버전을 다운로드하세요.',
                            url: 'https://nodejs.org/'
                        },
                        {
                            title: '2. 설치 프로그램 실행',
                            description: '다운로드된 .msi 파일을 더블클릭하여 실행합니다.'
                        },
                        {
                            title: '3. 설치 진행',
                            description: '"I accept the terms..." 체크 → Next → Next → ⚠️ "Automatically install the necessary tools" 체크 → Next → Install'
                        },
                        {
                            title: '4. 컴퓨터 재시작',
                            description: '설치 완료 후 컴퓨터를 재시작하세요.'
                        },
                        {
                            title: '5. 설치 확인',
                            description: '새 CMD 또는 PowerShell 창을 열고 아래 명령어로 확인:',
                            command: 'node --version'
                        }
                    ],
                    copyableCommands: ['node --version'],
                    troubleshooting: [
                        "'node'은(는) 내부 또는 외부 명령... 오류 시 → 컴퓨터 재시작 후 다시 시도",
                        '여전히 안 되면 Node.js를 삭제 후 재설치'
                    ]
                },
                notes: 'Node.js 18 이상 권장'
            }
        };
    }

    /**
     * Check Pandoc
     */
    private async checkPandoc(): Promise<DependencyStatus> {
        const result = await this.isCommandAvailable('pandoc');
        return {
            name: 'Pandoc',
            required: true,
            installed: result.available,
            version: result.version,
            installInstructions: {
                description: '문서 변환 엔진 - EPUB/PDF 생성의 핵심',
                macOS: ['brew install pandoc'],
                linux: ['sudo apt-get install pandoc'],
                windows: ['https://pandoc.org/installing.html 에서 Windows 설치 파일 다운로드'],
                windowsDetailed: {
                    steps: [
                        {
                            title: '1. Pandoc 다운로드',
                            description: '아래 링크에서 Windows용 설치 파일(.msi)을 다운로드하세요.',
                            url: 'https://github.com/jgm/pandoc/releases/latest'
                        },
                        {
                            title: '2. 설치 프로그램 실행',
                            description: 'pandoc-x.x.x-windows-x86_64.msi 파일을 더블클릭하여 실행합니다.'
                        },
                        {
                            title: '3. 설치 완료',
                            description: 'Next → "I accept..." 체크 → Next → Install → Finish'
                        },
                        {
                            title: '4. 새 터미널 열기',
                            description: '⚠️ 중요: 기존 CMD/PowerShell 창을 닫고 새 창을 열어야 합니다!'
                        },
                        {
                            title: '5. 설치 확인',
                            description: '새 CMD 또는 PowerShell 창에서 아래 명령어로 확인:',
                            command: 'pandoc --version'
                        }
                    ],
                    copyableCommands: ['pandoc --version'],
                    troubleshooting: [
                        "'pandoc'은(는) 내부 또는 외부 명령... 오류 시 → 새 터미널 창을 열고 다시 시도",
                        '컴퓨터 재시작 후에도 안 되면 Pandoc 재설치'
                    ]
                },
                notes: 'Pandoc 2.19 이상 필요'
            }
        };
    }

    /**
     * Check PDF engines (at least one should be available)
     */
    private async checkPdfEngines(): Promise<DependencyStatus[]> {
        const results: DependencyStatus[] = [];

        // Check WeasyPrint using Python package detection (cross-platform)
        const weasyPrintResult = await this.isPythonPackageInstalled('weasyprint');
        results.push({
            name: 'WeasyPrint',
            required: false,
            installed: weasyPrintResult.available,
            version: weasyPrintResult.version,
            installInstructions: {
                description: 'PDF 생성 엔진 (추천) - 가장 쉽고 한글 지원 우수',
                macOS: ['pip3 install weasyprint', '또는 pip install weasyprint'],
                linux: ['pip3 install weasyprint', '또는 pip install weasyprint'],
                windows: [
                    '⚠️ Windows에서는 GTK 런타임 설치가 필수입니다!',
                    '아래 단계별 가이드를 따라주세요.'
                ],
                windowsDetailed: {
                    steps: [
                        {
                            title: '📌 사전 요구사항',
                            description: 'Python이 먼저 설치되어 있어야 합니다. python --version 으로 확인하세요.'
                        },
                        {
                            title: '1단계: MSYS2 설치',
                            description: 'GTK 런타임을 설치하기 위해 MSYS2가 필요합니다. 아래 링크에서 다운로드하세요.',
                            url: 'https://www.msys2.org/'
                        },
                        {
                            title: '2단계: MSYS2 설치 프로그램 실행',
                            description: 'msys2-x86_64-xxxxxxxx.exe 파일을 더블클릭 → Next → 설치 경로는 기본값(C:\\msys64) 유지 → Next → Install'
                        },
                        {
                            title: '3단계: GTK 설치',
                            description: '⚠️ 중요: 설치 완료 후 열리는 MSYS2 터미널(검은 창)에서 아래 명령어를 복사해서 붙여넣고 Enter:',
                            command: 'pacman -S mingw-w64-ucrt-x86_64-gtk3'
                        },
                        {
                            title: '4단계: 설치 확인',
                            description: '"Proceed with installation? [Y/n]" 메시지가 나오면 Y 입력 후 Enter. 설치 완료되면 MSYS2 창을 닫습니다.'
                        },
                        {
                            title: '5단계: 환경 변수 설정 (PATH 추가)',
                            description: '시스템 환경 변수에 GTK 경로를 추가해야 합니다:\n1. Windows 검색에서 "환경 변수" 검색 → "시스템 환경 변수 편집" 클릭\n2. "환경 변수..." 버튼 클릭\n3. "시스템 변수"에서 "Path" 선택 → "편집" 클릭\n4. "새로 만들기" 클릭 → 아래 경로 입력:'
                        },
                        {
                            title: '📋 복사할 PATH 경로',
                            description: '아래 경로를 복사하여 새 항목으로 추가하세요:',
                            command: 'C:\\msys64\\ucrt64\\bin'
                        },
                        {
                            title: '6단계: WeasyPrint 설치',
                            description: '새 CMD 창(⚠️ 기존 창 말고 새 창!)을 열고 아래 명령어 실행:',
                            command: 'pip install weasyprint'
                        },
                        {
                            title: '7단계: 설치 확인',
                            description: '설치가 완료되면 아래 명령어로 확인:',
                            command: 'weasyprint --version'
                        }
                    ],
                    copyableCommands: [
                        'pacman -S mingw-w64-ucrt-x86_64-gtk3',
                        'C:\\msys64\\ucrt64\\bin',
                        'pip install weasyprint',
                        'weasyprint --version'
                    ],
                    troubleshooting: [
                        "'weasyprint'은(는) 내부 또는 외부 명령... 오류 → PATH에 C:\\msys64\\ucrt64\\bin 추가 확인 후 새 CMD 창 열기",
                        "'OSError: cannot load library' 오류 → GTK가 제대로 설치되지 않음. MSYS2에서 pacman 명령어 다시 실행",
                        "'pip'를 찾을 수 없음 → Python 설치 시 PATH 추가 옵션을 체크하지 않음. Python 재설치 필요",
                        "MSYS2 터미널이 열리지 않음 → 시작 메뉴에서 'MSYS2 UCRT64' 검색하여 실행"
                    ]
                },
                notes: 'Python + GTK 런타임이 필요합니다 (Windows에서 설치가 다소 복잡함)'
            }
        });

        // Check LaTeX engines using direct command detection
        const latexEngines = [
            {
                name: 'XeLaTeX',
                command: 'xelatex',
                description: 'PDF 생성 엔진 (한글 최적화) - 전문 출판 품질',
                macOS: ['brew install --cask basictex', 'eval "$(/usr/libexec/path_helper)"'],
                linux: ['sudo apt-get install texlive-xetex texlive-fonts-recommended'],
                windows: ['https://www.tug.org/texlive/ 에서 설치'],
                notes: '설치 후 터미널 재시작 필요'
            },
            {
                name: 'PDFLaTeX',
                command: 'pdflatex',
                description: 'PDF 생성 엔진 (기본) - 표준 LaTeX',
                macOS: ['brew install --cask basictex'],
                linux: ['sudo apt-get install texlive-latex-base'],
                windows: ['https://www.tug.org/texlive/ 에서 설치'],
                notes: '설치 후 터미널 재시작 필요'
            }
        ];

        for (const engine of latexEngines) {
            const result = await this.isCommandAvailable(engine.command);
            results.push({
                name: engine.name,
                required: false,
                installed: result.available,
                version: result.version,
                installInstructions: {
                    description: engine.description,
                    macOS: engine.macOS,
                    linux: engine.linux,
                    windows: engine.windows,
                    notes: engine.notes
                }
            });
        }

        return results;
    }

    /**
     * Check Python (optional, for WeasyPrint)
     */
    private async checkPython(): Promise<DependencyStatus> {
        const result = await this.isCommandAvailable('python3', ['--version']);
        const result2 = !result.available ? await this.isCommandAvailable('python', ['--version']) : result;

        return {
            name: 'Python',
            required: false,
            installed: result.available || result2.available,
            version: result.version || result2.version,
            installInstructions: {
                description: 'WeasyPrint 설치에 필요 (선택사항)',
                macOS: ['brew install python3'],
                linux: ['sudo apt-get install python3 python3-pip'],
                windows: ['https://python.org 에서 다운로드'],
                windowsDetailed: {
                    steps: [
                        {
                            title: '1. Python 다운로드',
                            description: '아래 링크에서 Python을 다운로드하세요.',
                            url: 'https://www.python.org/downloads/'
                        },
                        {
                            title: '2. 설치 프로그램 실행',
                            description: 'python-3.x.x-amd64.exe 파일을 더블클릭하여 실행합니다.'
                        },
                        {
                            title: '⚠️ 3. 매우 중요! PATH 옵션 체크',
                            description: '설치 화면 하단의 "Add python.exe to PATH" 옵션을 반드시 체크하세요!\n이 옵션을 체크하지 않으면 나중에 python 명령어가 작동하지 않습니다.'
                        },
                        {
                            title: '4. Install Now 클릭',
                            description: '"Install Now" 버튼을 클릭하여 설치를 진행합니다.'
                        },
                        {
                            title: '5. 설치 완료',
                            description: '"Disable path length limit" 버튼이 보이면 클릭하세요. 그 후 Close 클릭.'
                        },
                        {
                            title: '6. 컴퓨터 재시작 (권장)',
                            description: '환경 변수가 적용되도록 컴퓨터를 재시작하세요.'
                        },
                        {
                            title: '7. 설치 확인',
                            description: '새 CMD 창을 열고 아래 명령어로 확인:',
                            command: 'python --version'
                        },
                        {
                            title: '8. pip 확인',
                            description: 'pip도 함께 확인:',
                            command: 'pip --version'
                        }
                    ],
                    copyableCommands: [
                        'python --version',
                        'pip --version'
                    ],
                    troubleshooting: [
                        "'python'은(는) 내부 또는 외부 명령... 오류 → 'Add python.exe to PATH' 체크를 안 함. Python 삭제 후 재설치 필요",
                        "삭제 방법: 설정 → 앱 → Python 찾아서 제거",
                        "'pip'를 찾을 수 없음 → Python 재설치 시 PATH 옵션 체크 필수"
                    ]
                },
                notes: 'WeasyPrint를 사용하려면 필요합니다'
            }
        };
    }

    /**
     * Check all dependencies
     */
    async checkAll(): Promise<{
        allRequired: boolean;
        hasPdfEngine: boolean;
        dependencies: DependencyStatus[];
        pdfEngines: DependencyStatus[];
    }> {
        const node = await this.checkNode();
        const pandoc = await this.checkPandoc();
        const python = await this.checkPython();
        const pdfEngines = await this.checkPdfEngines();

        const dependencies = [node, pandoc, python];
        const allRequired = node.installed && pandoc.installed;
        const hasPdfEngine = pdfEngines.some(engine => engine.installed);

        return {
            allRequired,
            hasPdfEngine,
            dependencies,
            pdfEngines
        };
    }

    /**
     * Display installation instructions for a dependency
     */
    displayInstallInstructions(dep: DependencyStatus): void {
        const platform = process.platform;
        const instructions = dep.installInstructions;

        console.log(chalk.yellow(`\n📦 ${dep.name} 설치 방법:`));
        console.log(chalk.gray(`   ${instructions.description}\n`));

        if (platform === 'darwin') {
            console.log(chalk.cyan('   macOS:'));
            instructions.macOS.forEach(cmd => {
                console.log(chalk.white(`   $ ${cmd}`));
            });
        } else if (platform === 'win32') {
            // Windows: Show detailed step-by-step guide if available
            if (instructions.windowsDetailed) {
                this.displayWindowsDetailedInstructions(dep.name, instructions.windowsDetailed);
            } else {
                console.log(chalk.cyan('   Windows:'));
                instructions.windows.forEach(cmd => {
                    if (cmd) {
                        console.log(chalk.white(`   > ${cmd}`));
                    }
                });
            }
        } else {
            console.log(chalk.cyan('   Linux:'));
            instructions.linux.forEach(cmd => {
                console.log(chalk.white(`   $ ${cmd}`));
            });
        }

        if (instructions.notes) {
            console.log(chalk.gray(`\n   💡 ${instructions.notes}`));
        }
    }

    /**
     * Display detailed Windows installation instructions
     */
    private displayWindowsDetailedInstructions(name: string, detailed: WindowsDetailedInstructions): void {
        console.log(chalk.cyan.bold(`\n   ═══════════════════════════════════════════════════════`));
        console.log(chalk.cyan.bold(`   📋 ${name} Windows 설치 가이드 (초보자용)`));
        console.log(chalk.cyan.bold(`   ═══════════════════════════════════════════════════════\n`));

        // Display each step
        detailed.steps.forEach((step) => {
            console.log(chalk.yellow(`   ${step.title}`));

            // Multi-line descriptions
            const lines = step.description.split('\n');
            lines.forEach(line => {
                console.log(chalk.white(`      ${line}`));
            });

            // Show URL if provided
            if (step.url) {
                console.log(chalk.blue(`      🔗 ${step.url}`));
            }

            // Show command if provided (highlighted for copy-paste)
            if (step.command) {
                console.log(chalk.gray(`      ┌${'─'.repeat(50)}┐`));
                console.log(chalk.green.bold(`      │  ${step.command}`));
                console.log(chalk.gray(`      └${'─'.repeat(50)}┘`));
                console.log(chalk.gray(`      ↑ 위 명령어를 복사하여 붙여넣기 (마우스 우클릭)`));
            }

            console.log('');
        });

        // Show all copyable commands summary
        if (detailed.copyableCommands && detailed.copyableCommands.length > 0) {
            console.log(chalk.cyan(`   ───────────────────────────────────────────────────────`));
            console.log(chalk.cyan.bold(`   📋 복사용 명령어 요약 (마우스 우클릭으로 붙여넣기):`));
            console.log(chalk.cyan(`   ───────────────────────────────────────────────────────`));
            detailed.copyableCommands.forEach((cmd, idx) => {
                console.log(chalk.green(`   ${idx + 1}. ${cmd}`));
            });
            console.log('');
        }

        // Show troubleshooting tips
        if (detailed.troubleshooting && detailed.troubleshooting.length > 0) {
            console.log(chalk.cyan(`   ───────────────────────────────────────────────────────`));
            console.log(chalk.yellow.bold(`   ⚠️  문제 해결 (오류가 발생했을 때):`));
            console.log(chalk.cyan(`   ───────────────────────────────────────────────────────`));
            detailed.troubleshooting.forEach((tip) => {
                console.log(chalk.gray(`   • ${tip}`));
            });
            console.log('');
        }
    }

    /**
     * Display comprehensive dependency report
     */
    async displayDependencyReport(format?: 'epub' | 'pdf' | 'both'): Promise<boolean> {
        console.log(chalk.cyan.bold('\n🔍 의존성 확인 중...\n'));

        const { allRequired, hasPdfEngine, dependencies, pdfEngines } = await this.checkAll();

        // Show required dependencies
        console.log(chalk.bold('필수 의존성:'));
        dependencies.filter(d => d.required).forEach(dep => {
            if (dep.installed) {
                console.log(chalk.green(`  ✅ ${dep.name} ${dep.version ? `(v${dep.version})` : ''}`));
            } else {
                console.log(chalk.red(`  ❌ ${dep.name} - 설치 필요`));
            }
        });

        // Show PDF engines
        console.log(chalk.bold('\nPDF 생성 엔진 (최소 1개 필요):'));
        pdfEngines.forEach(engine => {
            if (engine.installed) {
                console.log(chalk.green(`  ✅ ${engine.name} ${engine.version ? `(v${engine.version})` : ''}`));
            } else {
                console.log(chalk.gray(`  ⚪ ${engine.name} - 미설치`));
            }
        });

        // Show optional dependencies
        const optional = dependencies.filter(d => !d.required);
        if (optional.length > 0) {
            console.log(chalk.bold('\n선택 의존성:'));
            optional.forEach(dep => {
                if (dep.installed) {
                    console.log(chalk.green(`  ✅ ${dep.name} ${dep.version ? `(v${dep.version})` : ''}`));
                } else {
                    console.log(chalk.gray(`  ⚪ ${dep.name} - 미설치`));
                }
            });
        }

        // If missing required dependencies, show installation instructions
        if (!allRequired) {
            console.log(chalk.red.bold('\n⚠️  필수 의존성이 누락되었습니다!\n'));
            dependencies.filter(d => d.required && !d.installed).forEach(dep => {
                this.displayInstallInstructions(dep);
            });
            return false;
        }

        // If no PDF engine, show recommendations
        if (!hasPdfEngine) {
            console.log(chalk.yellow.bold('\n⚠️  PDF 생성 엔진이 없습니다!\n'));
            console.log(chalk.yellow('PDF 파일을 생성하려면 최소 1개의 PDF 엔진이 필요합니다.'));
            console.log(chalk.yellow('EPUB만 생성하려면 이 단계를 건너뛸 수 있습니다.\n'));

            // Show WeasyPrint first (recommended)
            const weasyprint = pdfEngines.find(e => e.name === 'WeasyPrint');
            if (weasyprint) {
                this.displayInstallInstructions(weasyprint);
            }

            console.log(chalk.gray('\n또는 다른 PDF 엔진을 선택하세요:'));
            pdfEngines.filter(e => e.name !== 'WeasyPrint').forEach(engine => {
                console.log(chalk.gray(`  • ${engine.name}: ${engine.installInstructions.description}`));
            });

            console.log(chalk.cyan('\n💡 전체 설치 가이드: https://github.com/goodlookingprokim/markdown-to-document-cli#-필수-요구사항\n'));
        }

        if (allRequired && hasPdfEngine) {
            console.log(chalk.green.bold('\n✅ 모든 의존성이 준비되었습니다!\n'));
        }

        // Return true only if all required deps are met AND PDF engine is available when needed
        if (!allRequired) {
            return false;
        }

        // If format requires PDF but no engine available, return false
        if (format && (format === 'pdf' || format === 'both') && !hasPdfEngine) {
            return false;
        }

        return true;
    }

    /**
     * Quick check - returns true if ready to convert
     */
    async quickCheck(format: 'epub' | 'pdf' | 'both'): Promise<boolean> {
        const { allRequired, hasPdfEngine } = await this.checkAll();

        if (!allRequired) {
            return false;
        }

        // If PDF is needed but no engine available
        if ((format === 'pdf' || format === 'both') && !hasPdfEngine) {
            return false;
        }

        return true;
    }
}
