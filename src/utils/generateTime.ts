export const generateTimeSlots = () => {
    const timeSlots = [];
    for (let min = 0; min < 24; min += 1) {
        let min0 = min < 10 ? '0' + min + ':00' : min + ':00'
        timeSlots.push({ value:min0 ,label:min0});
    }

    return timeSlots;
}