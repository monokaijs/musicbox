type ConnectMode = 'group' | 'broadcast';

interface ChatMessage {
  author: string;
  message: string;
  timestamp: number;
  type: 'text' | 'image' | 'attachment'; // just for experimental purpose
}
