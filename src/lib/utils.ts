import { getCollection, type CollectionEntry } from "astro:content";

export type BlogPost = CollectionEntry<"blog">;

export interface BlogTagStat {
  tag: string;
  count: number;
}

let sortedBlogPostsPromise: Promise<BlogPost[]> | undefined;
let sortedBlogTagsPromise: Promise<BlogTagStat[]> | undefined;

function sortPostsByDateDesc(a: BlogPost, b: BlogPost) {
  return b.data.date.getTime() - a.data.date.getTime();
}

export function getSortedBlogPosts() {
  sortedBlogPostsPromise ??= getCollection("blog").then((posts) =>
    posts.slice().sort(sortPostsByDateDesc)
  );

  return sortedBlogPostsPromise;
}

export async function getLatestBlogPosts(limit = 10) {
  return (await getSortedBlogPosts()).slice(0, limit);
}

export async function getPostsByTag(tag: string) {
  return (await getSortedBlogPosts()).filter((post) =>
    post.data.tags?.includes(tag)
  );
}

export function getSortedBlogTags() {
  sortedBlogTagsPromise ??= getSortedBlogPosts().then((posts) => {
    const tagCounts = new Map<string, number>();

    for (const post of posts) {
      for (const tag of post.data.tags ?? []) {
        tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
      }
    }

    return Array.from(tagCounts.entries())
      .sort(([aName, aCount], [bName, bCount]) => {
        if (aCount === bCount) {
          return aName.localeCompare(bName);
        }

        return bCount - aCount;
      })
      .map(([tag, count]) => ({ tag, count }));
  });

  return sortedBlogTagsPromise;
}
