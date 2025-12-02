import Link from "next/link";
import styles from "./breadcrums.module.scss";

interface BreadCrumbItem {
  label: string;
  href?: string;
}

interface BreadCrumbsProps {
  items: BreadCrumbItem[];
  className?: string;
}

export default function BreadCrumbs({
  items,
  className = "",
}: BreadCrumbsProps) {
  return (
    <nav className={`${styles.breadcrumbs} ${className}`}>
      <ol className={styles.breadcrumbsList}>
        {items.map((item, index) => (
          <li key={index} className={styles.breadcrumbsItem}>
            {item.href && index < items.length - 1 ? (
              <Link href={item.href} className={styles.breadcrumbsLink}>
                {item.label}
              </Link>
            ) : (
              <span className={styles.breadcrumbsCurrent}>{item.label}</span>
            )}

            {index < items.length - 1 && (
              <span className={styles.breadcrumbsSeparator}>/</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
