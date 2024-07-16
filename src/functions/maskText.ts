export function maskText(originText: string, front = 6, back = 6) {
    return originText.slice(0, front) + "................." + originText.slice(-back);
}