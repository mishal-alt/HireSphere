import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { toast } from 'react-hot-toast';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 
                   process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 
                   "http://localhost:5000";

const ICE_SERVERS = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
        { urls: 'stun:stun3.l.google.com:19302' },
    ]
};

export const useWebRTC = (interviewId: string, userId: string) => {
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isCamOff, setIsCamOff] = useState(false);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState<"Disconnected" | "Connecting" | "Connected">("Disconnected");

    const peerConnection = useRef<RTCPeerConnection | null>(null);
    const socket = useRef<Socket | null>(null);
    const localStreamRef = useRef<MediaStream | null>(null);
    const iceCandidatesQueue = useRef<RTCIceCandidateInit[]>([]);

    const createPeerConnection = useCallback((stream: MediaStream) => {
        const pc = new RTCPeerConnection(ICE_SERVERS);

        stream.getTracks().forEach(track => {
            pc.addTrack(track, stream);
        });

        pc.ontrack = (event) => {
            const [remote] = event.streams;
            setRemoteStream(remote);
            setConnectionStatus("Connected");
        };

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                socket.current?.emit("new_ice_candidate", {
                    candidate: event.candidate,
                    interviewId
                });
            }
        };

        pc.onconnectionstatechange = () => {
            console.log("Connection State:", pc.connectionState);
            if (pc.connectionState === 'connected') setConnectionStatus("Connected");
            else if (pc.connectionState === 'connecting') setConnectionStatus("Connecting");
            else if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected') {
                setConnectionStatus("Disconnected");
                // Optional: Attempt reconnection logic here
            }
        };

        peerConnection.current = pc;
        return pc;
    }, [interviewId]);

    const initMedia = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });
            setLocalStream(stream);
            localStreamRef.current = stream;
            return stream;
        } catch (error: any) {
            console.error("WebRTC Media Error:", error);
            handleMediaError(error);
            return null;
        }
    }, []);

    const handleMediaError = (error: any) => {
        if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
            toast.error("Camera in use! Please close other apps using your webcam.");
        } else if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
            toast.error("Camera access blocked! Please check your browser permissions.");
        } else {
            toast.error("Could not access camera/microphone.");
        }
    };

    useEffect(() => {
        if (!interviewId || !userId) return;

        const startConnection = async () => {
            const stream = await initMedia();
            if (!stream) return;

            const pc = createPeerConnection(stream);
            socket.current = io(SOCKET_URL);

            // Set up listeners BEFORE joining
            socket.current.on("participant_joined", async () => {
                console.log("Peer joined, creating offer...");
                setConnectionStatus("Connecting");
                const offer = await pc.createOffer();
                await pc.setLocalDescription(offer);
                socket.current?.emit("video_offer", { offer, interviewId });
            });

            socket.current.on("video_offer", async (data: { offer: any }) => {
                console.log("Offer received, creating answer...");
                setConnectionStatus("Connecting");
                await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);
                socket.current?.emit("video_answer", { answer, interviewId });
                processIceQueue(pc);
            });

            socket.current.on("video_answer", async (data: { answer: any }) => {
                console.log("Answer received, finalizing connection...");
                await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
                processIceQueue(pc);
            });

            socket.current.on("new_ice_candidate", (data: { candidate: RTCIceCandidateInit }) => {
                if (pc.remoteDescription) {
                    pc.addIceCandidate(new RTCIceCandidate(data.candidate)).catch(console.error);
                } else {
                    iceCandidatesQueue.current.push(data.candidate);
                }
            });

            // Finally, join the room
            socket.current.emit("join_interview", { interviewId, userId });
        };

        const processIceQueue = (pc: RTCPeerConnection) => {
            while (iceCandidatesQueue.current.length > 0) {
                const candidate = iceCandidatesQueue.current.shift();
                if (candidate) pc.addIceCandidate(new RTCIceCandidate(candidate)).catch(console.error);
            }
        };

        startConnection();

        return () => {
            if (localStreamRef.current) {
                localStreamRef.current.getTracks().forEach(track => track.stop());
            }
            peerConnection.current?.close();
            socket.current?.disconnect();
            setLocalStream(null);
            setRemoteStream(null);
        };
    }, [interviewId, userId, initMedia, createPeerConnection]);

    const toggleMute = () => {
        if (localStreamRef.current) {
            const track = localStreamRef.current.getAudioTracks()[0];
            if (track) {
                track.enabled = !track.enabled;
                setIsMuted(!track.enabled);
            }
        }
    };

    const toggleCamera = () => {
        if (localStreamRef.current) {
            const track = localStreamRef.current.getVideoTracks()[0];
            if (track) {
                track.enabled = !track.enabled;
                setIsCamOff(!track.enabled);
            }
        }
    };

    const toggleScreenShare = async () => {
        if (!peerConnection.current) {
            toast.error("No active connection to share screen.");
            return;
        }

        try {
            if (!isScreenSharing) {
                const screenStream = await navigator.mediaDevices.getDisplayMedia({
                    video: {
                        cursor: "always"
                    } as any,
                    audio: false
                });

                const screenTrack = screenStream.getVideoTracks()[0];
                const senders = peerConnection.current.getSenders();
                const videoSender = senders.find(s => s.track?.kind === 'video');

                if (videoSender) {
                    await videoSender.replaceTrack(screenTrack);
                }

                // Update local UI
                const newLocalStream = new MediaStream([screenTrack, ...localStreamRef.current?.getAudioTracks() || []]);
                setLocalStream(newLocalStream);

                screenTrack.onended = () => {
                    stopScreenSharing();
                };

                setIsScreenSharing(true);
            } else {
                await stopScreenSharing();
            }
        } catch (error) {
            console.error("Screen share error:", error);
            toast.error("Failed to share screen.");
        }
    };

    const stopScreenSharing = async () => {
        if (!peerConnection.current || !localStreamRef.current) return;

        const cameraTrack = localStreamRef.current.getVideoTracks()[0];
        const senders = peerConnection.current.getSenders();
        const videoSender = senders.find(s => s.track?.kind === 'video');

        if (videoSender && cameraTrack) {
            await videoSender.replaceTrack(cameraTrack);
        }

        setLocalStream(localStreamRef.current);
        setIsScreenSharing(false);
    };

    return {
        localStream,
        remoteStream,
        isMuted,
        isCamOff,
        isScreenSharing,
        connectionStatus,
        toggleMute,
        toggleCamera,
        toggleScreenShare
    };
};


