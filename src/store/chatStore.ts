import { create } from 'zustand';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatState {
  messages: Message[];
  isTyping: boolean;
  addMessage: (role: 'user' | 'assistant', content: string) => void;
  setTyping: (isTyping: boolean) => void;
  clearChat: () => void;
  getAIResponse: (userMessage: string) => Promise<void>;
}

// Mock AI responses based on keywords
const getAIResponseText = (userMessage: string): string => {
  const message = userMessage.toLowerCase();
  
  // Fleet management specific responses
  if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
    return "Hello! I'm your FleetFlow AI assistant. I can help you with vehicle management, trip planning, maintenance scheduling, fuel tracking, and more. What would you like to know?";
  }
  
  if (message.includes('vehicle') && (message.includes('status') || message.includes('available'))) {
    return "I can check vehicle availability for you. Currently, you have:\n\n• 3 vehicles available for trips\n• 1 vehicle on active trip (MH-02-AB-1234)\n• 1 vehicle in maintenance (DL-01-XY-5678)\n\nWould you like detailed information about any specific vehicle?";
  }
  
  if (message.includes('maintenance') || message.includes('service')) {
    return "For maintenance scheduling:\n\n• Vehicle DL-01-XY-5678 is due for service in 500 km\n• Regular maintenance recommended every 10,000 km or 6 months\n• Urgent: Brake inspection needed for vehicle KA-03-CD-9876\n\nShall I schedule a maintenance appointment?";
  }
  
  if (message.includes('fuel') || message.includes('expense')) {
    return "Fuel analytics for this month:\n\n• Average fuel cost: ₹85,420\n• Top consuming vehicle: Tata Prima (450L)\n• Fuel efficiency: 6.2 km/L fleet average\n• Cost savings opportunity: Route optimization could save ₹12,000/month\n\nWould you like a detailed fuel report?";
  }
  
  if (message.includes('trip') || message.includes('route')) {
    return "Trip planning assistance:\n\n• Popular routes: Mumbai→Pune (3.5 hrs), Delhi→Jaipur (5 hrs)\n• Best performing drivers available: Rajesh Kumar (95% safety), Priya Sharma (92%)\n• Optimal departure time: 6 AM for minimal traffic\n\nShould I create a new trip for you?";
  }
  
  if (message.includes('driver')) {
    return "Driver management info:\n\n• 5 active drivers in your fleet\n• Average safety score: 92.4%\n• Top driver: Rajesh Kumar (95% safety, 1,250 km this week)\n• 1 driver on leave: Vikram Singh\n\nWould you like to assign a driver to a trip?";
  }
  
  if (message.includes('report') || message.includes('analytics')) {
    return "Available reports:\n\n📊 Fleet Performance Dashboard\n💰 Financial Analytics\n🛣️ Trip History & Routes\n⚡ Fuel Efficiency Trends\n🔧 Maintenance Schedule\n\nWhich report would you like me to generate?";
  }
  
  if (message.includes('help') || message.includes('what can you do')) {
    return "I can assist you with:\n\n🚛 Vehicle Management - Check status, assign vehicles\n📦 Trip Planning - Create and optimize routes\n🔧 Maintenance - Schedule services, track repairs\n⛽ Fuel Tracking - Monitor consumption and costs\n👥 Driver Management - Assign drivers, track performance\n📊 Analytics - Generate reports and insights\n⚠️ Alerts - Set up notifications for important events\n\nJust ask me anything about your fleet operations!";
  }
  
  if (message.includes('thank')) {
    return "You're welcome! I'm always here to help with your fleet management needs. Feel free to ask anything else! 😊";
  }
  
  // Default response
  return `I understand you're asking about "${userMessage}". While I'm still learning, I can help you with:\n\n• Vehicle status and availability\n• Trip planning and scheduling\n• Maintenance tracking\n• Fuel cost analysis\n• Driver assignments\n• Performance reports\n\nCould you rephrase your question or choose one of these topics?`;
};

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [
    {
      id: '1',
      role: 'assistant',
      content: "👋 Hi! I'm FleetFlow AI, your intelligent fleet management assistant. I can help you with vehicle tracking, trip planning, maintenance scheduling, and fleet analytics. How can I assist you today?",
      timestamp: new Date(),
    },
  ],
  isTyping: false,

  addMessage: (role, content) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role,
      content,
      timestamp: new Date(),
    };
    set((state) => ({
      messages: [...state.messages, newMessage],
    }));
  },

  setTyping: (isTyping) => set({ isTyping }),

  clearChat: () =>
    set({
      messages: [
        {
          id: '1',
          role: 'assistant',
          content: "Chat cleared! How can I help you with your fleet management today?",
          timestamp: new Date(),
        },
      ],
    }),

  getAIResponse: async (userMessage: string) => {
    const { addMessage, setTyping } = get();
    
    // Add user message
    addMessage('user', userMessage);
    
    // Show typing indicator
    setTyping(true);
    
    // Simulate AI thinking time
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000));
    
    // Generate and add AI response
    const response = getAIResponseText(userMessage);
    addMessage('assistant', response);
    
    // Hide typing indicator
    setTyping(false);
  },
}));
