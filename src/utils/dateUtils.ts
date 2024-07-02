import { OptionType } from '../types/campaignTypes';

const allWeekdays: OptionType[] = [
    { value: 'Sunday', label: 'Sunday' },
    { value: 'Monday', label: 'Monday' },
    { value: 'Tuesday', label: 'Tuesday' },
    { value: 'Wednesday', label: 'Wednesday' },
    { value: 'Thursday', label: 'Thursday' },
    { value: 'Friday', label: 'Friday' },
    { value: 'Saturday', label: 'Saturday' }
];

export function getWeekdayOptions(startDate: Date | null, endDate: Date | null): OptionType[] {
    if (!startDate || !endDate) {
        return allWeekdays;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Ensure start date is not after end date
    if (start > end) {
        return [];
    }

    const weekdays: Set<number> = new Set();

    // Iterate through each day in the range
    for (let day = new Date(start); day <= end; day.setDate(day.getDate() + 1)) {
        weekdays.add(day.getDay());
    }

    // Map the weekday numbers to their corresponding options
    return Array.from(weekdays).map(day => allWeekdays[day]);
}