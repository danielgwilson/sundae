import { CreatorPage } from "@/components/creator/creator-page";
import { DEMO_BLOCKS, DEMO_PROFILE } from "@/lib/demo";

export default function DemoPage() {
  return (
    <CreatorPage
      profile={DEMO_PROFILE}
      blocks={DEMO_BLOCKS}
      linkMode="direct"
      disableAnalytics
    />
  );
}
