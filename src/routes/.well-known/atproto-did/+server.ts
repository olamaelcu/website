import { text } from '@sveltejs/kit';

export const prerender = true;

export const GET = () => {
	return text('did:plc:ejggqolmgpylroktvaktibik', {
		headers: {
			'Content-Type': 'text/plain'
		}
	});
};
