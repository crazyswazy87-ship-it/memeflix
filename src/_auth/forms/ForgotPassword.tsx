import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { account } from "@/lib/appwrite/config";
import Ejimo125 from "@/components/shared/EjimosEmoji/Ejimo125";
import { ID } from "appwrite";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  //const navigate = useNavigate();

 
const handleSendMagicLink = async () => {
  if (!email) return toast.error("Email is required");

  setLoading(true);

  try {
    const user = await account.get().catch(() => null);

    if (user) {
      await account.deleteSession("current");
    }

    await account.createMagicURLToken(
      ID.unique(),
      email,
      `${window.location.origin}/auth/callback`
    );

    toast.success("Check your email 📩");
  } catch (error: any) {
    toast.error(error.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex flex-col items-center h-screen gap-4 px-4">
      <img
        src="assetss/images/block-7.png"
        className="w-50 h-50 animate-pulse"
      />

      <h2 className="text-2xl font-bold flex">
        You had one job… remember the password <Ejimo125 />
      </h2>

      <p className="text-gray-400 text-sm text-center max-w-sm">
        Enter your email and we’ll send you a one-time code to reset your password.
      </p>

      <Input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="input1"
      />

      <br></br>

      <div className="bll">
      <Button onClick={handleSendMagicLink} className="lock-btn">
        {loading ? "Sending link..." : "Send Link"}
      </Button>
      </div>

      {/* NAV */}
                <div className="nav-slide">
                    Need help? 
                  
                    <Link to="/support" className="text-log">
                      find my account
                    </Link>
              
                </div>
                <p className="brandd">
                  FROM BLOCK SEVEN
                </p>
      


    </div>
  );
};

export default ForgotPassword;