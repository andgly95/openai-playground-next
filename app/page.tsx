import ChatSection from "./components/ChatSection";
import ImageGenerator from "./components/ImageGenerator";

export default function Home() {
  return (
    <main className="container mx-auto p-4 lg:py-40">
      <section className="layout">
        <h1 className="text-4xl font-bold mb-8 text-white">OpenAI API Demo</h1>
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
          <div className="w-full lg:w-1/3">
            <ChatSection />
          </div>
          <div className="w-full lg:w-2/3">
            <ImageGenerator />
          </div>
        </div>
      </section>
    </main>
  );
}
