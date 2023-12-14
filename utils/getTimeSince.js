import dayjs from "dayjs";

export const getTimeSince = (date) => {
    const timeSinceDays = dayjs().diff(dayjs(date), 'days')
    if (timeSinceDays <= 1) {
        const timeSinceHours = dayjs().diff(dayjs(date), 'hours')
        if (timeSinceHours <= 1) {
            let timeSinceMinutes = dayjs().diff(dayjs(date), 'minutes', true)
            timeSinceMinutes = timeSinceMinutes < 1 ? 0 : 1
            return `${timeSinceMinutes} minute${timeSinceMinutes !== 1 ? "s" : ""} ago`
        } else {
            return `${timeSinceHours} hour${timeSinceHours > 1 ? "s" : ""} ago`
        }

    } else if (timeSinceDays >= 1 && timeSinceDays <= 30) {
        return `${timeSinceDays} day${timeSinceDays > 1 ? "s" : ""} ago`
    } else {
        const timeSinceMonths = dayjs().diff(dayjs(date), 'months')
        if (timeSinceMonths <= 8) {
            return `${timeSinceMonths} month${timeSinceMonths > 1 ? "s" : ""} ago`
        }
    }

    return dayjs().format("MMM D, YYYY")
}
