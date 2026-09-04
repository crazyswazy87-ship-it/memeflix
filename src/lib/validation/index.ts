import * as z from "zod";

export const SignupValidation = z.object({
  name: z
    .string()
    .trim()
    .min(2, {
      message: "Name must be at least 2 characters",
    }),

  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(2, {
      message: "Username must be at least 2 characters",
    })
    .max(25, {
      message: "Try using a shorter username",
    })
    .refine(
      (value) =>
        /^(?!\.)(?!.*\.\.)(?!.*\.$)[a-z.]+$/.test(value),
      {
        message:
          "Username can contain letters and dots. Dots cannot start, end, or repeat.",
      }
    ),

  email: z
    .string()
    .trim()
    .email({
      message: "Invalid email address",
    }),

  password: z
    .string()
    .min(6, {
      message: "Password must be at least 6 characters",
    }),
});

export const SigninValidation = z.object({
  email: z
    .string()
    .trim()
    .email({
      message: "Invalid email address",
    }),

  password: z
    .string()
    .min(6, {
      message: "Password must be at least 6 characters",
    }),
});

export const PostValidation = z
  .object({
    caption: z
      .string()
      .min(1, {
        message: "Minimum 1 character.",
      })
      .max(10000),

    file: z
      .array(z.instanceof(File))
      .max(1, "Only one file allowed")
      .optional(),

    imageUrl: z.string().optional(),

    aura: z.string().optional(),
  })
  .refine(
    (data) => {
      return (
        (data.file && data.file.length > 0) ||
        data.imageUrl
      );
    },
    {
      message: "Insert Photo",
      path: ["file"],
    }
  );