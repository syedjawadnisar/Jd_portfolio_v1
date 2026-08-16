import { permanentRedirect } from "next/navigation";

// The scroll experience is now the default behavior of "/". Old /explore
// links (shared, indexed, bookmarked) resolve there with a 308.
export default function ExplorePage(): never {
  permanentRedirect("/");
}
