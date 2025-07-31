
import { BLOG_ARTICLES } from './data';

export function getArticleBySlug(slug: string) {
  return BLOG_ARTICLES.find(article => article.url === `/blog/${slug}`);
}

    