import Link from "next/link";
import { articleTopics, topicPath, type ArticleTopicSlug } from "@/data/article-topics";

export function TopicLinks({ exclude }: { exclude?: ArticleTopicSlug }) {
  const label = exclude ? "Chủ đề khác" : "Chủ đề cẩm nang";
  return (
    <nav aria-label={label} className="mt-8">
      <h2 className="text-lg font-bold text-ink">{label}</h2>
      <ul className="mt-3 flex flex-wrap gap-3">
        {articleTopics
          .filter((topic) => topic.slug !== exclude)
          .map((topic) => (
            <li key={topic.slug}>
              <Link
                href={topicPath(topic.slug)}
                className="inline-flex rounded-full border border-border px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50"
              >
                {topic.name}
              </Link>
            </li>
          ))}
      </ul>
    </nav>
  );
}
