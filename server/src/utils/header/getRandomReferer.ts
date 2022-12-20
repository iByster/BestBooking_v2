import getRandomValueFromArray from "../array/getRandomValueFromArray";

const referes = [
    'https://stackoverflow.com/questions/6023941/how-reliable-is-http-referer',
    'https://www.google.com/search?q=rotate+referer&sxsrf=ALiCzsZxYoNTwfs12xKriLo8xodG-yrgjw%3A1670525126832&ei=xjCSY5uiMrmW9u8P08iF6Ak&ved=0ahUKEwibnZeG1-r7AhU5i_0HHVNkAZ0Q4dUDCA8&uact=5&oq=rotate+referer&gs_lcp=Cgxnd3Mtd2l6LXNlcnAQAzIFCAAQogQyBQgAEKIEMgUIABCiBDoKCAAQRxDWBBCwA0oECEEYAEoECEYYAFCBB1iBB2D7CGgBcAF4AIABaIgBaJIBAzAuMZgBAKABAcgBBcABAQ&sclient=gws-wiz-serp',
    'https://www.youtube.com/watch?v=c85MXgmpfHE&ab_channel=TheFilmTheorists',
    'https://www.google.com/search?q=greetings&oq=greetings+&aqs=chrome..69i57j0i512l2j46i512j0i512l6.4449j0j7&sourceid=chrome&ie=UTF-8',
    'https://developer.here.com/documentation/routing-api/dev_guide/index.html',
    'https://ro.wikipedia.org/wiki/Alergologie_%C8%99i_imunologie_clinic%C4%83',
    'https://www.clinicasalapalatului.ro/ce-este-medicina-interna-si-cand-sa-apelam-la-medicul-internist/',
    'https://infozon.evozon.com/wp-content/uploads/2022/07/Pachet-Expert-Complete-Adult_EVOZON-SYSTEMS_01.11.2021.pdf',
    'https://ib.btrl.ro/BT24/bfo/channel/web/loginframe.jsp?locale=RO&type=timeout',
];

const rotateReferer = () => {
    return getRandomValueFromArray(referes);
}

export default rotateReferer;
