# Phase 16: Real-Time Video System Implementation Blueprint

This document outlines the technical architecture and implementation strategy for transitioning static interview frames into a live, peer-to-peer (P2P) video communication system using **WebRTC** and **Socket.io**.

---

## 1. Backend Signaling (Socket.io)
**File**: `backend/src/server.ts` or `src/socketService.ts`

### Strategy:
*   Extend the existing Socket.io instance to handle the "Handshake" (Signaling).
*   Implement event listeners to relay opaque WebRTC messages between candidates and interviewers.

### Key Events:
| Event | Payload | Action |
| :--- | :--- | :--- |
| `join-room` | `interviewId` | Joins the specific socket room for an interview sessions. |
| `offer` | `SDP Object` | Relays the connection offer from the caller to the receiver. |
| `answer` | `SDP Object` | Relays the session acceptance from receiver back to the caller. |
| `ice-candidate` | `Candidate Token` | Passes network location data to bridge firewalls. |

---

## 2. Frontend Media Engine (useWebRTC Hook)
**File**: `frontend/src/hooks/useWebRTC.ts`

### Strategy:
*   Create a custom hook to encapsulate `navigator.mediaDevices` and `RTCPeerConnection` logic.

### Responsibilities:
1.  **Request Permissions**: Use `getUserMedia` to initialize local camera/microphone.
2.  **State Management**: Store `localStream` and `remoteStream` as React state variables.
3.  **Track Events**: Listen for `onTrack` events from the peer connection to display the remote video.
4.  **Hardware Controls**: Provide functions to enable/disable specific tracks (Mute/Camera Off).

---

## 3. High-Fidelity UI Components
**File**: `frontend/src/app/(interviewer)/interviewer/interview-room/[id]/page.tsx`

### Components:
*   **Hero Video Layer**: A large, full-screen `<video>` element for the remote peer (Candidate).
*   **PiP (Picture-in-Picture)**: A smaller, draggable/floating `<video>` element for the local peer (Interviewer).
*   **Control Bar**: A floating action bar with:
    *   `Mic Toggle` (Lucide: Mic/MicOff)
    *   `Camera Toggle` (Lucide: Video/VideoOff)
    *   `Screen Share` (Lucide: ScreenShare) - via `getDisplayMedia`
    *   `End Session` (Lucide: PhoneOff) - clean teardown of peer connection.

---

## 4. Technical Constraints & Performance
*   **Stun Servers**: Use Google's free STUN servers (`stun:stun.l.google.com:19302`) to ensure 95%+ connection success rates across different networks.
*   **Codec Negotiation**: Enforce **H.264** or **VP9** for high-efficiency mobile/desktop compatibility.
*   **Self-Healing**: Implement an automatic reconnection logic if the socket or P2P data stream is interrupted.

---

## 5. Next Steps for Execution:
1.  **Refactor Backend Sockets**: Add signaling listeners.
2.  **Develop `useWebRTC`**: Build the core connectivity hook.
3.  **UI Transformation**: Replace static thumbnails with `<video>` components.
4.  **Integration Testing**: Verify camera handover and connectivity statuses.

> [!NOTE]
> This blueprint ensures that the video traffic NEVER touches our server, keeping costs at $0.00 and latency at the absolute theoretical minimum (P2P).
