import type React from "react";
import type { ReactNode } from "react";

// Propsの型定義
interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
			<div className="bg-white p-8 rounded-lg shadow-lg">
				{children}
				<button
					type="button"
					className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
					onClick={onClose}
				>
					戻る
				</button>
			</div>
		</div>
	);
};

export default Modal;
