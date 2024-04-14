"use client";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { use, useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import Modal from "./Modal";
import { submitInquiry } from "./lib/actions";
import { createSchema } from "./lib/schema";

function Submit() {
	const { pending } = useFormStatus();
	return (
		<button
			type="submit"
			className={`px-8 py-2 rounded text-white ${
				pending
					? "bg-gray-500 cursor-not-allowed"
					: "bg-blue-600 hover:bg-blue-700"
			}`}
			disabled={pending}
		>
			{pending ? "送信中..." : "送信"}
		</button>
	);
}

export default function Home() {
	const [result, action] = useFormState(submitInquiry, undefined);

	const [form, fields] = useForm({
		onValidate({ formData }) {
			return parseWithZod(formData, {
				schema: (intent) => createSchema(intent),
			});
		},
		shouldValidate: "onBlur",
		shouldRevalidate: "onInput",
	});

	const [showCompletedModal, setShowCompletedModal] = useState<boolean>(false);
	const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
	useEffect(() => {
		if (result?.status === "success") {
			setShowCompletedModal(true);
		} else if (result?.status === undefined) {
			setShowConfirmModal(true);
		}
	}, [result]);

	return (
		<div className="max-w-md mx-auto mt-4 bg-white p-6 rounded shadow-md">
			<h1 className="text-xl font-bold mb-4">お問い合わせフォーム</h1>
			<form id={form.id} onSubmit={form.onSubmit} action={action} noValidate>
				<div id={form.errorId}>{form.errors}</div>
				<div className="mb-4">
					<label
						htmlFor="email"
						className="block text-sm font-medium text-gray-600"
					>
						メールアドレス
					</label>
					<input
						type="email"
						name={fields.email.name}
						className="mt-1 p-2 w-full border rounded-md"
					/>
					<div className="text-red-600">{fields.email.errors}</div>
				</div>
				<div className="mb-4">
					<label
						htmlFor="content"
						className="block text-sm font-medium text-gray-600"
					>
						お問い合わせ内容
					</label>
					<textarea
						name={fields.inquiry.name}
						rows={4}
						className="mt-1 p-2 w-full border rounded-md"
					/>
					<div className="text-red-600">{fields.inquiry.errors}</div>
				</div>
				<div className="flex justify-center">
					{/* <Submit /> */}
					<button
						type="submit"
						className="px-8 py-2 rounded text-white bg-blue-600 hover:bg-blue-700"
						{...form.validate.getButtonProps({ name: fields.email.name })}
					>
						送信
					</button>
				</div>
				<Modal
					isOpen={showConfirmModal}
					onClose={() => setShowConfirmModal(false)}
				>
					<p>エラー</p>
					<button
						type="submit"
						className="px-8 py-2 rounded text-white bg-blue-600 hover:bg-blue-700"
					>
						送信
					</button>
				</Modal>
			</form>
			<Modal
				isOpen={showCompletedModal}
				onClose={() => setShowCompletedModal(false)}
			>
				<p>問い合わせを送信しました。</p>
			</Modal>
		</div>
	);
}
