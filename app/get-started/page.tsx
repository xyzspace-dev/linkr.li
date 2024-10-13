"use client";
import { Link } from "@nextui-org/link";
import { Snippet } from "@nextui-org/snippet";
import { Code } from "@nextui-org/code";
import { button as buttonStyles } from "@nextui-org/theme";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import { Button } from "@nextui-org/button";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-xl text-center justify-center">
        <span className={title()}>Create&nbsp;</span>
        <span className={title({ color: "violet" })}>short&nbsp;</span>
        <br />
        <span className={title()}>Links to share with the world.</span>
        <div className={subtitle({ class: "mt-4" })}>
          Free and easy to use. Open source. Get started now.
        </div>

        {/* Call to Action Button */}
        <div className="mt-6">
          <Link href="/dashboard">
            <Button className="transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-violet-500" aria-label="Get started with link creation">
              Get Started
            </Button>
          </Link>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="mt-12 max-w-xl text-center">
        <h2 className={title()}>Why Use Our Link Shortener?</h2>
        <div className={subtitle({ class: "mt-4" })}>
          Our platform allows you to shorten long URLs quickly and efficiently. Whether you're sharing links on social media, in emails, or anywhere else, short links make it easier for your audience to access the content you want to share.
        </div>
        <div className={subtitle({ class: "mt-2" })}>
          <strong>Key Benefits:</strong>
          <ul className="list-disc list-inside mt-2 text-left">
            <li>✨ Enhanced Tracking: Monitor the performance of your links with detailed analytics.</li>
            <li>🔗 Customization: Personalize your short links to reflect your brand.</li>
            <li>🔒 Security: Enjoy peace of mind with secure link sharing.</li>
          </ul>
        </div>
      </div>

      {/* How it Works Section */}
      <div className="mt-12 max-w-xl text-center">
        <h2 className={title()}>How it Works</h2>
        <div className={subtitle({ class: "mt-4" })}>
          It's simple! Just sign in with your Discord account, create short links, and share them with the world.
        </div>
        <div className={subtitle({ class: "mt-2" })}>
          Follow these easy steps:
          <ol className="list-decimal list-inside mt-2 text-left">
            <li>Sign in using your Discord account for a seamless experience.</li>
            <li>Create short links in just a few clicks.</li>
            <li>Share your short links anywhere you want!</li>
          </ol>
        </div>
        <Link href="/docs" className="mt-4 text-violet-600 hover:underline" aria-label="Learn more about how it works">
          Learn more about how it works
        </Link>
      </div>
    </section>

  );
}
