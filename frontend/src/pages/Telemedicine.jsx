import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import SimplePeer from 'simple-peer';
import API_URL from '../config/api';

export default function Telemedicine() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const { token, userRole } = useAuth();
  const socket = useSocket();
  const [session, setSession] = useState(null);
  const [peer, setPeer] = useState(null);
  const [stream, setStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState('');
  const [notes, setNotes] = useState('');
  const [callActive, setCallActive] = useState(false);
  
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();

  useEffect(() => {
    fetchSession();
    initializeMedia();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (peer) {
        peer.destroy();
      }
    };
  }, []);

  const fetchSession = async () => {
    try {
      const response = await fetch(`${API_URL}/api/telemedicine/appointment/${appointmentId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setSession(data);
        if (socket) {
          socket.emit('join-room', data.roomId, token);
        }
      }
    } catch (err) {
      console.error('Error fetching session:', err);
    }
  };

  const initializeMedia = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      setStream(mediaStream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Error accessing media devices:', err);
      alert('Please allow camera and microphone access');
    }
  };

  const startCall = async () => {
    if (!stream || !session) return;

    const newPeer = new SimplePeer({
      initiator: userRole === 'doctor',
      trickle: false,
      stream: stream
    });

    newPeer.on('signal', (data) => {
      if (socket) {
        socket.emit(userRole === 'doctor' ? 'offer' : 'answer', session.roomId, data);
      }
    });

    newPeer.on('stream', (remoteStream) => {
      setRemoteStream(remoteStream);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
    });

    setPeer(newPeer);
    setCallActive(true);

    await fetch(`${API_URL}/api/telemedicine/${session.sessionId}/start`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
  };

  const endCall = async () => {
    if (peer) {
      peer.destroy();
    }
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    
    await fetch(`${API_URL}/api/telemedicine/${session.sessionId}/end`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        doctorNotes: notes,
        aiSummary: 'Session completed successfully'
      })
    });

    navigate(userRole === 'doctor' ? '/doctor-admin' : '/patient-dashboard');
  };

  const sendMessage = async () => {
    if (!message.trim() || !session) return;

    const chatMessage = {
      senderId: token,
      senderType: userRole,
      message,
      timestamp: new Date()
    };

    setChat([...chat, chatMessage]);
    setMessage('');

    if (socket) {
      socket.emit('send-message', session.roomId, chatMessage);
    }

    await fetch(`${API_URL}/api/telemedicine/${session.sessionId}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        message,
        senderType: userRole
      })
    });
  };

  useEffect(() => {
    if (socket) {
      socket.on('receive-message', (msg) => {
        setChat(prev => [...prev, msg]);
      });

      socket.on('offer', (offer) => {
        if (peer) {
          peer.signal(offer);
        }
      });

      socket.on('answer', (answer) => {
        if (peer) {
          peer.signal(answer);
        }
      });
    }

    return () => {
      if (socket) {
        socket.off('receive-message');
        socket.off('offer');
        socket.off('answer');
      }
    };
  }, [socket, peer]);

  return (
    <div className="min-h-screen bg-gray-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-400 p-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-white">🎥 Video Consultation</h1>
              <button
                onClick={endCall}
                className="bg-red-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-600 transition"
              >
                End Call
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-black rounded-xl overflow-hidden relative" style={{ height: '500px' }}>
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 w-48 h-36 bg-gray-900 rounded-lg overflow-hidden">
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="flex justify-center gap-4">
                {!callActive ? (
                  <button
                    onClick={startCall}
                    className="bg-green-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-600 transition"
                  >
                    📞 Start Call
                  </button>
                ) : (
                  <>
                    <button className="bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition">
                      🎤 Mute
                    </button>
                    <button className="bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition">
                      📹 Video Off
                    </button>
                  </>
                )}
              </div>

              {userRole === 'doctor' && (
                <div className="bg-gray-800 rounded-xl p-4">
                  <h3 className="text-white font-bold mb-2">📝 Doctor Notes</h3>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-gray-700 text-white p-3 rounded-lg border-none focus:ring-2 focus:ring-cyan-500"
                    rows="4"
                    placeholder="Add consultation notes..."
                  />
                </div>
              )}
            </div>

            <div className="bg-gray-800 rounded-xl p-4 flex flex-col" style={{ height: '700px' }}>
              <h3 className="text-white font-bold mb-4">💬 Chat</h3>
              <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                {chat.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg ${
                      msg.senderType === userRole
                        ? 'bg-cyan-600 text-white ml-auto'
                        : 'bg-gray-700 text-white'
                    } max-w-[80%]`}
                  >
                    <p className="text-sm">{msg.message}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  className="flex-1 bg-gray-700 text-white p-3 rounded-lg border-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Type a message..."
                />
                <button
                  onClick={sendMessage}
                  className="bg-cyan-500 text-white px-4 py-3 rounded-lg hover:bg-cyan-600 transition"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
