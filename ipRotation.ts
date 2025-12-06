/**
 * IP Rotation Module
 *
 * USB 테더링을 통한 IP 로테이션 기능
 * - 현재 IP 확인
 * - 테더링 어댑터 자동 감지 (IfIndex 사용)
 * - 테더링 ON/OFF로 IP 변경
 */

import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

// ============ 설정 ============
const TETHERING_OFF_DELAY = 3000;  // 3초
const TETHERING_ON_DELAY = 5000;   // 5초
const IP_CHECK_RETRY = 3;
const IP_CHECK_RETRY_DELAY = 2000;

// ============ 어댑터 정보 인터페이스 ============
interface AdapterInfo {
  ifIndex: number;
  name: string;
}

// ============ IP 확인 ============
export async function getCurrentIP(): Promise<string> {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json() as { ip: string };
    return data.ip;
  } catch (error) {
    // 백업 API
    try {
      const response = await fetch("https://ifconfig.me/ip");
      return (await response.text()).trim();
    } catch {
      throw new Error("IP 확인 실패: 네트워크 연결 확인 필요");
    }
  }
}

// ============ 테더링 어댑터 감지 (IfIndex 반환) ============
export async function getTetheringAdapter(): Promise<string | null> {
  try {
    // IfIndex를 반환 (숫자는 인코딩 문제 없음)
    // 방법 1: 테더링 키워드로 검색
    const { stdout: keywordResult } = await execAsync(
      `powershell -NoProfile -Command "Get-NetAdapter | Where-Object { $_.Status -eq 'Up' -and ($_.InterfaceDescription -like '*NDIS*' -or $_.InterfaceDescription -like '*USB*' -or $_.InterfaceDescription -like '*Android*' -or $_.InterfaceDescription -like '*SAMSUNG*' -or $_.InterfaceDescription -like '*Tethering*') } | Select-Object -First 1 -ExpandProperty ifIndex"`,
      { encoding: "utf8", windowsHide: true }
    );

    if (keywordResult.trim()) {
      const ifIndex = keywordResult.trim();
      console.log(`[IPRotation] 테더링 어댑터 감지 (IfIndex: ${ifIndex})`);
      return ifIndex;
    }

    // 방법 2: 이더넷 N (N > 1) 패턴 검색 - 인덱스로 반환
    const { stdout: ethernetResult } = await execAsync(
      `powershell -NoProfile -Command "$adapters = Get-NetAdapter | Where-Object { $_.Status -eq 'Up' }; $tethering = $adapters | Where-Object { $_.Name -match '^.+\\s*[2-9]$|^.+\\s*[1-9][0-9]+$' -and $_.Name -notmatch 'Wi-Fi|WiFi|Wireless' }; if ($tethering) { $tethering | Select-Object -First 1 -ExpandProperty ifIndex }"`,
      { encoding: "utf8", windowsHide: true }
    );

    if (ethernetResult.trim()) {
      const ifIndex = ethernetResult.trim();
      console.log(`[IPRotation] 테더링 어댑터 감지 (IfIndex: ${ifIndex})`);
      return ifIndex;
    }

    // Fallback: 연결된 어댑터 목록 출력
    const { stdout: listOut } = await execAsync(
      `powershell -NoProfile -Command "Get-NetAdapter | Where-Object { $_.Status -eq 'Up' } | Select-Object ifIndex, Name, InterfaceDescription | Format-Table -AutoSize"`,
      { encoding: "utf8", windowsHide: true }
    );
    console.log("[IPRotation] 테더링 어댑터를 찾을 수 없음");
    console.log("[IPRotation] 연결된 어댑터 목록:");
    console.log(listOut);
    return null;
  } catch (error: any) {
    console.error(`[IPRotation] 어댑터 감지 실패: ${error.message}`);
    return null;
  }
}

// ============ 테더링 제어 (IfIndex 사용) ============
export async function disableTethering(adapterIndex: string): Promise<void> {
  try {
    console.log(`[IPRotation] 테더링 비활성화 (IfIndex: ${adapterIndex})`);
    // Get-NetAdapter로 가져온 후 파이프로 Disable
    await execAsync(
      `powershell -NoProfile -Command "Get-NetAdapter -InterfaceIndex ${adapterIndex} | Disable-NetAdapter -Confirm:$false"`,
      { encoding: "utf8", windowsHide: true }
    );
  } catch (error: any) {
    // 이미 비활성화된 경우 무시
    if (!error.message.includes("already")) {
      throw new Error(`테더링 비활성화 실패: ${error.message}`);
    }
  }
}

export async function enableTethering(adapterIndex: string): Promise<void> {
  try {
    console.log(`[IPRotation] 테더링 활성화 (IfIndex: ${adapterIndex})`);
    // Get-NetAdapter로 가져온 후 파이프로 Enable
    await execAsync(
      `powershell -NoProfile -Command "Get-NetAdapter -InterfaceIndex ${adapterIndex} | Enable-NetAdapter -Confirm:$false"`,
      { encoding: "utf8", windowsHide: true }
    );
  } catch (error: any) {
    // 이미 활성화된 경우 무시
    if (!error.message.includes("already")) {
      throw new Error(`테더링 활성화 실패: ${error.message}`);
    }
  }
}

// ============ IP 로테이션 ============
export interface IPRotationResult {
  success: boolean;
  oldIP: string;
  newIP: string;
  error?: string;
}

export async function rotateIP(adapterIndex?: string): Promise<IPRotationResult> {
  // 1. 어댑터 인덱스 확인
  const adapter = adapterIndex || await getTetheringAdapter();
  if (!adapter) {
    return {
      success: false,
      oldIP: "",
      newIP: "",
      error: "테더링 어댑터를 찾을 수 없음",
    };
  }

  // 2. 현재 IP 확인
  let oldIP: string;
  try {
    oldIP = await getCurrentIP();
    console.log(`[IPRotation] 현재 IP: ${oldIP}`);
  } catch (error: any) {
    return {
      success: false,
      oldIP: "",
      newIP: "",
      error: `현재 IP 확인 실패: ${error.message}`,
    };
  }

  // 3. 테더링 비활성화
  try {
    await disableTethering(adapter);
    console.log(`[IPRotation] ${TETHERING_OFF_DELAY / 1000}초 대기...`);
    await sleep(TETHERING_OFF_DELAY);
  } catch (error: any) {
    return {
      success: false,
      oldIP,
      newIP: "",
      error: `테더링 비활성화 실패: ${error.message}`,
    };
  }

  // 4. 테더링 활성화
  try {
    await enableTethering(adapter);
    console.log(`[IPRotation] ${TETHERING_ON_DELAY / 1000}초 대기 (재연결)...`);
    await sleep(TETHERING_ON_DELAY);
  } catch (error: any) {
    return {
      success: false,
      oldIP,
      newIP: "",
      error: `테더링 활성화 실패: ${error.message}`,
    };
  }

  // 5. 새 IP 확인 (재시도 포함)
  let newIP = "";
  for (let i = 0; i < IP_CHECK_RETRY; i++) {
    try {
      newIP = await getCurrentIP();
      break;
    } catch {
      console.log(`[IPRotation] IP 확인 재시도 ${i + 1}/${IP_CHECK_RETRY}...`);
      await sleep(IP_CHECK_RETRY_DELAY);
    }
  }

  if (!newIP) {
    return {
      success: false,
      oldIP,
      newIP: "",
      error: "새 IP 확인 실패: 네트워크 재연결 실패",
    };
  }

  // 6. IP 변경 확인
  if (oldIP === newIP) {
    console.log(`[IPRotation] 경고: IP가 변경되지 않음 (${oldIP})`);
    return {
      success: false,
      oldIP,
      newIP,
      error: "IP가 변경되지 않음",
    };
  }

  console.log(`[IPRotation] IP 변경 성공: ${oldIP} → ${newIP}`);
  return {
    success: true,
    oldIP,
    newIP,
  };
}

// ============ 유틸 ============
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
