export class UrlUtil {
    static getAbsoluteUrl(originUrl: string, href: string): string | null {
        if (href.startsWith('#')) {
            return null;
        }
        if (href.startsWith('http')) {
            return href;
        }
        const url = new URL(originUrl);
        const absoluteUrl = new URL(href, url.origin);
        if (absoluteUrl.host === url.host) {
            return absoluteUrl.href;
        }
        return null;
    };
}

