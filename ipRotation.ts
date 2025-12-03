/**
 * IP Rotation Module
 *
 * USB 테더링을 통한 IP 로테이션 기능
 * - 현재 IP 확인
 * - 테더링 어댑터 자동 감지
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

// ============ 테더링 어댑터 감지 ============
export async function getTetheringAdapter(): Promise<string | null> {
  try {
    // 방법 1: wmic으로 설명(Description) 기반 검색
    try {
      const { stdout: wmicOut } = await execAsync(
        'wmic nic where "NetEnabled=true" get Name,NetConnectionID /format:csv',
        { encoding: "utf8" }
      );

      const tetheringKeywords = [
        "Remote NDIS",
        "USB 테더링",
        "USB Tethering",
        "Android USB",
        "RNDIS",
        "iPhone USB",
        "Apple Mobile Device Ethernet",
        "SAMSUNG Mobile",
        "Mobile USB",
      ];

      const lines = wmicOut.split("\n").filter(l => l.trim());
      for (const line of lines) {
        const lowerLine = line.toLowerCase();
        for (const keyword of tetheringKeywords) {
          if (lowerLine.includes(keyword.toLowerCase())) {
            // CSV 형식: Node,Name,NetConnectionID
            const parts = line.split(",");
            if (parts.length >= 3) {
              const adapterName = parts[parts.length - 1].trim();
              if (adapterName && adapterName !== "NetConnectionID") {
                console.log(`[IPRotation] 테더링 어댑터 감지 (wmic): ${adapterName}`);
                return adapterName;
              }
            }
          }
        }
      }
    } catch {
      // wmic 실패 시 netsh로 fallback
    }

    // 방법 2: netsh interface show interface (fallback)
    const { stdout } = await execAsync("netsh interface show interface", { encoding: "utf8" });
    const lines = stdout.split("\n");

    // "이더넷 XX" 형태로 연결된 어댑터 중 기본 이더넷이 아닌 것 찾기
    for (const line of lines) {
      // 연결됨 상태인 어댑터만
      if (line.includes("연결됨") || line.includes("Connected")) {
        const parts = line.trim().split(/\s{2,}/);
        if (parts.length >= 4) {
          const adapterName = parts[parts.length - 1];
          // VMware, Tailscale 등 제외
          if (adapterName &&
              !adapterName.includes("VMware") &&
              !adapterName.includes("Tailscale") &&
              !adapterName.includes("Loopback")) {
            // 이더넷 XX 형태 (숫자가 큰 것이 대체로 테더링)
            const match = adapterName.match(/이더넷\s*(\d+)/);
            if (match && parseInt(match[1]) > 10) {
              console.log(`[IPRotation] 테더링 어댑터 추정: ${adapterName}`);
              return adapterName;
            }
          }
        }
      }
    }

    console.log("[IPRotation] 테더링 어댑터를 찾을 수 없음");
    console.log("[IPRotation] 연결된 어댑터 목록:");
    console.log(stdout);
    return null;
  } catch (error: any) {
    console.error(`[IPRotation] 어댑터 감지 실패: ${error.message}`);
    return null;
  }
}

// ============ 테더링 제어 ============
export async function disableTethering(adapterName: string): Promise<void> {
  try {
    console.log(`[IPRotation] 테더링 비활성화: ${adapterName}`);
    await execAsync(`netsh interface set interface "${adapterName}" disable`);
  } catch (error: any) {
    // 이미 비활성화된 경우 무시
    if (!error.message.includes("already")) {
      throw new Error(`테더링 비활성화 실패: ${error.message}`);
    }
  }
}

export async function enableTethering(adapterName: string): Promise<void> {
  try {
    console.log(`[IPRotation] 테더링 활성화: ${adapterName}`);
    await execAsync(`netsh interface set interface "${adapterName}" enable`);
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

export async function rotateIP(adapterName?: string): Promise<IPRotationResult> {
  // 1. 어댑터 이름 확인
  const adapter = adapterName || await getTetheringAdapter();
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
