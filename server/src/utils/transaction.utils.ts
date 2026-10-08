import axios from "axios";


export const getMerchantLogoDomain = (merchantName: string): string => {
    const cleanName = merchantName
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]/g, '');

    return `${cleanName}.com`;
}


export const getMerchantLogoUrl = async (domain: string): Promise<string | null> => {
    const url = `https://logos.hunter.io/${domain}`;
    
    try {
        const response = await axios.get(url, { timeout: 2000 });

        return response.status === 200 ? url : null
    } catch (e) {
        return null;
    }
}