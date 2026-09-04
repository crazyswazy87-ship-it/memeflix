import { useState } from "react";
import {
  ShieldAlert,
  CreditCard,
  BadgeCheck,
  Bug,
  Flag,
  Lock,
  Trash2,
  UserX,
  ChevronDown,
  FileText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Separator } from "@base-ui/react";

/* ================= FAQ ================= */
const faqs = [
  {
    question: "Why was my account suspended?",
    answer:
      "Accounts may be suspended for violating MemeFlix Community Guidelines or repeated reports from users.",
  },
  {
    question: "How long do appeals take?",
    answer:
      "Most appeals are reviewed within 24–72 hours depending on ticket volume.",
  },
  {
    question: "How do subscriptions work?",
    answer:
      "Subscriptions unlock premium features and are billed according to your selected plan.",
  },
  {
    question: "How do I recover my account?",
    answer:
      "Use the account recovery process on the sign-in page or contact support directly.",
  },
  {
    question: "How do I report abusive content?",
    answer:
      "Open the post menu and tap the report option to submit a moderation review.",
  },
];

/* ================= CATEGORIES ================= */
const categories = [
  {
    title: "Account Issues",
    icon: <UserX className="w-5 h-5" />,
    route: "/contact-support/account-issues",
  },
  {
    title: "Suspensions & Appeals",
    icon: <ShieldAlert className="w-5 h-5" />,
    route: "/contact-support/suspensions",
  },
  {
    title: "Payment Problems",
    icon: <CreditCard className="w-5 h-5" />,
    route: "/contact-support/payments",
  },
  {
    title: "Verification Help",
    icon: <BadgeCheck className="w-5 h-5" />,
    route: "/contact-support/verification",
  },
  {
    title: "Reporting Users",
    icon: <Flag className="w-5 h-5" />,
    route: "/contact-support/reports",
  },
  {
    title: "Bugs & Technical Issues",
    icon: <Bug className="w-5 h-5" />,
    route: "/contact-support/bugs",
  },
  {
    title: "Content Removal Requests",
    icon: <Trash2 className="w-5 h-5" />,
    route: "/contact-support/content-removal",
  },
  {
    title: "Privacy & Security",
    icon: <Lock className="w-5 h-5" />,
    route: "/contact-support/privacy",
  },

  /* DIALOG ITEMS */
  {
    title: "Terms & Privacy Policy",
    icon: <FileText className="w-5 h-5" />,
    action: "terms",
  },
  {
    title: "Community Guidelines",
    icon: <ShieldAlert className="w-5 h-5" />,
    action: "guidelines",
  },
];

const SupportPage = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [openTerms, setOpenTerms] = useState(false);
  const [openGuidelines, setOpenGuidelines] = useState(false);

  const navigate = useNavigate();

  return (
    <div className="support-container">

      {/* HEADER */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Support Center</h1>
      </div>

      {/* CATEGORIES */}
      <div>
        <h2 className="text-lg font-semibold mb-4 ">
          Memeflix Support Center
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">

          {categories.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                if (item.action === "terms") {
                  setOpenTerms(true);
                } else if (item.action === "guidelines") {
                  setOpenGuidelines(true);
                } else {
                  navigate(item.route);
                }
              }}
              className="btn-graddd"
            >
              <div className="text-red-500">{item.icon}</div>
              <p className="my-girl">{item.title}</p>
            </button>
          ))}

        </div>
      </div>

      {/* FAQ */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold mb-4">
          Frequently Asked Questions
        </h2>

        <div className="space-y-3">

          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden"
            >
              <button
                onClick={() =>
                  setOpenFAQ(openFAQ === index ? null : index)
                }
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <span className="text-sm text-zinc-200 pr-3">
                  {faq.question}
                </span>

                <ChevronDown
                  className={`w-4 h-4 transition ${
                    openFAQ === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openFAQ === index && (
                <div className="px-4 pb-4 text-sm text-zinc-500">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}

        </div>
      </div>

      {/* ================= TERMS DIALOG ================= */}
      <Dialog open={openTerms} onOpenChange={setOpenTerms}>
        <DialogContent className="terms-conditions">
          <DialogHeader>
            <DialogTitle>MEMEFLIX TERMS & PRIVACY POLICY</DialogTitle>
          </DialogHeader>

          <div className="max-h-[60vh] overflow-y-auto px-2 text-sm space-y-4">
            <p>Effective since 9-4-2026</p>

            <Separator />

            <h3 className="font-semibold">✦ Introduction</h3>
            <p>
              Welcome to Memeflix, a meme-focused social platform.
            </p>

            <Separator />

            <h3 className="font-semibold">✦ Privacy</h3>
            <p>
              We collect limited data to operate the platform safely.
            </p>

            <Separator />

            <h3 className="font-semibold">✦ Acceptance</h3>
            <p>
              By using Memeflix, you agree to these terms.
            </p>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">I Understand</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ================= GUIDELINES DIALOG ================= */}
      <Dialog open={openGuidelines} onOpenChange={setOpenGuidelines}>
        <DialogContent className="terms-conditions">
          <DialogHeader>
            <DialogTitle>COMMUNITY GUIDELINES</DialogTitle>
          </DialogHeader>

          <div className="max-h-[60vh] overflow-y-auto px-2 text-sm space-y-4">

            <h3 className="font-semibold">✦ Community Standards</h3>
            <p>
              Users must maintain respectful and safe behavior.
            </p>

            <Separator />

            <h3 className="font-semibold">✦ Prohibited Content</h3>
            <p>
              Harassment, scams, violence, illegal content are not allowed.
            </p>

            <Separator />

            <h3 className="font-semibold">✦ Enforcement</h3>
            <p>
              Violations may result in removal or account suspension.
            </p>

          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Got It</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default SupportPage;