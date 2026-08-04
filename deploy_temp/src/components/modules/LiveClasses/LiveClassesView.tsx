import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import type { LiveClass } from '../../../types';
import { mockLiveClasses } from '../../../data/mockData';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Monitor,
  Hand,
  MessageSquare,
  Users,
  PenTool,
  Clock,
  Plus,
  Send,
  Radio,
  X,
  Volume2,
  Trash2,
  ShieldCheck,
  Maximize2,
  Minimize2,
  CheckCircle2,
  AlertCircle,
  Play,
  UserPlus
} from 'lucide-react';
import { Modal } from '../../common/Modal';

interface RemotePeerStream {
  peerId: string;
  peerName: string;
  peerRole: string;
  stream: MediaStream;
  isMicOn: boolean;
  isVideoOn: boolean;
  isScreenSharing: boolean;
  handRaised: boolean;
}

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' }
  ]
};

const createSyntheticStream = (label: string): MediaStream => {
  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 480;
  const ctx = canvas.getContext('2d')!;

  let angle = 0;
  const draw = () => {
    angle += 0.05;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 640, 480);

    ctx.fillStyle = '#2563eb';
    ctx.beginPath();
    ctx.arc(320 + Math.sin(angle) * 100, 240 + Math.cos(angle) * 50, 40, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`WebRTC Stream: ${label}`, 320, 240);
    requestAnimationFrame(draw);
  };
  draw();

  const stream = canvas.captureStream(30);

  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const dst = audioCtx.createMediaStreamDestination();
    osc.connect(dst);
    osc.start();
    const audioTrack = dst.stream.getAudioTracks()[0];
    stream.addTrack(audioTrack);
  } catch (e) {
    console.warn('Audio oscillator error:', e);
  }

  return stream;
};

export const LiveClassesView: React.FC = () => {
  const { currentUser, role } = useAuth();
  const [classes, setClasses] = useState<LiveClass[]>(mockLiveClasses);
  const [activeStudioClass, setActiveStudioClass] = useState<LiveClass | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Tab Unique Session Peer ID
  const myPeerIdRef = useRef<string>('');
  if (!myPeerIdRef.current) {
    myPeerIdRef.current = `${currentUser.id}_${Math.random().toString(36).substring(2, 8)}`;
  }

  // WebRTC Hardware
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const screenShareVideoRef = useRef<HTMLVideoElement | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);

  // Stream Refs for Async WebRTC Handshake
  const localStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const peerNamesRef = useRef<Record<string, { name: string; role: string }>>({});
  const pendingCandidatesRef = useRef<Record<string, RTCIceCandidateInit[]>>({});

  // Hardware Toggles
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [hardwareError, setHardwareError] = useState<string | null>(null);

  // UI State
  const [handRaised, setHandRaised] = useState(false);
  const [activeSidePanel, setActiveSidePanel] = useState<'chat' | 'people' | 'whiteboard'>('chat');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // WebRTC Peer Registry
  const [remotePeers, setRemotePeers] = useState<RemotePeerStream[]>([]);
  const peerConnectionsRef = useRef<Record<string, RTCPeerConnection>>({});
  const channelRef = useRef<BroadcastChannel | null>(null);

  // Chat State
  const [chatMessages, setChatMessages] = useState<{ id: string; sender: string; time: string; text: string; isHost?: boolean }[]>([
    {
      id: 'c-1',
      sender: 'WebRTC Studio Engine',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: 'Multi-tab WebRTC RTCPeerConnection active with STUN candidate exchange & hardware fallback.',
      isHost: true
    }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Whiteboard Canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawColor, setDrawColor] = useState('#2563EB');

  // Schedule Modal
  const [title, setTitle] = useState('');
  const [scheduledTime, setScheduledTime] = useState('Today at 04:00 PM');
  const [duration, setDuration] = useState(60);

  // Toggle class status between UPCOMING and LIVE
  const handleToggleGoLive = (classId: string) => {
    setClasses(classes.map(c => {
      if (c.id === classId) {
        const newStatus: 'LIVE' | 'UPCOMING' = c.status === 'LIVE' ? 'UPCOMING' : 'LIVE';
        return { ...c, status: newStatus };
      }
      return c;
    }));
  };

  const createPeerConnection = (targetPeerId: string, isInitiator: boolean, remoteName?: string, remoteRole?: string) => {
    if (remoteName) {
      peerNamesRef.current[targetPeerId] = {
        name: remoteName,
        role: remoteRole || 'Connected Remote Peer'
      };
    }

    if (peerConnectionsRef.current[targetPeerId]) {
      return peerConnectionsRef.current[targetPeerId];
    }

    const pc = new RTCPeerConnection(ICE_SERVERS);
    peerConnectionsRef.current[targetPeerId] = pc;

    const streamToSend = screenStreamRef.current || localStreamRef.current;
    if (streamToSend) {
      streamToSend.getTracks().forEach((track) => {
        try {
          pc.addTrack(track, streamToSend);
        } catch (e) {
          console.warn('Track addition warning:', e);
        }
      });
    }

    pc.onicecandidate = (event) => {
      if (event.candidate && channelRef.current) {
        channelRef.current.postMessage({
          type: 'ICE_CANDIDATE',
          fromPeerId: myPeerIdRef.current,
          targetPeerId,
          candidate: event.candidate
        });
      }
    };

    pc.ontrack = (event) => {
      if (event.streams && event.streams[0]) {
        const receivedStream = event.streams[0];
        const peerInfo = peerNamesRef.current[targetPeerId] || {
          name: targetPeerId.startsWith('sim-') ? 'Simulated Participant' : `Peer (${targetPeerId.slice(0, 6)})`,
          role: 'Connected Remote Peer'
        };

        setRemotePeers((prev) => {
          const index = prev.findIndex((p) => p.peerId === targetPeerId);
          const updatedPeer: RemotePeerStream = {
            peerId: targetPeerId,
            peerName: peerInfo.name,
            peerRole: peerInfo.role,
            stream: receivedStream,
            isMicOn: true,
            isVideoOn: true,
            isScreenSharing: false,
            handRaised: false
          };

          if (index >= 0) {
            const next = [...prev];
            next[index] = updatedPeer;
            return next;
          }
          return [...prev, updatedPeer];
        });
      }
    };

    if (isInitiator) {
      pc.createOffer()
        .then((offer) => pc.setLocalDescription(offer))
        .then(() => {
          if (channelRef.current) {
            channelRef.current.postMessage({
              type: 'OFFER',
              fromPeerId: myPeerIdRef.current,
              targetPeerId,
              offer: pc.localDescription,
              peerName: `${currentUser.firstName} ${currentUser.lastName}`,
              peerRole: role
            });
          }
        })
        .catch((err) => console.error('Create offer error:', err));
    }

    return pc;
  };

  useEffect(() => {
    if (!activeStudioClass) return;

    const bc = new BroadcastChannel(`webrtc_room_${activeStudioClass.id}`);
    channelRef.current = bc;

    bc.postMessage({
      type: 'ANNOUNCE_PEER',
      fromPeerId: myPeerIdRef.current,
      peerName: `${currentUser.firstName} ${currentUser.lastName}`,
      peerRole: role
    });

    bc.onmessage = async (event) => {
      const { type, fromPeerId, targetPeerId, offer, answer, candidate, message, stroke, peerName, peerRole } = event.data;
      if (fromPeerId === myPeerIdRef.current) return;

      if (type === 'ANNOUNCE_PEER') {
        createPeerConnection(fromPeerId, true, peerName, peerRole);
      } else if (type === 'OFFER' && (targetPeerId === myPeerIdRef.current || !targetPeerId)) {
        const pc = createPeerConnection(fromPeerId, false, peerName, peerRole);
        await pc.setRemoteDescription(new RTCSessionDescription(offer));

        if (pendingCandidatesRef.current[fromPeerId]) {
          for (const cand of pendingCandidatesRef.current[fromPeerId]) {
            await pc.addIceCandidate(new RTCIceCandidate(cand)).catch(console.warn);
          }
          delete pendingCandidatesRef.current[fromPeerId];
        }

        const ans = await pc.createAnswer();
        await pc.setLocalDescription(ans);

        bc.postMessage({
          type: 'ANSWER',
          fromPeerId: myPeerIdRef.current,
          targetPeerId: fromPeerId,
          answer: pc.localDescription
        });
      } else if (type === 'ANSWER' && targetPeerId === myPeerIdRef.current) {
        const pc = peerConnectionsRef.current[fromPeerId];
        if (pc) {
          await pc.setRemoteDescription(new RTCSessionDescription(answer));

          if (pendingCandidatesRef.current[fromPeerId]) {
            for (const cand of pendingCandidatesRef.current[fromPeerId]) {
              await pc.addIceCandidate(new RTCIceCandidate(cand)).catch(console.warn);
            }
            delete pendingCandidatesRef.current[fromPeerId];
          }
        }
      } else if (type === 'ICE_CANDIDATE' && targetPeerId === myPeerIdRef.current) {
        const pc = peerConnectionsRef.current[fromPeerId];
        if (pc && pc.remoteDescription && pc.remoteDescription.type) {
          await pc.addIceCandidate(new RTCIceCandidate(candidate)).catch(console.warn);
        } else if (candidate) {
          pendingCandidatesRef.current[fromPeerId] = [...(pendingCandidatesRef.current[fromPeerId] || []), candidate];
        }
      } else if (type === 'LEAVE_PEER') {
        if (peerConnectionsRef.current[fromPeerId]) {
          peerConnectionsRef.current[fromPeerId].close();
          delete peerConnectionsRef.current[fromPeerId];
        }
        delete peerNamesRef.current[fromPeerId];
        delete pendingCandidatesRef.current[fromPeerId];
        setRemotePeers((prev) => prev.filter((p) => p.peerId !== fromPeerId));
      } else if (type === 'CHAT_MSG') {
        setChatMessages((prev) => [...prev, message]);
      } else if (type === 'DRAW_STROKE') {
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.strokeStyle = stroke.color;
            ctx.lineWidth = 3;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(stroke.fromX, stroke.fromY);
            ctx.lineTo(stroke.toX, stroke.toY);
            ctx.stroke();
          }
        }
      } else if (type === 'CLEAR_BOARD') {
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }
    };

    return () => {
      bc.postMessage({
        type: 'LEAVE_PEER',
        fromPeerId: myPeerIdRef.current
      });
      Object.values(peerConnectionsRef.current).forEach((pc) => pc.close());
      peerConnectionsRef.current = {};
      peerNamesRef.current = {};
      pendingCandidatesRef.current = {};
      bc.close();
    };
  }, [activeStudioClass]);

  const attachStreamToPeers = (stream: MediaStream) => {
    localStreamRef.current = stream;
    Object.values(peerConnectionsRef.current).forEach((pc) => {
      const senders = pc.getSenders();
      stream.getTracks().forEach((track) => {
        const existingSender = senders.find((s) => s.track && s.track.kind === track.kind);
        if (existingSender) {
          existingSender.replaceTrack(track);
        } else {
          try {
            pc.addTrack(track, stream);
          } catch (e) {
            console.warn('addTrack error:', e);
          }
        }
      });
    });
  };

  useEffect(() => {
    let audioCtx: AudioContext | null = null;
    let animId: number;

    if (activeStudioClass) {
      setHardwareError(null);
      navigator.mediaDevices
        ?.getUserMedia({ video: true, audio: true })
        .then((stream) => {
          setLocalStream(stream);
          attachStreamToPeers(stream);

          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
            localVideoRef.current.play().catch(console.warn);
          }

          try {
            audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const source = audioCtx.createMediaStreamSource(stream);
            const analyser = audioCtx.createAnalyser();
            analyser.fftSize = 64;
            source.connect(analyser);

            const dataArray = new Uint8Array(analyser.frequencyBinCount);
            const checkVolume = () => {
              analyser.getByteFrequencyData(dataArray);
              let sum = 0;
              for (let i = 0; i < dataArray.length; i++) {
                sum += dataArray[i];
              }
              const average = sum / dataArray.length;
              setAudioLevel(Math.min(100, Math.round((average / 128) * 100)));
              animId = requestAnimationFrame(checkVolume);
            };
            checkVolume();
          } catch (err) {
            console.warn('Audio VU analyzer init:', err);
          }
        })
        .catch((err) => {
          console.warn('Hardware camera lock fallback:', err);
          setHardwareError('Camera hardware in use by another window: Running WebRTC simulation stream.');
          const synthStream = createSyntheticStream(`${currentUser.firstName} ${currentUser.lastName}`);
          setLocalStream(synthStream);
          attachStreamToPeers(synthStream);

          if (localVideoRef.current) {
            localVideoRef.current.srcObject = synthStream;
            localVideoRef.current.play().catch(console.warn);
          }
        });
    } else {
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
        setLocalStream(null);
        localStreamRef.current = null;
      }
      if (screenStream) {
        screenStream.getTracks().forEach((track) => track.stop());
        setScreenStream(null);
        screenStreamRef.current = null;
      }
      setRemotePeers([]);
    }

    return () => {
      if (animId) cancelAnimationFrame(animId);
      if (audioCtx) audioCtx.close();
    };
  }, [activeStudioClass]);

  const toggleMicrophone = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((t) => (t.enabled = !isMicOn));
    }
    setIsMicOn(!isMicOn);
  };

  const toggleCamera = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach((t) => (t.enabled = !isVideoOn));
    }
    setIsVideoOn(!isVideoOn);
  };

  const startScreenShare = async () => {
    if (isScreenSharing) {
      if (screenStream) {
        screenStream.getTracks().forEach((t) => t.stop());
        setScreenStream(null);
        screenStreamRef.current = null;
      }
      setIsScreenSharing(false);
      return;
    }

    try {
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      });

      setScreenStream(displayStream);
      screenStreamRef.current = displayStream;
      setIsScreenSharing(true);

      if (screenShareVideoRef.current) {
        screenShareVideoRef.current.srcObject = displayStream;
        screenShareVideoRef.current.play().catch(console.warn);
      }

      const videoTrack = displayStream.getVideoTracks()[0];
      Object.values(peerConnectionsRef.current).forEach((pc) => {
        const senders = pc.getSenders();
        const videoSender = senders.find((s) => s.track && s.track.kind === 'video');
        if (videoSender) {
          videoSender.replaceTrack(videoTrack);
        }
      });

      videoTrack.onended = () => {
        setIsScreenSharing(false);
        setScreenStream(null);
        screenStreamRef.current = null;
        if (localStream) {
          const cameraTrack = localStream.getVideoTracks()[0];
          Object.values(peerConnectionsRef.current).forEach((pc) => {
            const senders = pc.getSenders();
            const videoSender = senders.find((s) => s.track && s.track.kind === 'video');
            if (videoSender && cameraTrack) {
              videoSender.replaceTrack(cameraTrack);
            }
          });
        }
      };
    } catch (err) {
      console.warn('Screen share cancelled:', err);
    }
  };

  const addSimulatedPeer = () => {
    const simId = `sim-peer-${Date.now()}`;
    const simList = [
      { name: 'Priya Sharma', role: 'Student' },
      { name: 'Rohan Gupta', role: 'Student' },
      { name: 'Dr. Ananya Iyer', role: 'Faculty' },
      { name: 'Vikram Singh', role: 'Student' }
    ];
    const peerInfo = simList[remotePeers.length % simList.length];
    const synthStream = createSyntheticStream(peerInfo.name);

    setRemotePeers((prev) => [
      ...prev,
      {
        peerId: simId,
        peerName: peerInfo.name,
        peerRole: peerInfo.role,
        stream: synthStream,
        isMicOn: true,
        isVideoOn: true,
        isScreenSharing: false,
        handRaised: false
      }
    ]);

    const sysMsg = {
      id: `c-${Date.now()}`,
      sender: 'System Broadcast',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: `${peerInfo.name} (${peerInfo.role}) joined the classroom studio.`,
      isHost: false
    };
    setChatMessages((prev) => [...prev, sysMsg]);
  };

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    const created: LiveClass = {
      id: `lc-${Date.now()}`,
      batchId: 'bat-1',
      batchName: 'FS-2026-SPRING-A',
      title: title || 'Live Virtual Classroom',
      platform: 'ZOOM',
      instructorName: `${currentUser.firstName} ${currentUser.lastName}`,
      meetingLink: '#native-studio',
      scheduledTime: scheduledTime,
      durationMins: duration,
      status: 'LIVE',
      attendeesCount: 1
    };
    setClasses([created, ...classes]);
    setIsAddModalOpen(false);
    setTitle('');
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg = {
      id: `c-${Date.now()}`,
      sender: `${currentUser.firstName} ${currentUser.lastName}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: chatInput,
      isHost: role !== 'STUDENT'
    };

    setChatMessages((prev) => [...prev, newMsg]);

    if (channelRef.current) {
      channelRef.current.postMessage({
        type: 'CHAT_MSG',
        message: newMsg
      });
    }

    setChatInput('');
  };

  // Whiteboard Canvas
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    lastPosRef.current = { x, y };

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !lastPosRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.strokeStyle = drawColor;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineTo(x, y);
    ctx.stroke();

    if (channelRef.current) {
      channelRef.current.postMessage({
        type: 'DRAW_STROKE',
        stroke: {
          fromX: lastPosRef.current.x,
          fromY: lastPosRef.current.y,
          toX: x,
          toY: y,
          color: drawColor
        }
      });
    }

    lastPosRef.current = { x, y };
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    lastPosRef.current = null;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (channelRef.current) {
        channelRef.current.postMessage({ type: 'CLEAR_BOARD' });
      }
    }
  };

  const totalAttendeesCount = 1 + remotePeers.length;

  return (
    <div className="space-y-6">
      {!activeStudioClass && (
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Virtual Classroom Studio (WebRTC P2P)</h1>
            <p className="text-xs text-gray-500">
              Only active sessions marked with <strong className="text-red-600 font-bold">🔴 LIVE NOW</strong> can be launched. Instructors can activate scheduled classes live.
            </p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-500/20 transition-200"
          >
            <Plus className="w-4 h-4" /> Schedule Studio Class
          </button>
        </div>
      )}

      {/* CATALOG VIEW WITH STRICT LIVE NOW ENFORCEMENT */}
      {!activeStudioClass ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((lc) => {
            const isLiveNow = lc.status === 'LIVE';
            const canManageStatus = role === 'SUPER_ADMIN' || role === 'INSTITUTE_ADMIN' || role === 'FACULTY';

            return (
              <div key={lc.id} className={`p-5 rounded-2xl border transition-200 flex flex-col justify-between ${
                isLiveNow ? 'bg-white border-red-200 shadow-md ring-2 ring-red-500/10' : 'bg-gray-50/70 border-gray-200'
              }`}>
                <div>
                  <div className="flex items-start justify-between">
                    <span className="px-2.5 py-0.5 rounded-full border text-[10px] font-extrabold bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> WebRTC RTCPeerConnection
                    </span>

                    {/* LIVE NOW Tag vs SCHEDULED Badge */}
                    {isLiveNow ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-red-600 text-white animate-pulse flex items-center gap-1.5 shadow-sm">
                        <Radio className="w-3.5 h-3.5" /> LIVE NOW
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-200 text-gray-700">
                        SCHEDULED
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm mt-3">{lc.title}</h3>
                  <div className="text-xs text-gray-500 mt-1 font-medium">{lc.batchName}</div>

                  <div className="mt-4 space-y-2 text-xs text-gray-600">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      <span>{lc.scheduledTime} ({lc.durationMins} Mins)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-gray-400" />
                      <span>Instructor: {lc.instructorName}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-gray-200/80 flex items-center justify-between gap-2">
                  {/* Instructor/Admin Toggle Status Button */}
                  {canManageStatus && (
                    <button
                      onClick={() => handleToggleGoLive(lc.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-200 flex items-center gap-1 ${
                        isLiveNow
                          ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                          : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                      }`}
                      title={isLiveNow ? 'End Live Session' : 'Start Session Live'}
                    >
                      <Play className="w-3 h-3 fill-current" />
                      {isLiveNow ? 'End Live' : 'Go Live Now'}
                    </button>
                  )}

                  {/* Enter Room Button: ONLY ACTIVE IF LIVE NOW */}
                  {isLiveNow ? (
                    <button
                      onClick={() => setActiveStudioClass(lc)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-200 shadow-md shadow-red-500/20"
                    >
                      <Video className="w-3.5 h-3.5" /> Enter Classroom Studio
                    </button>
                  ) : (
                    <button
                      disabled
                      className="px-4 py-2 bg-gray-200 text-gray-400 text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-not-allowed"
                    >
                      <Video className="w-3.5 h-3.5 opacity-50" /> Session Pending
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* FULL-SCREEN WEBRTC P2P LIVE CLASSROOM STUDIO */
        <div className={`bg-slate-900 text-white rounded-2xl overflow-hidden shadow-dropdown border border-slate-800 flex flex-col ${isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'h-[740px]'}`}>
          {/* Header Bar */}
          <div className="h-14 bg-slate-950 px-4 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-red-500 text-white animate-pulse">
                <Radio className="w-3 h-3" /> REC &bull; WEBRTC P2P STUDIO
              </span>
              <div>
                <h2 className="font-bold text-xs text-white tracking-wide">{activeStudioClass.title}</h2>
                <div className="text-[10px] text-slate-400">{activeStudioClass.batchName} &bull; Instructor: {activeStudioClass.instructorName}</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1 rounded-xl text-xs">
                <Volume2 className={`w-3.5 h-3.5 ${isMicOn && audioLevel > 5 ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
                <span className="text-[10px] text-slate-400 font-mono">Voice Level:</span>
                <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-100"
                    style={{ width: isMicOn ? `${audioLevel}%` : '0%' }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-200"
                  title="Toggle Fullscreen"
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setActiveStudioClass(null)}
                  className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1 transition-200 shadow-md shadow-rose-600/20"
                >
                  <X className="w-3.5 h-3.5" /> Leave Classroom
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 flex overflow-hidden">
            <div className="flex-1 flex flex-col justify-between p-4 bg-slate-900 relative">
              {hardwareError && (
                <div className="mb-2 p-2 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-[11px] flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{hardwareError}</span>
                </div>
              )}

              <div className="flex-1 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 relative flex items-center justify-center">
                {isScreenSharing ? (
                  <div className="w-full h-full relative bg-black flex items-center justify-center">
                    <video
                      ref={screenShareVideoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute top-3 left-3 bg-blue-600/90 text-white px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md">
                      <Monitor className="w-3.5 h-3.5" /> Live Display Media Output (Screen Share Active)
                    </div>
                  </div>
                ) : isVideoOn ? (
                  <div className="w-full h-full relative">
                    <video
                      ref={localVideoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover transform -scale-x-100"
                    />
                    <div className="absolute bottom-4 left-4 bg-slate-950/80 backdrop-blur-xs px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 border border-slate-700">
                      <span className={`w-2.5 h-2.5 rounded-full ${audioLevel > 5 && isMicOn ? 'bg-emerald-500 animate-ping' : 'bg-blue-500'}`} />
                      <span>{currentUser.firstName} {currentUser.lastName} (Local Presenter Stage)</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-2">
                    <VideoOff className="w-12 h-12 text-slate-600 mx-auto" />
                    <div className="text-xs text-slate-400 font-medium">Camera Video Feed Muted</div>
                  </div>
                )}

                <div className="absolute top-4 right-4 w-40 h-28 bg-slate-900 border-2 border-blue-500 rounded-2xl overflow-hidden shadow-2xl">
                  {isVideoOn && localStream ? (
                    <video
                      ref={(el) => {
                        if (el && localStream) {
                          el.srcObject = localStream;
                          el.play().catch(console.warn);
                        }
                      }}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover transform -scale-x-100"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-500 font-bold bg-slate-950">
                      Self Preview
                    </div>
                  )}
                  <div className="absolute bottom-1 left-1.5 text-[9px] bg-slate-950/90 text-white px-1.5 py-0.5 rounded font-mono">
                    {currentUser.firstName} (You)
                  </div>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-4 gap-3">
                {remotePeers.length === 0 ? (
                  <div className="col-span-4 p-3 bg-slate-950 border border-slate-800 rounded-xl text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                    <Users className="w-4 h-4 text-blue-500 animate-bounce" />
                    <span>Waiting for another browser tab / user to join room. Open another window or click "Simulate Peer" to stream live!</span>
                  </div>
                ) : (
                  remotePeers.map((peer) => (
                    <div key={peer.peerId} className="bg-slate-950 border-2 border-emerald-500/60 rounded-xl h-24 relative overflow-hidden flex items-center justify-center shadow-lg">
                      <video
                        ref={(el) => {
                          if (el && peer.stream) {
                            el.srcObject = peer.stream;
                            el.play().catch(console.warn);
                          }
                        }}
                        autoPlay
                        playsInline
                        muted={false}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-1 left-1.5 flex items-center gap-1 text-[9px] bg-slate-950/90 text-white px-1.5 py-0.5 rounded border border-slate-700 shadow-xs">
                        <Volume2 className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
                        <span className="truncate max-w-[90px] font-bold">{peer.peerName}</span>
                      </div>
                      <span className="absolute top-1 left-1 px-1.5 py-0.2 bg-emerald-600 text-white text-[8px] font-extrabold rounded">
                        LIVE WEBRTC P2P
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="w-80 border-l border-slate-800 bg-slate-950 flex flex-col justify-between">
              <div className="flex items-center border-b border-slate-800 bg-slate-900">
                <button
                  onClick={() => setActiveSidePanel('chat')}
                  className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-1.5 transition-200 ${
                    activeSidePanel === 'chat' ? 'text-blue-400 border-b-2 border-blue-500 bg-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" /> Chat
                </button>
                <button
                  onClick={() => setActiveSidePanel('people')}
                  className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-1.5 transition-200 ${
                    activeSidePanel === 'people' ? 'text-blue-400 border-b-2 border-blue-500 bg-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" /> Peers ({totalAttendeesCount})
                </button>
                <button
                  onClick={() => setActiveSidePanel('whiteboard')}
                  className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-1.5 transition-200 ${
                    activeSidePanel === 'whiteboard' ? 'text-blue-400 border-b-2 border-blue-500 bg-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <PenTool className="w-3.5 h-3.5" /> Board
                </button>
              </div>

              {activeSidePanel === 'chat' && (
                <div className="flex-1 flex flex-col justify-between p-3 min-h-0">
                  <div className="space-y-3 overflow-y-auto flex-1 pr-1">
                    {chatMessages.map((msg) => (
                      <div key={msg.id} className="space-y-0.5 text-xs">
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${msg.isHost ? 'text-blue-400' : 'text-slate-300'}`}>
                            {msg.sender}
                          </span>
                          <span className="text-[9px] text-slate-500">{msg.time}</span>
                        </div>
                        <p className="text-slate-300 bg-slate-900 p-2.5 rounded-xl border border-slate-800/80 leading-relaxed">
                          {msg.text}
                        </p>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleSendChat} className="pt-2 flex gap-2">
                    <input
                      type="text"
                      placeholder="Type chat message..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                    <button type="submit" className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-200">
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              )}

              {activeSidePanel === 'people' && (
                <div className="p-3 space-y-3 overflow-y-auto flex-1 text-xs">
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    WebRTC Peer Connections ({totalAttendeesCount})
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-blue-500/40 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white text-xs">{currentUser.firstName} {currentUser.lastName} (You)</div>
                      <div className="text-[10px] text-blue-400 font-semibold">{role} &bull; Local Media Stream</div>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>

                  {remotePeers.map((peer) => (
                    <div key={peer.peerId} className="p-3 rounded-xl bg-slate-900 border border-emerald-500/40 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-white text-xs">{peer.peerName}</div>
                        <div className="text-[10px] text-emerald-400 font-mono">RTCPeerConnection &bull; Stream Active</div>
                      </div>
                      <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" />
                    </div>
                  ))}
                </div>
              )}

              {activeSidePanel === 'whiteboard' && (
                <div className="p-3 flex-1 flex flex-col justify-between space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">Interactive Whiteboard</span>
                    <button onClick={clearCanvas} className="text-rose-400 hover:underline flex items-center gap-1 text-[11px]">
                      <Trash2 className="w-3 h-3" /> Clear
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {['#2563EB', '#16A34A', '#DC2626', '#FFFFFF', '#F59E0B'].map((c) => (
                      <button
                        key={c}
                        onClick={() => setDrawColor(c)}
                        className={`w-6 h-6 rounded-full border-2 ${drawColor === c ? 'border-white scale-110' : 'border-transparent'}`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>

                  <div className="flex-1 bg-white rounded-xl overflow-hidden border border-slate-700 cursor-crosshair">
                    <canvas
                      ref={canvasRef}
                      width={280}
                      height={340}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="h-16 bg-slate-950 border-t border-slate-800 px-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={toggleMicrophone}
                className={`p-3 rounded-xl border transition-200 ${
                  isMicOn ? 'bg-slate-900 border-slate-700 text-white hover:bg-slate-800' : 'bg-rose-600 text-white border-rose-500'
                }`}
                title={isMicOn ? 'Mute Microphone' : 'Unmute Microphone'}
              >
                {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </button>

              <button
                onClick={toggleCamera}
                className={`p-3 rounded-xl border transition-200 ${
                  isVideoOn ? 'bg-slate-900 border-slate-700 text-white hover:bg-slate-800' : 'bg-rose-600 text-white border-rose-500'
                }`}
                title={isVideoOn ? 'Turn Off Camera' : 'Turn On Camera'}
              >
                {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={startScreenShare}
                className={`px-5 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-200 ${
                  isScreenSharing
                    ? 'bg-rose-600 text-white border-rose-500 shadow-md animate-pulse'
                    : 'bg-blue-600 hover:bg-blue-700 text-white border-blue-500 shadow-md shadow-blue-500/20'
                }`}
              >
                <Monitor className="w-4 h-4" /> {isScreenSharing ? 'Stop Screen Share' : 'Share Screen (getDisplayMedia)'}
              </button>

              <button
                onClick={addSimulatedPeer}
                className="px-4 py-2.5 rounded-xl border border-indigo-500/50 bg-indigo-900/40 hover:bg-indigo-900/80 text-indigo-200 text-xs font-bold flex items-center gap-1.5 transition-200 shadow-md"
                title="Add simulated participant for instant single-window testing"
              >
                <UserPlus className="w-4 h-4 text-indigo-400" /> Simulate Peer
              </button>

              <button
                onClick={() => setHandRaised(!handRaised)}
                className={`px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-200 ${
                  handRaised
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-extrabold'
                    : 'bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Hand className="w-4 h-4" /> {handRaised ? 'Hand Raised' : 'Raise Hand'}
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
              <CheckCircle2 className="w-4 h-4" /> WebRTC P2P Stream Active ({totalAttendeesCount} Peers)
            </div>
          </div>
        </div>
      )}

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Schedule In-App Native Classroom Session"
      >
        <form onSubmit={handleCreateClass} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Session Topic Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. System Design & WebRTC Live Studio"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Scheduled Date & Time</label>
              <input
                type="text"
                required
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Duration (Minutes)</label>
              <input
                type="number"
                required
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 bg-gray-100 rounded-xl text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold"
            >
              Launch Live Studio
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
