export function NewsletterSignup() {
  return (
    <section
      data-testid="newsletter-signup"
      className="mb-[22px] flex items-center justify-between gap-5 rounded-[5px] border border-[#d2d3cf] dark:border-[#3a3a45] bg-[#f8f8f5] dark:bg-[#1f1f27] px-5 py-4"
    >
      <div>
        <h2 className="text-[13px] font-bold text-[#111111] dark:text-[#f5f5f5]">
          Stay Informed. Stay Balanced.
        </h2>
        <p className="mt-1 text-[10px] text-[#4d4d4d] dark:text-[#a0aec0]">
          Get the top stories and bias analysis delivered to your inbox.
        </p>
      </div>

      <form className="flex gap-2">
        <input
          type="email"
          placeholder="Enter your email"
          aria-label="Email address"
          className="h-8 w-48 rounded-[4px] border border-[#b9bab7] dark:border-[#4b5563] bg-white dark:bg-[#1f1f27] px-3 text-[10px] text-[#111111] dark:text-[#f5f5f5] outline-none focus-visible:ring-2 focus-visible:ring-[#123f91]"
        />
        <button
          type="submit"
          className="h-8 rounded-[4px] bg-[#111111] dark:bg-[#f5f5f5] px-4 text-[10px] font-semibold text-white hover:opacity-82"
        >
          Subscribe
        </button>
      </form>
    </section>
  );
}