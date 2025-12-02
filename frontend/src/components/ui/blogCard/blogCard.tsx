import Link from "next/link";
import styles from "./blogCard.module.scss";
import blogData from "@/data/blogData.json";

interface CardProps {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  author: string;
  readTime: string;
  imageUrl?: string;
  slug: string;
}

function BlogCard({
  id,
  title,
  excerpt,
  category,
  date,
  author,
  readTime,
  imageUrl,
  slug,
}: CardProps) {
  return (
    <Link href={`/blog/${slug}`} className={styles.blogCard}>
      <div className={styles.imageContainer}>
        {imageUrl ? (
          <img src={imageUrl} alt={title} />
        ) : (
          <div className={styles.imagePlaceholder}>Изображение статьи</div>
        )}
      </div>

      <div className={styles.content}>
        <div className={styles.meta}>
          <span className={styles.category}>{category}</span>
          <span className={styles.date}>📅 {date}</span>
        </div>

        <h3 className={styles.title}>{title}</h3>
        <p className={styles.excerpt}>{excerpt}</p>

        <div className={styles.footer}>
          <span className={styles.readTime}>⏱️ {readTime}</span>
        </div>
      </div>
    </Link>
  );
}

export default function BlogGrid() {
  if (!blogData.posts || blogData.posts.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>Нет статей для отображения</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {blogData.posts.map((post) => (
          <BlogCard key={post.id} {...post} />
        ))}
      </div>
    </div>
  );
}
