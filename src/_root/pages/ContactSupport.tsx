import { useState } from "react";
import { Send } from "lucide-react";
import { useParams } from "react-router-dom";
import { Upload } from "lucide-react";


const ContactSupport = () => {
  const { category } = useParams();

  const [message, setMessage] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+254");
  const [subject, setSubject] = useState("");

  // 📸 NEW: image state (optional)
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const formattedCategory =
    category
      ?.replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase()) || "Support";

  const countryCodes = [
  // Africa
  { code: "+254", label: "Kenya" },
  { code: "+234", label: "Nigeria" },
  { code: "+27", label: "South Africa" },
  { code: "+233", label: "Ghana" },
  { code: "+255", label: "Tanzania" },
  { code: "+256", label: "Uganda" },
  { code: "+250", label: "Rwanda" },
  { code: "+251", label: "Ethiopia" },
  { code: "+212", label: "Morocco" },
  { code: "+20", label: "Egypt" },
  { code: "+216", label: "Tunisia" },
  { code: "+213", label: "Algeria" },

  // Europe
  { code: "+44", label: "United Kingdom" },
  { code: "+33", label: "France" },
  { code: "+49", label: "Germany" },
  { code: "+39", label: "Italy" },
  { code: "+34", label: "Spain" },
  { code: "+31", label: "Netherlands" },
  { code: "+32", label: "Belgium" },
  { code: "+46", label: "Sweden" },
  { code: "+47", label: "Norway" },
  { code: "+48", label: "Poland" },
  { code: "+351", label: "Portugal" },
  { code: "+41", label: "Switzerland" },
  { code: "+43", label: "Austria" },

  // Asia
  { code: "+91", label: "India" },
  { code: "+86", label: "China" },
  { code: "+81", label: "Japan" },
  { code: "+82", label: "South Korea" },
  { code: "+92", label: "Pakistan" },
  { code: "+880", label: "Bangladesh" },
  { code: "+63", label: "Philippines" },
  { code: "+62", label: "Indonesia" },
  { code: "+60", label: "Malaysia" },
  { code: "+65", label: "Singapore" },
  { code: "+66", label: "Thailand" },
  { code: "+84", label: "Vietnam" },
  { code: "+971", label: "United Arab Emirates" },
  { code: "+966", label: "Saudi Arabia" },
  { code: "+972", label: "Israel" },
  { code: "+98", label: "Iran" },
  { code: "+90", label: "Turkey" },

  // North America
  { code: "+1", label: "USA/Canada" },
  { code: "+52", label: "Mexico" },
  { code: "+507", label: "Panama" },
  { code: "+506", label: "Costa Rica" },
  { code: "+502", label: "Guatemala" },
  { code: "+505", label: "Nicaragua" },
  { code: "+503", label: "El Salvador" },
  { code: "+504", label: "Honduras" },

  // South America
  { code: "+55", label: "Brazil" },
  { code: "+54", label: "Argentina" },
  { code: "+56", label: "Chile" },
  { code: "+57", label: "Colombia" },
  { code: "+58", label: "Venezuela" },
  { code: "+51", label: "Peru" },
  { code: "+593", label: "Ecuador" },
  { code: "+595", label: "Paraguay" },
  { code: "+598", label: "Uruguay" },

  // Oceania
  { code: "+61", label: "Australia" },
  { code: "+64", label: "New Zealand" },
  { code: "+679", label: "Fiji" },
];

  // 📸 handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = () => {
    const cleanedPhone = phone.startsWith("0") ? phone.slice(1) : phone;
    const fullPhone = phone ? `${countryCode}${cleanedPhone}` : "";

    console.log({
      phone: fullPhone,
      subject,
      message,
      category,
      image, // 📸 included optional image
    });

    alert("Support ticket submitted");
  };

  return (
    <div className="contact-support">

      <div className="space-y-4 pt-20">

        <div className="Topbbar">Contact Support</div>

        {/* PHONE */}
        <div>
          <label className="text-sm text-zinc-400 mb-2 block">
            Phone Number
          </label>

          <div className="flex gap-2">

            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="h-12 w-40 bg-zinc-950 border border-zinc-800 rounded-xl px-3 text-white outline-none focus:border-red-500"
            >
              {countryCodes.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} {c.label}
                </option>
              ))}
            </select>

            <input
              type="tel"
              placeholder="712345678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="flex-1 h-12 bg-zinc-950 border border-zinc-800 rounded-xl px-4 outline-none text-white placeholder:text-zinc-600 focus:border-red-500"
            />
          </div>
        </div>

        {/* SUBJECT */}
        <div>
          <label className="text-sm text-zinc-400 mb-2 block">
            Subject
          </label>

          <input
            type="text"
            placeholder="Briefly describe your issue"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full h-12 bg-zinc-950 border border-zinc-800 rounded-xl px-4 outline-none text-white placeholder:text-zinc-600 focus:border-red-500"
          />
        </div>

        {/* CATEGORY */}
        <div>
          <label className="text-sm text-zinc-400 mb-2 block">
            Selected Category
          </label>

          <div className="w-full h-12 bg-zinc-950 border border-zinc-800 rounded-xl px-4 flex items-center text-zinc-300">
            {formattedCategory}
          </div>
        </div>

        {/* MESSAGE */}
        <div>
          <label className="text-sm text-zinc-400 mb-2 block">
            Describe Your Issue
          </label>

          <textarea
            placeholder="Explain your issue in detail..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full h-40 bg-zinc-950 border border-zinc-800 rounded-xl p-4 outline-none text-white placeholder:text-zinc-600 resize-none focus:border-red-500"
          />
        </div>

       {/* 📸 OPTIONAL IMAGE UPLOAD */}
        <div>
          <label className="text-sm text-zinc-400 mb-2 block">
            Attach Screenshot (optional)
          </label>

          {/* Hidden file input */}
          <input
            id="fileUpload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />

          {/* Custom button with icon */}
          <label
            htmlFor="fileUpload"
            className="flex items-center gap-2 h-12 px-4 rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-300 cursor-pointer hover:border-red-500 transition"
          >
            <Upload className="w-4 h-4" />
            <span>Choose file</span>
          </label>

          {/* Preview */}
          {preview && (
            <img
              src={preview}
              alt="preview"
              className="mt-3 w-full max-h-48 object-cover rounded-xl border border-zinc-800"
            />
          )}
        </div>

        {/* SUBMIT */}
        <button
          onClick={handleSubmit}
          className="btn-gradd"
        >
          <Send className="w-4 h-4" />
          Send Feedback
        </button>

      </div>

      <p className="text-center text-xs text-zinc-600 mt-8">
        Average response time: 24–72 hours
      </p>

    </div>
  );
};

export default ContactSupport;