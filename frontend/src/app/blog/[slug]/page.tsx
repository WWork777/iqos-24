import { notFound } from "next/navigation";
import BreadCrumbs from "@/components/common/breadcrums";
import styles from "./article.module.scss";
import blogData from "@/data/blogData.json";

// Генерируем статические параметры для SSG
export async function generateStaticParams() {
  return blogData.posts.map((post) => ({
    slug: post.slug,
  }));
}

// Получаем данные статьи по slug
function getArticleData(slug: string) {
  return blogData.posts.find((post) => post.slug === slug);
}

// Функция для преобразования даты в правильный формат
function parseDate(dateString: string): Date {
  // Преобразуем "06 ноября 2025" в "06 November 2025"
  const months: { [key: string]: string } = {
    января: "January",
    февраля: "February",
    марта: "March",
    апреля: "April",
    мая: "May",
    июня: "June",
    июля: "July",
    августа: "August",
    сентября: "September",
    октября: "October",
    ноября: "November",
    декабря: "December",
  };

  const parts = dateString.split(" ");
  if (parts.length === 3) {
    const [day, monthRu, year] = parts;
    const monthEn = months[monthRu];
    if (monthEn) {
      return new Date(`${monthEn} ${day}, ${year}`);
    }
  }

  // Если не удалось распарсить, используем текущую дату
  return new Date();
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleData(slug);

  if (!article) {
    notFound();
  }

  // Генерируем JSON-LD структурированные данные
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.excerpt,
    image: article.imageUrl
      ? `https://iqos-24.ru${article.imageUrl}`
      : undefined,
    datePublished: parseDate(article.date).toISOString(),
    dateModified: new Date().toISOString(),
    author: {
      "@type": "Person",
      name: article.author,
    },
    publisher: {
      "@type": "Organization",
      name: "Ваш сайт IQOS",
      logo: {
        "@type": "ImageObject",
        url: "https://iqos-24.ru/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://iqos-24.ru/blog/${article.slug}`,
    },
    keywords: [
      "IQOS",
      "ILUMA",
      "TEREA",
      "технология нагревания табака",
      article.category,
    ],
    articleSection: article.category,
    articleBody: article.content
      ?.map((block) => block.text || "")
      .filter((text) => text.length > 0)
      .join(" ")
      .substring(0, 5000),
  };

  return (
    <section className="hero-container">
      {/* Добавляем структурированные данные для SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className={"second_page_header"}>
        <BreadCrumbs
          items={[
            { label: "Главная", href: "/" },
            { label: "Блог", href: "/blog" },
            { label: article.title },
          ]}
        />
      </div>

      <article
        className={styles.article}
        itemScope
        itemType="https://schema.org/BlogPosting"
      >
        <header className={styles.articleHeader}>
          <div className={styles.meta}>
            <span className={styles.category} itemProp="articleSection">
              {article.category}
            </span>
            <span className={styles.date}>
              📅{" "}
              <time
                itemProp="datePublished"
                dateTime={parseDate(article.date).toISOString()}
              >
                {article.date}
              </time>
            </span>
            <span className={styles.readTime}>⏱️ {article.readTime}</span>
          </div>

          <h1 className={styles.title} itemProp="headline">
            {article.title}
          </h1>
          <p className={styles.excerpt} itemProp="description">
            {article.excerpt}
          </p>

          <div
            className={styles.author}
            itemProp="author"
            itemScope
            itemType="https://schema.org/Person"
          >
            <meta itemProp="name" content={article.author} />
            <span>Автор: {article.author}</span>
          </div>
        </header>

        <div className={styles.articleImage} itemProp="image">
          {article.imageUrl ? (
            <img src={article.imageUrl} alt={article.title} itemProp="image" />
          ) : (
            <div className={styles.imagePlaceholder}>Изображение статьи</div>
          )}
        </div>

        <div className={styles.articleContent} itemProp="articleBody">
          {article.content?.map((block, index) => {
            if (!block) return null;

            switch (block.type) {
              case "paragraph":
                return block.text ? <p key={index}>{block.text}</p> : null;
              case "heading":
                return block.text ? <h2 key={index}>{block.text}</h2> : null;
              case "list":
                return block.items ? (
                  <ul key={index}>
                    {block.items.map((item, itemIndex) => (
                      <li key={itemIndex}>{item}</li>
                    ))}
                  </ul>
                ) : null;
              default:
                return null;
            }
          })}
        </div>

        <footer className={styles.articleFooter}>
          <div className={styles.tags}>
            <span>Теги:</span>
            <button className={styles.tag} itemProp="keywords">
              IQOS
            </button>
            <button className={styles.tag} itemProp="keywords">
              ILUMA
            </button>
            <button className={styles.tag} itemProp="keywords">
              TEREA
            </button>
            <button className={styles.tag} itemProp="keywords">
              технология
            </button>
            <button className={styles.tag} itemProp="keywords">
              {article.category}
            </button>
          </div>
        </footer>
      </article>
    </section>
  );
}

// Улучшенные метаданные для SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleData(slug);

  if (!article) {
    return {
      title: "Статья не найдена",
      description: "Запрошенная статья не существует или была удалена",
    };
  }

  // Генерируем ключевые слова на основе контента
  const generateKeywords = () => {
    const baseKeywords = [
      "IQOS",
      "ILUMA",
      "TEREA",
      "технология нагревания табака",
      "альтернатива курению",
      "стики",
      "табак",
    ];

    const contentKeywords =
      article.content
        ?.map((block) => {
          if (
            (block.type === "paragraph" || block.type === "heading") &&
            block.text
          ) {
            return block.text
              .toLowerCase()
              .split(" ")
              .filter((word) => word.length > 4)
              .slice(0, 10);
          }
          return [];
        })
        .flat() || [];

    return [
      ...new Set([...baseKeywords, ...contentKeywords, article.category]),
    ].join(", ");
  };

  // Генерируем OG изображение
  const ogImage = article.imageUrl
    ? {
        url: `https://iqos-24.ru${article.imageUrl}`,
        width: 1200,
        height: 630,
        alt: article.title,
      }
    : {
        url: "https://iqos-24.ru/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Блог о IQOS ILUMA и TEREA",
      };

  return {
    title: `${article.title} | Блог о IQOS ILUMA и TEREA`,
    description: article.excerpt,
    keywords: generateKeywords(),

    // Open Graph метатеги для социальных сетей
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: parseDate(article.date).toISOString(),
      authors: [article.author],
      tags: ["IQOS", "ILUMA", "TEREA", article.category],
      images: [ogImage],
      url: `https://iqos-24.ru/blog/${article.slug}`,
      siteName: "Ваш сайт IQOS",
    },

    // Twitter Card метатеги
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [ogImage.url],
      creator: "@yourtwitterhandle",
      site: "@yourtwitterhandle",
    },

    // Дополнительные метатеги
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    // Canonical URL
    alternates: {
      canonical: `https://iqos-24.ru/blog/${article.slug}`,
    },

    // Дополнительная информация для поисковых систем
    other: {
      "application-name": "Блог о IQOS ILUMA",
      generator: "Next.js",
      referrer: "origin-when-cross-origin",
      "color-scheme": "light only",

      // Язык и регион
      language: "ru",
      "content-language": "ru-RU",

      // Географическая привязка
      "geo.region": "RU",
      "geo.placename": "Москва",
      "geo.position": "55.755826;37.6173",

      // Бизнес информация
      "business:contact_data:locality": "Москва",
      "business:contact_data:country_name": "Россия",

      // Продуктовая информация
      "product:brand": "IQOS",
      "product:availability": "in_stock",
      "product:condition": "new",
      "product:price:amount": "0",
      "product:price:currency": "RUB",
    },
  };
}
