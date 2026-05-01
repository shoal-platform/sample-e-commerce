import Link from "next/link";
import { ShoppingBag, Twitter, Facebook, Instagram, Youtube } from "lucide-react";

const footerLinks = {
  shop: [
    { href: "/products", label: "All Products" },
    { href: "/products?category=electronics", label: "Electronics" },
    { href: "/products?category=clothing", label: "Clothing" },
    { href: "/products?category=books", label: "Books" },
    { href: "/products?category=home", label: "Home & Garden" },
    { href: "/products?category=sports", label: "Sports & Outdoors" },
  ],
  account: [
    { href: "/account", label: "My Account" },
    { href: "/account/orders", label: "Order History" },
    { href: "/wishlist", label: "Wishlist" },
    { href: "/cart", label: "Shopping Cart" },
  ],
  support: [
    { href: "/help", label: "Help Center" },
    { href: "/shipping", label: "Shipping Info" },
    { href: "/returns", label: "Returns & Exchanges" },
    { href: "/contact", label: "Contact Us" },
    { href: "/faq", label: "FAQ" },
  ],
  company: [
    { href: "/about", label: "About Us" },
    { href: "/careers", label: "Careers" },
    { href: "/blog", label: "Blog" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300 mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="bg-primary rounded-lg p-1.5">
                <ShoppingBag className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-white text-lg">ShopNext</span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-400">
              Your premier destination for quality products at unbeatable prices.
              Fast shipping, easy returns.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="#" className="hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-semibold text-white mb-4">Shop</h3>
            <ul className="space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="font-semibold text-white mb-4">Account</h3>
            <ul className="space-y-2">
              {footerLinks.account.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-white mb-4">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} ShopNext. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>Secure payments by</span>
            <span className="font-semibold text-gray-400">Stripe</span>
          </div>
          <div className="flex gap-3 text-xs text-gray-500">
            <span>Visa</span>
            <span>Mastercard</span>
            <span>Amex</span>
            <span>PayPal</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
