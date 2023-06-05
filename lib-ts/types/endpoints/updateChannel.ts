export type channelData = {
    game_id: string,
    broadcaster_language: string,
    // ↑ ISO 639-1-two-letter-language code
    title: string,
    delay: number,
    // ↑ max. 900s (15m)
    tags: string[]
    // ↑ Max. 10, Max. 25 chars/entry
};