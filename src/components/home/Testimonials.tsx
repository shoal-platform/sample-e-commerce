const testimonials = [
  {
    quote: "Fast checkout, clear product details, and everything arrived on time.",
    name: "Maya R.",
  },
  {
    quote: "The wishlist and cart flow makes it easy to compare what I want.",
    name: "Jordan K.",
  },
  {
    quote: "A clean store experience with the categories I actually use.",
    name: "Sam T.",
  },
];

export function Testimonials() {
  return (
    <section className="container mx-auto px-4 py-14">
      <h2 className="text-2xl font-bold">Customers Like Shopping Here</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {testimonials.map((testimonial) => (
          <figure key={testimonial.name} className="rounded-lg border bg-card p-5">
            <blockquote className="text-sm text-muted-foreground">
              "{testimonial.quote}"
            </blockquote>
            <figcaption className="mt-4 font-semibold">{testimonial.name}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
