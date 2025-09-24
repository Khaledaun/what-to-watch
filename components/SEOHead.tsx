"use client";
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// SEO monitoring and analytics
export function SEOHead() {
  const pathname = usePathname();

  useEffect(() => {
    // Track page views for SEO monitoring
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
        page_path: pathname,
      });
    }

    // Track Core Web Vitals (optional - requires web-vitals package)
    // if (typeof window !== 'undefined') {
    //   import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    //     getCLS(console.log);
    //     getFID(console.log);
    //     getFCP(console.log);
    //     getLCP(console.log);
    //     getTTFB(console.log);
    //   });
    // }
  }, [pathname]);

  return null;
}

// SEO-friendly image component
interface SEOImageProps {
  src: string;
  alt: string;
  title?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
}

export function SEOImage({ 
  src, 
  alt, 
  title, 
  width, 
  height, 
  priority = false,
  className 
}: SEOImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      title={title}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      className={className}
      onError={(e) => {
        // Fallback to placeholder if image fails to load
        e.currentTarget.src = '/placeholder.svg';
      }}
    />
  );
}

// SEO-friendly link component
interface SEOLinkProps {
  href: string;
  children: React.ReactNode;
  title?: string;
  className?: string;
  external?: boolean;
}

export function SEOLink({ 
  href, 
  children, 
  title, 
  className,
  external = false 
}: SEOLinkProps) {
  return (
    <a
      href={href}
      title={title}
      className={className}
      {...(external && {
        target: '_blank',
        rel: 'noopener noreferrer'
      })}
    >
      {children}
    </a>
  );
}

// Breadcrumb component for better SEO
interface BreadcrumbProps {
  items: Array<{
    name: string;
    url: string;
    current?: boolean;
  }>;
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center space-x-2 text-sm">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <span className="mx-2 text-text-muted" aria-hidden="true">
                /
              </span>
            )}
            {item.current ? (
              <span className="text-text-muted" aria-current="page">
                {item.name}
              </span>
            ) : (
              <a
                href={item.url}
                className="text-[var(--gold)] hover:text-[var(--gold-soft)] transition-colors"
              >
                {item.name}
              </a>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// FAQ component for better SEO
interface FAQProps {
  items: Array<{
    question: string;
    answer: string;
  }>;
}

export function FAQ({ items }: FAQProps) {
  return (
    <div className="space-y-6">
      {items.map((item, index) => (
        <div key={index} className="border-b border-[var(--surface-border)] pb-6">
          <h3 className="text-lg font-semibold mb-2">{item.question}</h3>
          <p className="text-text-muted">{item.answer}</p>
        </div>
      ))}
    </div>
  );
}
