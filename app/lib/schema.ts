import type { Intent } from "@conform-to/react";
import { conformZodMessage } from "@conform-to/zod";
import { z } from "zod";

const schema = z.object({
	email: z
		.string({ required_error: "入力必須です" })
		.email("メールアドレスの形式が正しくありません"),
	inquiry: z
		.string({ required_error: "入力必須です" })
		.min(5, "5文字以上で入力してください"),
});

export function createSchema(
	intent: Intent | null,
	options?: {
		isEmailValid: (email: string) => Promise<boolean>;
	},
) {
	return z
		.object({
			email: z
				.string({ required_error: "入力必須です" })
				.email("メールアドレスの形式が正しくありません")
				.pipe(
					z.string().superRefine((email, ctx) => {
						const isValidatingEmail =
							intent === null ||
							(intent.type === "validate" && intent.payload.name === "email");

						// This make Conform to use the previous result instead
						// by indicating that the validation is skipped
						if (!isValidatingEmail) {
							ctx.addIssue({
								code: "custom",
								message: conformZodMessage.VALIDATION_SKIPPED,
							});
							return;
						}
						if (typeof options?.isEmailValid !== "function") {
							ctx.addIssue({
								code: "custom",
								message: conformZodMessage.VALIDATION_UNDEFINED,
								fatal: true,
							});
							return;
						}
						return options.isEmailValid(email).then((isUnique) => {
							if (!isUnique) {
								ctx.addIssue({
									code: "custom",
									message: "Email is already used",
								});
							}
						});
					}),
				),
		})
		.and(
			z.object({
				inquiry: z
					.string({ required_error: "入力必須です" })
					.min(5, "5文字以上で入力してください"),
			}),
		);
}
