import BseVen from "@/components/shared/BseVen";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import YouTubePlayer from "./YouTubePlayer";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1 } },
};



export default function SupportPage() {
  return (
    <div className="comp">
      <BseVen/>

      {/* HERO */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.6 }}
        variants={fadeUp}
        className="text-center max-w-4xl mx-auto py-20"
      >
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          BLOCK 7
        </h1>
        <p className="text-lg md:text-2xl mt-4 text-gray-200">
          Where culture builds the future of social.
        </p>
        <p className="mt-6 text-gray-300">
          Memes. AI. Community. Chaos. Creativity.
          <br />
          All in one ecosystem.
        </p>

      </motion.section>

      {/* WHAT IS BLOCK 7 */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        variants={fadeUp}
        className="max-w-4xl mx-auto py-16"
      >
        <h2 className="text-2xl md:text-3xl font-semibold">What is Block 7?</h2>
        <p className="mt-4 text-gray-400 leading-relaxed">
          Block 7 is a social technology company creating culture-first digital
          platforms powered by content and AI. We combine viral entertainment,
          AI-driven communication, community-powered creation, and local culture
          with global reach.
        </p>
        <p className="mt-4 text-gray-500 italic">
          The internet is evolving. So are we.
        </p>
      </motion.section>

      {/* PRODUCTS */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeIn}
        className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6 py-16"
      >
        <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.2 }}>
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold">Memflix</h3>
              <p className="text-gray-400 mt-2">
                The internet’s culture engine where memes become language and
                creators move the internet.
              </p>
              <p className="text-gray-500 mt-3">
                Viral memes. Trends. Short-form chaos.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.2 }}>
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold">Sheng AI</h3>
              <p className="text-gray-400 mt-2">
                AI that speaks your world—built around language, identity, and
                expression.
              </p>
              <p className="text-gray-500 mt-3">
                Not just artificial intelligence—cultural intelligence.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.section>

      {/* WHY BLOCK 7 */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        variants={fadeUp}
        className="max-w-4xl mx-auto py-16"
      >
        <h2 className="text-2xl md:text-3xl font-semibold">Why Block 7 ?</h2>
        <ul className="mt-4 space-y-2 text-gray-400">
          <li>• Built for real communities</li>
          <li>• Designed for how people actually communicate</li>
          <li>• Powered by AI that understands context</li>
          <li>• Optimized for virality and expression</li>
        </ul>
      </motion.section>

      {/* STORY */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeUp}
        className="max-w-4xl mx-auto py-20 border-t border-zinc-800"
      >
        <h2 className="text-2xl md:text-3xl font-semibold">And this is personal</h2>

        <p className="mt-6 text-gray-400 leading-relaxed">
          I grew up in a humble background where things were often not enough.
          Raised by a single mother doing her best to provide, I learned early
          what struggle means.
        </p>

        <p className="mt-4 text-gray-400 leading-relaxed">
          I studied computer science, but curiosity pushed me further. I dropped
          out and taught myself coding through the internet. YT became my
          classroom, and creativity became my path.
        </p>

        <p className="mt-4 text-gray-400 leading-relaxed">
          Also a musician and rapper took a big role to help me turn emotion into expression.
          Through it all, I realized something important: millions of people
          express themselves online, but still feel unseen.
        </p>

        <p className="mt-6 text-white font-medium">
          That’s why Block 7 exists.
        </p>

        <p className="mt-4 text-gray-400 italic">
          Some levels of being bro'qu'e are not meant to break you. They are meant
          to shape you. To make you think differently. To ask: what if?
        </p>

        <p className="mt-4 text-gray-400">
         What if being different isn’t a disadvantage… but the unfair advantage?
        </p>
      </motion.section>

      {/* FINAL CTA */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={fadeUp}
        className="text-center py-20 border-t border-zinc-800"
      >
        <h2 className="text-3xl font-bold">This is Block 7.</h2>
        <p className="text-gray-400 mt-3">
          Where culture builds the future of social.
        </p>

        {/*
        <div className="mt-10 flex gap-4 justify-center">
          <Button className="lock-btn" variant="outline">Explore Platforms</Button>
        </div>
        */}
      </motion.section>
      {/*
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={fadeUp}
        className="text-center py-20 border-t border-zinc-800">

          <YouTubePlayer url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"  className="yty"/>
      </motion.section> */}
    </div>
  );
}
