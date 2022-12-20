import UserAgent from 'user-agents';

function rotateUserAgent() {
    const userAgent = new UserAgent();
    return userAgent.toString();
}

export default rotateUserAgent;