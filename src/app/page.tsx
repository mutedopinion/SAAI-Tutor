import { ChatInterface } from '@/components/chat-interface';

export default function Home() {
  return (
    <div className="flex flex-col h-full">
      <header className="p-4 border-b">
        <h1 className="text-xl font-bold font-headline">SAAI Tutor</h1>
      </header>
      <main className="flex-1 overflow-hidden">
        <ChatInterface />
      </main>
    </div>
  );
}
