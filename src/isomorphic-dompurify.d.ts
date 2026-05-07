declare module 'isomorphic-dompurify' {
	import { sanitize, sanitizeStatic, type Config, type DOMPurify } from 'dompurify';

	export type { Config };
	export { sanitize, sanitizeStatic };
	const createDOMPurify: DOMPurify;
	export default createDOMPurify;
}
