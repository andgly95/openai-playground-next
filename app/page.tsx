import ChatSection from "./components/ChatSection";
import ImageGenerator from "./components/ImageGenerator";

export default function Home() {
  return (
  <main className="container mx-auto py-40">
    <section className="layout">
      <h1 className="text-4xl font-bold mb-8">OpenAI API Demo</h1>
      <div className="flex">
        <div className="w-1/2">
          <ChatSection />
        </div>
        <div className="w-1/2">
          <ImageGenerator />
        </div>
      </div>
    </section>
    </main>
  );
}
