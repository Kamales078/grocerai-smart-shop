import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hi! I can help you shop. Try "Add milk" or "Create a party list"',
    },
  ]);

  const handleSend = () => {
    if (!message.trim()) return;
    setMessages(prev => [...prev, { role: 'user', content: message }]);
    // Mock AI response
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: `I found some great options for "${message}". Would you like me to add them to your cart?`,
        },
      ]);
    }, 1000);
    setMessage('');
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-elevated"
        size="icon"
      >
        <Sparkles className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 card-elevated shadow-elevated animate-slide-up z-50">
      <div className="flex items-center justify-between p-3 border-b bg-primary text-primary-foreground rounded-t-xl">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          <span className="font-medium text-sm">AI Assistant</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-primary-foreground hover:bg-primary-foreground/20"
          onClick={() => setIsOpen(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="h-64 overflow-auto p-3 space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 border-t flex gap-2">
        <Input
          placeholder="Type or speak..."
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          className="flex-1"
        />
        <Button size="icon" onClick={handleSend}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
