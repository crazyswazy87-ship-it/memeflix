import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from "../ui/separator"

export function DialogStickyFooter() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className=" mt-3">© 2026 MEMEFLIX</Button>
      </DialogTrigger>

      <DialogContent className="terms-conditions">
        <DialogHeader>
          <DialogTitle> MEMEFLIX TERMS, CONDITIONS & PRIVACY POLICY</DialogTitle>
        </DialogHeader>

        <div className="-mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4">

          {/* ===================== TERMS & PRIVACY POLICY ===================== */}
          <DialogDescription>✦ TERMS & PRIVACY POLICY</DialogDescription>

          <p className="mb-4 leading-normal">
            Effective since 9-4-2026

            <Separator />
            <Separator />
            <Separator />
            <Separator />
            <Separator />
            <DialogDescription>✦ Introduction</DialogDescription>
            <Separator />

            Welcome to Memeflix, a meme-focused social media platform designed for sharing, discovering, and interacting with humor-driven content from around the world.

            By accessing or using Memeflix, you agree to be bound by these Terms, Conditions, and Privacy Policy. If you do not agree, you must not use the platform.

            <Separator />
            <Separator />
            <Separator />
            <Separator />
            <Separator />
            <DialogDescription>✦ Use of the platform</DialogDescription>
            <Separator />

            Memeflix provides users with the ability to:
            * Create and share memes
            * Interact with content (likes, engagement)
            * Maintain user profiles
            * Discover content through a meme feed
            * Participate in a community-driven platform

            You agree to use the platform only for lawful purposes and in a way that does not infringe the rights of others.

            <Separator />
            <Separator />
            <Separator />
            <Separator />
            <Separator />
            <DialogDescription>✦ User Accounts</DialogDescription>
            <Separator />

            To access certain features, you must create an account.

            You agree that:
            * All information provided is accurate and up to date
            * You are responsible for maintaining account confidentiality
            * You are responsible for all activity under your account

            Memeflix supports unique usernames, including dot-style formats (e.g., `username.example`).

            <Separator />
            <Separator />
            <Separator />
            <Separator />
            <Separator />
            <DialogDescription>✦ Content Ownership & Rights</DialogDescription>
            <Separator />

            * Users retain ownership of the content they upload
            * By posting content, you grant Memeflix a non-exclusive, worldwide, royalty-free license to use, display, and distribute your content within the platform
            * Memeflix does not claim ownership of your content

            <Separator />
            <Separator />
            <Separator />
            <Separator />
            <Separator />
            <DialogDescription>✦ Data Collection</DialogDescription>
            <Separator />

            Memeflix collects limited user data necessary to operate the platform, including:
            * Account information (username, email)
            * User-generated content (memes, interactions)
            * Technical data (device, browser, usage patterns)

            <Separator />
            <Separator />
            <Separator />
            <Separator />
            <Separator />
            <DialogDescription>✦ Data Storage & Integrity</DialogDescription>
            <Separator />

            * User data is securely stored using trusted backend infrastructure
            * Reasonable technical and organizational safeguards are implemented to protect data
            * While strong security measures are in place, no system is completely immune to breaches

            Memeflix continuously works to maintain data integrity and prevent unauthorized access.

            <Separator />
            <Separator />
            <Separator />
            <Separator />
            <Separator />
            <DialogDescription>✦ Privacy & User Protection</DialogDescription>
            <Separator />

            Memeflix is committed to protecting user identity and privacy.

            * Personal information is not sold or shared with third parties without consent
            * User identity is safeguarded and only disclosed if required by law
            * Information may be released to authorities in cases involving unlawful activities, including cybercrime investigations

            <Separator />
            <Separator />
            <Separator />
            <Separator />
            <Separator />
            <DialogDescription>✦ Cookies & Tracking</DialogDescription>
            <Separator />

            Memeflix may use cookies or similar technologies to:
            * Improve user experience
            * Analyze platform performance
            * Maintain session authentication

            Users can manage cookie preferences through their browser settings.

            <Separator />
            <Separator />
            <Separator />
            <Separator />
            <Separator />
            <DialogDescription>✦ Third Party Services</DialogDescription>
            <Separator />

            Memeflix may rely on third-party tools and services (e.g., authentication, storage).

            While these services are trusted, Memeflix is not responsible for their independent policies or practices.

            <Separator />
            <Separator />
            <Separator />
            <Separator />
            <Separator />
            <DialogDescription>✦ Limitation of Liabilty</DialogDescription>
            <Separator />

            Memeflix is provided "as is" without warranties of any kind.

            We are not liable for:
            * User-generated content
            * Loss of data or service interruptions
            * Damages resulting from misuse of the platform

            <Separator />
            <Separator />
            <Separator />
            <Separator />
            <Separator />
            <DialogDescription>✦ Termination</DialogDescription>
            <Separator />

            Memeflix reserves the right to suspend or terminate accounts that:
            * Violate these terms
            * Engage in harmful or illegal activity
            * Disrupt platform functionality or community safety

            <Separator />
            <Separator />
            <Separator />
            <Separator />
            <Separator />
            <DialogDescription>✦ Fututre Changes</DialogDescription>
            <Separator />

            These Terms, Conditions, and Privacy Policy may be updated at any time.

            Users will be notified of significant changes. Continued use of the platform constitutes acceptance of updated terms.

            <Separator />
            <Separator />
            <Separator />
            <Separator />
            <Separator />
            <DialogDescription>✦ Project Scope & Licence</DialogDescription>
            <Separator />

            Memeflix is currently developed for educational and development purposes.

            Future commercial deployment may introduce updated legal terms and licensing structures.

            <Separator />
            <Separator />
            <Separator />
            <Separator />
            <Separator />
            <DialogDescription>✦ Contact Information</DialogDescription>
            <Separator />

            For inquiries, support, or legal concerns, please contact:
            Wayne Okoth
            <Separator />
            Founder , Developer & CEO
            <Separator />
            A Self Taught Computer Science Student
            <Separator />
            wayneokoth90@gmail.com

            <Separator />
            <Separator />
            <Separator />
            <Separator />
            <Separator />
            <DialogDescription>✦ Copyright & Attribution</DialogDescription>
            <Separator />

            © 2026 Memeflix. All rights reserved.
            © 2026 Block 7

            This platform, its design, codebase, and concept are protected under applicable intellectual property laws. Unauthorized reproduction, distribution, or modification of any part of Memeflix without prior permission is strictly prohibited.

            <Separator />
            <Separator />
            <Separator />
            <Separator />
            <Separator />
            <DialogDescription>✦ Origin & Pride</DialogDescription>
            <Separator />

            Memeflix is proudly built in Kenya — crafted with passion, resilience, and creativity.

            From humble beginnings to a growing digital vision, this platform represents the work of a determined developer — **a boy from the ghetto**, turning ideas into reality through code.

            **Built with purpose. Powered by creativity. Driven by culture.**

            <Separator />
            <Separator />
            <Separator />
            <Separator />
            <Separator />
            <DialogDescription>✦ Acceptance of Terms</DialogDescription>
            <Separator />

            By using Memeflix, you confirm that you have read, understood, and agreed to these Terms, Conditions, and Privacy Policy.

            <Separator />
            <Separator />
            <DialogTitle>© 2026 Memeflix. Access granted.</DialogTitle>
          </p>

          {/* ===================== COMMUNITY GUIDELINES ===================== */}
          <DialogDescription>✦ COMMUNITY GUIDELINES</DialogDescription>

          <p className="mb-4 leading-normal">
            <Separator />
            <Separator />
            <Separator />
            <Separator />
            <Separator />
            <DialogDescription>✦ Community Standards</DialogDescription>
            <Separator />

            Memeflix promotes a positive and safe environment.

            The following content is strictly prohibited:
            * Harassment or bullying
            * Illegal content
            * Explicit sexual material
            * Graphic violence
            * Scams

            Memeflix reserves the right to:
            * Remove violating content
            * Suspend or terminate accounts
            * Take necessary action to maintain platform integrity

            <Separator />
            <Separator />
            <Separator />
            <Separator />
            <Separator />
            <DialogDescription>✦ Moderation</DialogDescription>
            <Separator />

            Memeflix uses both automated systems and manual moderation tools to enforce community guidelines.

            Content may be reviewed, flagged, or removed without prior notice if it violates platform policies.
          </p>

        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" className="lock-btn2">Yes I Agree</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}