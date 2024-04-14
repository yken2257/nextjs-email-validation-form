"use server";
import { parseWithZod } from "@conform-to/zod";
import { createSchema } from "./schema";

export async function submitInquiry(prevState: unknown, formData: FormData) {
	const submission = parseWithZod(formData, {
		schema: (intent) =>
			createSchema(intent, {
				async isEmailValid(email: string): Promise<boolean> {
					return new Promise((resolve) => {
						setTimeout(() => {
							resolve(false);
						}, 3000);
					});
				},
			}),
		async: true,
	});
	console.log(submission);
	if ((await submission).status !== "success") {
		console.log(submission);
		console.log(
			(await submission).reply({
				fieldErrors: { error: ["お問い合わせの送信に失敗しました。"] },
			}),
		);
		return (await submission).reply({
			formErrors: ["お問い合わせの送信に失敗しました。"],
		});
	}

	const headers = new Headers([
		["Content-Type", "application/json"],
		["Authorization", `Bearer ${process.env.SENDGRID_API_KEY}`],
	]);
	const requestBody = {
		personalizations: [
			{
				to: [
					{
						email: formData.get("email"),
					},
				],
			},
		],
		subject: "お問い合わせを受け付けました。",
		from: {
			email: "from@example.com",
		},
		content: [
			{
				type: "text/plain",
				value: `以下の内容でお問い合わせを受け付けました。\r\n------\r\n${formData.get(
					"inquiry",
				)}`,
			},
		],
	};
	try {
		const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
			method: "POST",
			headers: headers,
			body: JSON.stringify(requestBody),
		});
		if (response.ok) {
			return (await submission).reply();
		}
		return (await submission).reply({
			formErrors: ["お問い合わせの送信に失敗しました。"],
		});
	} catch (e) {
		return (await submission).reply({
			formErrors: ["お問い合わせの送信に失敗しました。"],
		});
	}
}
