import { Campaign } from '../types/campaignTypes';

export function getNextActivation(campaign: Campaign): Date | null {
    const now = new Date();
    const startDate = new Date(campaign.startDate);
    const endDate = new Date(campaign.endDate);

    // If the campaign has ended, return null
    if (now > endDate) {
        return null;
    }

    // If the campaign hasn't started yet, return the first activation
    if (now < startDate) {
        return getFirstActivation(campaign);
    }

    // Find the next activation from now
    const weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const campaignWeekdays = campaign.schedule.weekdays.map(day => weekdays.indexOf(day.toLowerCase()));
    
    let nextDate = new Date(now);
    nextDate.setHours(0, 0, 0, 0); // Reset time to start of day

    while (nextDate <= endDate) {
        const dayOfWeek = nextDate.getDay();
        
        if (campaignWeekdays.includes(dayOfWeek)) {
            for (const timeRange of campaign.schedule.timeRange) {
                const [startHour, startMinute] = timeRange.startTime.split(':').map(Number);
                const activationTime = new Date(nextDate);
                activationTime.setHours(startHour, startMinute, 0, 0);

                if (activationTime > now && activationTime <= endDate) {
                    return activationTime;
                }
            }
        }

        nextDate.setDate(nextDate.getDate() + 1); // Move to next day
    }

    return null; // No future activations found
}

function getFirstActivation(campaign: Campaign): Date | null {
    const startDate = new Date(campaign.startDate);
    const endDate = new Date(campaign.endDate);
    const weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const campaignWeekdays = campaign.schedule.weekdays.map(day => weekdays.indexOf(day.toLowerCase()));

    let currentDate = new Date(startDate);
    currentDate.setHours(0, 0, 0, 0); // Reset time to start of day

    while (currentDate <= endDate) {
        const dayOfWeek = currentDate.getDay();
        
        if (campaignWeekdays.includes(dayOfWeek)) {
            for (const timeRange of campaign.schedule.timeRange) {
                const [startHour, startMinute] = timeRange.startTime.split(':').map(Number);
                const activationTime = new Date(currentDate);
                activationTime.setHours(startHour, startMinute, 0, 0);

                if (activationTime >= startDate && activationTime <= endDate) {
                    return activationTime;
                }
            }
        }

        currentDate.setDate(currentDate.getDate() + 1); // Move to next day
    }

    return null; // No valid activation found
}