/**
 * Universal utility to get the correct API/File URL regardless of environment.
 */
export const getFileUrl = (path: string | null | undefined): string => {
    if (!path) return "";
    
    // If it's already a full URL (like a Cloudinary or Google image), return as is
    if (path.startsWith('http')) return path;

    // Use environment variable from Vercel/Local, fallback to localhost
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    
    // Remove the '/api' suffix if it exists to get the server root for files
    const serverRoot = apiBaseUrl.replace(/\/api$/, '');

    // Ensure the path starts with a slash
    const sanitizedPath = path.startsWith('/') ? path : `/${path}`;

    return `${serverRoot}${sanitizedPath}`;
};
