import delay from "./delay";

export async function randomDelay(minDelay: number, maxDelay: number) {
    const delaySec = Math.floor(Math.random() * (maxDelay - minDelay + 1) + minDelay);
    await delay(delaySec);
}