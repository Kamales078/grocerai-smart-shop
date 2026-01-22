import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, X, Send, Sparkles, ShoppingCart, ListPlus, Lightbulb } from 'lucide-react';

const quickSuggestions = [
  { icon: ShoppingCart, text: 'Add milk to cart' },
  { icon: ListPlus, text: 'Create party list' },
  { icon: Lightbulb, text: 'Recipe suggestions' },
];

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hi! I\'m your AI shopping assistant. I can help you find products, create shopping lists, or suggest recipes based on what you\'re buying. How can I help you today?',
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
          content: `I found some great options for "${message}". Would you like me to add them to your cart? I can also suggest complementary products!`,
        },
      ]);
    }, 1000);
    setMessage('');
  };

  const handleQuickAction = (text: string) => {
    setMessage(text);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-elevated z-50"
        size="icon"
      >
        <Sparkles className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 card-elevated shadow-elevated animate-slide-up z-50 flex flex-col max-h-[500px]">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b bg-primary text-primary-foreground rounded-t-xl">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          <div>
            <span className="font-medium text-sm">AI Shopping Assistant</span>
            <p className="text-xs text-primary-foreground/70">Powered by GrocerAI</p>
          </div>
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

      {/* Messages */}
      <div className="flex-1 overflow-auto p-3 space-y-3 min-h-[200px] max-h-[300px]">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
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

      {/* Quick Suggestions */}
      <div className="px-3 py-2 border-t flex gap-2 overflow-x-auto">
        {quickSuggestions.map((suggestion, i) => (
          <Button
            key={i}
            variant="outline"
            size="sm"
            className="shrink-0 text-xs"
            onClick={() => handleQuickAction(suggestion.text)}
          >
            <suggestion.icon className="h-3 w-3 mr-1" />
            {suggestion.text}
          </Button>
        ))}
      </div>

      {/* Input */}
      <div className="p-3 border-t flex gap-2">
        <Input
          placeholder="Ask me anything..."
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
