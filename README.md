# TURAFIC Deploy 폴더

이 폴더의 파일들은 GitHub에 푸시되어 원격 PC들이 자동으로 다운로드합니다.

## 파일 목록

| 파일 | 설명 |
|------|------|
| `experiment-runner.js` | 실험 PC용 Runner (빌드된 JS) |
| `worker-runner.js` | 작업 PC용 Runner (빌드된 JS) |
| `version.json` | 버전 정보 (타임스탬프로 업데이트 감지) |

## 사용법

1. `tools/1클릭_배포완료.bat` 실행
2. 자동으로 빌드 → version.json 갱신 → GitHub 푸시
3. 원격 PC들이 3분 이내 자동 업데이트

## 직접 빌드하기

```bash
# experiment-runner 빌드
npx esbuild scripts/distributed/experiment-runner.ts --bundle --platform=node --outfile=deploy/experiment-runner.js

# worker-runner 빌드
npx esbuild scripts/distributed/worker-runner.ts --bundle --platform=node --outfile=deploy/worker-runner.js
```

## 주의사항

- 이 폴더는 별도의 Git 레포(`mim1012/turafic-update`)로 관리됩니다
- 메인 프로젝트와 분리되어 있어 원격 PC에서 안전하게 다운로드 가능
