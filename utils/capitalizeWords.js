export function capitalizeWords(input) {
    return input.replace(/\b\w/g, function (match) {
        return match.toUpperCase();
    });
}
