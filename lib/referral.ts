export const generateReferralLink = (userId: string | number) => {
    const botUsername = 'BricksAITycoonBot'; // Should ideally come from env
    return `https://t.me/${botUsername}?start=ref_${userId}`;
};

export const parseReferralParam = (startParam: string | null) => {
    if (!startParam) return null;
    if (startParam.startsWith('ref_')) {
        return startParam.split('_')[1];
    }
    return null;
};