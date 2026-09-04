import { useState } from "react";
import { Link } from "react-router-dom";
import { Headset, History } from "lucide-react";

const AccountAppeal = () => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    if (!message.trim()) return;

    setLoading(true);

    // simulate request (replace with API call)
    setTimeout(() => {
      setLoading(false);
      alert("Appeal submitted successfully");
      setMessage("");
    }, 1200);
  };

  return (
    <div className="suspended-container">
      <div className="redeem">

        {/* Title */}
        <h1 className="text-2xl font-bold text-white text-center">
          Submit an Appeal
        </h1>

        <p className="text-sm text-zinc-400 text-center mt-2">
          Explain why your account should be reviewed
        </p>

        {/* Text Area */}
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write your appeal here..."
          className="text-appeal" />

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="sub-appeal btn-grad"
        >
          {loading ? "Submitting..." : "Submit Appeal"}
        </button>

        {/* Secondary Actions */}
        <div className="mt-5 flex flex-col gap-3">

          <Link
            to="/suspension-history"
            className="btn-grad"
          >
            Suspension History
          </Link>

          <Link
            to="/support"
            className="btn-grad">
            Contact Support
          </Link>

        </div>

        {/* Footer Note */}
        <p className="text-xs text-zinc-400 text-center mt-5">
          Appeals are reviewed within 24–72 hours
        </p>

      </div>
    </div>
  );
};

export default AccountAppeal;