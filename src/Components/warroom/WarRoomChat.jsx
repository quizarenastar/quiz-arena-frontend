import { useState, useRef, useEffect } from 'react';
import { Send, MessageSquare } from 'lucide-react';

export default function WarRoomChat({ messages, onSend, currentUserId }) {
    const [input, setInput] = useState('');
    const bottomRef = useRef(null);
    const containerRef = useRef(null);

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        onSend(input.trim());
        setInput('');
    };

    return (
        <div
            className='flex flex-col h-full rounded-xl overflow-hidden'
            style={{
                background: 'rgba(15, 15, 25, 0.6)',
                border: '1px solid rgba(139, 92, 246, 0.15)',
            }}
        >
            {/* Header */}
            <div
                className='flex items-center gap-2 px-4 py-3'
                style={{
                    borderBottom: '1px solid rgba(139, 92, 246, 0.1)',
                    background: 'rgba(20, 20, 35, 0.8)',
                }}
            >
                <MessageSquare size={16} style={{ color: '#8b5cf6' }} />
                <span
                    className='text-sm font-semibold'
                    style={{ color: '#e2e8f0' }}
                >
                    Chat
                </span>
                <span
                    className='text-xs ml-auto'
                    style={{ color: '#64748b' }}
                >
                    {messages.length} messages
                </span>
            </div>

            {/* Messages */}
            <div
                ref={containerRef}
                className='flex-1 overflow-y-auto px-3 py-2 space-y-2'
                style={{ minHeight: 0 }}
            >
                {messages.length === 0 && (
                    <p
                        className='text-center text-xs py-8'
                        style={{ color: '#475569' }}
                    >
                        No messages yet. Say hello! 👋
                    </p>
                )}
                {messages.map((msg, idx) => {
                    if (msg.type === 'system') {
                        return (
                            <div
                                key={msg._id || idx}
                                className='text-center py-1'
                            >
                                <span
                                    className='text-xs px-3 py-1 rounded-full inline-block'
                                    style={{
                                        background:
                                            'rgba(139, 92, 246, 0.1)',
                                        color: '#a78bfa',
                                    }}
                                >
                                    {msg.message}
                                </span>
                            </div>
                        );
                    }

                    const isMe =
                        msg.userId === currentUserId;

                    return (
                        <div
                            key={msg._id || idx}
                            className={`flex gap-2 ${isMe ? 'flex-row-reverse' : ''}`}
                        >
                            {/* Avatar */}
                            <div
                                className='w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold'
                                style={{
                                    background: isMe
                                        ? 'linear-gradient(135deg, #8b5cf6, #6d28d9)'
                                        : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                                    color: '#fff',
                                }}
                            >
                                {msg.profilePicture ? (
                                    <img
                                        src={msg.profilePicture}
                                        alt=''
                                        className='w-full h-full rounded-full object-cover'
                                    />
                                ) : (
                                    msg.username?.charAt(0)?.toUpperCase() || '?'
                                )}
                            </div>

                            {/* Bubble */}
                            <div
                                className={`max-w-[75%] ${isMe ? 'text-right' : ''}`}
                            >
                                {!isMe && (
                                    <span
                                        className='text-xs font-medium block mb-0.5'
                                        style={{ color: '#8b5cf6' }}
                                    >
                                        {msg.username}
                                    </span>
                                )}
                                <div
                                    className='px-3 py-2 rounded-xl text-sm break-words'
                                    style={{
                                        background: isMe
                                            ? 'linear-gradient(135deg, rgba(139,92,246,0.3), rgba(109,40,217,0.3))'
                                            : 'rgba(30, 30, 50, 0.8)',
                                        color: '#e2e8f0',
                                        borderBottomRightRadius: isMe
                                            ? '4px'
                                            : '12px',
                                        borderBottomLeftRadius: isMe
                                            ? '12px'
                                            : '4px',
                                    }}
                                >
                                    {msg.message}
                                </div>
                                <span
                                    className='text-xs mt-0.5 block'
                                    style={{ color: '#475569' }}
                                >
                                    {msg.createdAt
                                        ? new Date(
                                              msg.createdAt
                                          ).toLocaleTimeString([], {
                                              hour: '2-digit',
                                              minute: '2-digit',
                                          })
                                        : ''}
                                </span>
                            </div>
                        </div>
                    );
                })}
                <div ref={bottomRef} />
            </div>

            {/* Input */}
            <form
                onSubmit={handleSend}
                className='flex items-center gap-2 px-3 py-2'
                style={{
                    borderTop: '1px solid rgba(139, 92, 246, 0.1)',
                    background: 'rgba(20, 20, 35, 0.8)',
                }}
            >
                <input
                    type='text'
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder='Type a message...'
                    maxLength={500}
                    className='flex-1 px-3 py-2 rounded-lg text-sm outline-none'
                    style={{
                        background: 'rgba(30, 30, 50, 0.8)',
                        border: '1px solid rgba(139, 92, 246, 0.15)',
                        color: '#e2e8f0',
                    }}
                    onFocus={(e) =>
                        (e.target.style.borderColor =
                            'rgba(139, 92, 246, 0.5)')
                    }
                    onBlur={(e) =>
                        (e.target.style.borderColor =
                            'rgba(139, 92, 246, 0.15)')
                    }
                />
                <button
                    type='submit'
                    disabled={!input.trim()}
                    className='p-2 rounded-lg transition-all disabled:opacity-30 cursor-pointer'
                    style={{
                        background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
                    }}
                >
                    <Send size={16} color='#fff' />
                </button>
            </form>
        </div>
    );
}
