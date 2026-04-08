import { useState, useRef, useEffect } from 'react';
import { Send, MessageSquare } from 'lucide-react';

export default function WarRoomChat({
    messages,
    onSend,
    currentUserId,
    hideChatHeader,
}) {
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
        <div className='flex flex-col h-full rounded-xl overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
            {/* Header */}
            {!hideChatHeader && (
                <div className='flex items-center gap-2 px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40'>
                    <MessageSquare size={16} className='text-violet-500' />
                    <span className='text-sm font-semibold text-gray-800 dark:text-gray-200'>
                        Chat
                    </span>
                    <span className='text-xs ml-auto text-gray-500 dark:text-gray-400'>
                        {messages.length} messages
                    </span>
                </div>
            )}

            {/* Messages */}
            <div
                ref={containerRef}
                className='flex-1 overflow-y-auto px-3 py-2 space-y-2'
                style={{ minHeight: 0 }}
            >
                {messages.length === 0 && (
                    <p className='text-center text-xs py-8 text-gray-500 dark:text-gray-400'>
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
                                <span className='text-xs px-3 py-1 rounded-full inline-block bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300'>
                                    {msg.message}
                                </span>
                            </div>
                        );
                    }

                    const isMe = msg.userId === currentUserId;

                    return (
                        <div
                            key={msg._id || idx}
                            className={`flex gap-2 ${isMe ? 'flex-row-reverse' : ''}`}
                        >
                            {/* Avatar */}
                            <div
                                className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white ${
                                    isMe
                                        ? 'bg-gradient-to-r from-violet-500 to-purple-600'
                                        : 'bg-gradient-to-r from-blue-500 to-blue-700'
                                }`}
                            >
                                {msg.profilePicture ? (
                                    <img
                                        src={msg.profilePicture}
                                        alt=''
                                        className='w-full h-full rounded-full object-cover'
                                    />
                                ) : (
                                    msg.username?.charAt(0)?.toUpperCase() ||
                                    '?'
                                )}
                            </div>

                            {/* Bubble */}
                            <div
                                className={`max-w-[75%] ${isMe ? 'text-right' : ''}`}
                            >
                                {!isMe && (
                                    <span className='text-xs font-medium block mb-0.5 text-violet-600 dark:text-violet-300'>
                                        {msg.username}
                                    </span>
                                )}
                                <div
                                    className={`px-3 py-2 rounded-xl text-sm break-words ${
                                        isMe
                                            ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-800 dark:text-violet-200'
                                            : 'bg-gray-100 dark:bg-gray-700/60 text-gray-800 dark:text-gray-200'
                                    }`}
                                >
                                    {msg.message}
                                </div>
                                <span className='text-xs mt-0.5 block text-gray-500 dark:text-gray-400'>
                                    {msg.createdAt
                                        ? new Date(
                                              msg.createdAt,
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
                className='flex items-center gap-2 px-3 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40'
            >
                <input
                    type='text'
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder='Type a message...'
                    maxLength={500}
                    className='flex-1 px-3 py-2 rounded-lg text-sm outline-none border border-violet-200 dark:border-violet-700/40 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent'
                />
                <button
                    type='submit'
                    disabled={!input.trim()}
                    className='p-2 rounded-lg transition-all disabled:opacity-30 cursor-pointer bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700'
                >
                    <Send size={16} color='#fff' />
                </button>
            </form>
        </div>
    );
}
