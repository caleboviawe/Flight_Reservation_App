class DateFormatter {
    formatDate(dateString) {
        if (!dateString) return null;
        const formattedDate = new Date(dateString).toISOString().split('T')[0];
        return formattedDate;
    }
}

export default DateFormatter;