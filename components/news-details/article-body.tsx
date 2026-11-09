export function ArticleBody({ paragraphs }: { paragraphs: string[] }) {
  return (
    <article
      data-testid="article-body"
      className="mt-5 text-[13px] leading-[1.38] text-[#181818] dark:text-[#f5f5f5]"
    >
      {(paragraphs.length > 0 ? paragraphs : ["Seeded display article."]).map(
        (paragraph, index) => (
          <p key={index} className="mb-[17px] last:mb-0">
            {paragraph}
          </p>
        ),
      )}
    </article>
  );
}