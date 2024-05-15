import ChatSection from "../components/ChatSection";
import DynamicSection from "../components/DynamicSection";
import ImageGenerator from "../components/ImageGenerator";
import SpeechToTextSection from "../components/SpeechToTextSection";
import TextToSpeechSection from "../components/TextToSpeechSection";
import VoiceChatSection from "../components/VoiceChatSection";

export default function Demo() {
  return (
    <section className="layout">
      <p className="text-xl text-gray-300 mb-12">
        Unleash your imagination with AI-powered chat and images.
      </p>
      <DynamicSection></DynamicSection>
    </section>
  );
}

const Components = {
  chat: ChatSection,
  image: ImageGenerator,
  "speech-to-text": SpeechToTextSection,
  "text-to-speech": TextToSpeechSection,
  "voice-chat": VoiceChatSection,
};
