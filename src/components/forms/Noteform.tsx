import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";

import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

import { useUserContext } from "@/constants/context/AuthContext";
import { createNote, searchUsers } from "@/lib/appwrite/api";
import { useNavigate } from "react-router-dom";
import Loader from "../shared/Loader";

import shaglaz from "../../../public/assetss/images/search-back.png";

type FormValues = {
  caption: string;
};

const Noteform = () => {
  const { user } = useUserContext();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    defaultValues: {
      caption: "",
    },
  });

  const caption = form.watch("caption") || "";

  // ✅ IMPORTANT: store real users, not regex guesses
  const [mentionedUsers, setMentionedUsers] = useState<any[]>([]);

  const [showMentions, setShowMentions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

    

  // ✅ SELECT USER (FULL OBJECT STORAGE)
  const selectUser = (userObj: any) => {
    const current = form.getValues("caption");

    const updated = current.replace(
      /@[\w]*$/,
      `@${userObj.username} `
    );

    form.setValue("caption", updated);

    setMentionedUsers((prev) => {
      if (prev.includes(userObj.userId)) return prev;
      return [...prev, userObj.userId];
    });

    setShowMentions(false);
  };

  const onSubmit = async (values: FormValues) => {
    if (!values.caption.trim() || !user) return;

    setIsLoading(true);

    try {
      const expires = new Date();
      expires.setHours(expires.getHours() + 24);

      await createNote({
        text: values.caption,
        userId: user.id,
        username: user.username,
        imageUrl: user.imageUrl,
        isVerified: user.isVerified,
        users: [],

      
        mentions: mentionedUsers,

        emoji: "",
        expiresAt: expires.toISOString(),
      });

      console.log(mentionedUsers)

      form.reset();
      setMentionedUsers([]);
      navigate("/");
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="sifer">
      {/* Preview */}
      <div className="jichan">
        <div className="mboto-jicha wavy-circle-cxl">
          <img src={user.imageUrl} className="mbotos-jicha" />
        </div>

        <div className="tems">You</div>

        <div className="bororonja">
          {caption || "Drop your thought,, "}
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="note-form">
          <FormField
            control={form.control}
            name="caption"
            rules={{
              required: "Note cannot be empty",
              maxLength: {
                value: 60,
                message: "Note cannot exceed 60 characters",
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    className="input2"
                    placeholder="Unleash your humour..."
                    maxLength={60}
                    value={field.value}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value);

                      const match = value.match(/@([\w]*)$/);

                      if (!match) {
                        setShowMentions(false);
                        return;
                      }

                      const query = match[1];
                      setShowMentions(true);

                      // ✅ CLEAN debounce (no duplicates)
                      if (debounceRef.current)
                        clearTimeout(debounceRef.current);

                      debounceRef.current = setTimeout(async () => {
                        const res = await searchUsers(query);

                        if (res?.documents) {
                          setSuggestions(
                            res.documents.map((u: any) => ({
                              userId: u.$id,
                              username: u.username,
                              image: u.imageUrl,
                            }))
                          );
                        }
                      }, 250);
                    }}
                    onKeyDown={(e) => {
                      if (!showMentions) return;

                      if (e.key === "ArrowDown") {
                        setActiveIndex((p) =>
                          Math.min(p + 1, suggestions.length - 1)
                        );
                      }

                      if (e.key === "ArrowUp") {
                        setActiveIndex((p) =>
                          Math.max(p - 1, 0)
                        );
                      }

                      if (e.key === "Enter") {
                        e.preventDefault();

                        if (suggestions.length > 0) {
                          selectUser(suggestions[activeIndex]);
                        }
                      }
                    }}
                  />
                </FormControl>

                {/* Dropdown */}
                {showMentions && suggestions.length > 0 && (
                  <div className="mention-dropdown">
                    {suggestions.map((u, i) => (
                      <div
                        key={u.username}
                        className={`mention-item ${
                          i === activeIndex ? "active" : ""
                        }`}
                        onClick={() => selectUser(u)}
                      >
                        <img src={u.image} className="avatar" />
                        <span>@{u.username}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex justify-between mt-2">
                  <FormMessage />

                  <span className="counter">
                    {caption.length}/60
                  </span>
                </div>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="lock-btn"
            disabled={
              isLoading ||
              !caption.trim() ||
              caption.length > 60
            }
          >
            {isLoading ? <Loader /> : "Publish Note"}
          </Button>
        </form>
      </Form>

      <img src={shaglaz} className="again" />
    </div>
  );
};

export default Noteform;