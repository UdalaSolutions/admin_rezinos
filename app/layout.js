import { Plus_Jakarta_Sans } from 'next/font/google';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Suspense } from 'react';
import './globals.css';

const plusJakarta = Plus_Jakarta_Sans({
	variable: '--font-plus-jakarta',
	subsets: ['latin'],
});

export const metadata = {
	title: 'Rezinos Admin',
	description: 'Admin dashboard for Rezinos.',
};

export default function RootLayout({ children }) {
	return (
		<html lang='en'>
			<body className={`${plusJakarta.variable} antialiased`}>
				<Suspense fallback='Loading...'>{children}</Suspense>
				<ToastContainer
					position='top-right'
					autoClose={3000}
				/>
			</body>
		</html>
	);
}
