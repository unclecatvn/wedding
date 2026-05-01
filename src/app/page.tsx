import { CinematicWeddingPage } from "@/components/CinematicWeddingPage";
import { getWeddingContent } from "@/lib/wedding";

export default async function Home() {
  const wedding = await getWeddingContent();

  return <CinematicWeddingPage wedding={wedding} />;
}
