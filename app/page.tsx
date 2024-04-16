import ChatSection from "./components/ChatSection";
import GlassmorphicCard from "./components/GlassmorphicCard";
import ImageGenerator from "./components/ImageGenerator";

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8 lg:py-16 flex-grow">
      <section className="layout">
        <p className="text-xl text-gray-300 mb-12">
          Unleash your imagination with AI-powered chat and images.
        </p>
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
          <div className="lg:w-1/2">
            <GlassmorphicCard title="Chat with AI">
              <ChatSection />
            </GlassmorphicCard>
          </div>

          <div className="lg:w-1/2">
            <GlassmorphicCard title="Generate Images">
              <ImageGenerator />
            </GlassmorphicCard>
          </div>
        </div>
      </section>
    </main>
  );
}
