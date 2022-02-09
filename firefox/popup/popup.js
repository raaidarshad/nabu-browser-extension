const SEARCH_ENDPOINT = 'https://www.nabu.news/submitSearch';
const content = document.getElementById('content');

// eslint-disable-next-line no-undef
browser.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
	const tab = tabs[0];
	const url = new URL(tab.url);

  browser.runtime.sendMessage({"tabId": tab.id});

  const loading = document.createElement('div');
  waiting.setAttribute('id', 'loading');
  waiting.setAttribute('value', 'loading...')
	content.appendChild(loading);
});

// const loading = () => `
//   <div id="loading">
//     loading...
//   </div>
// `;

/*
 ** Articles = [Article]
 */
const articleList = (articles) => {
	if (articles.length) {
		return `
    ${articles.map(article).join('')}
    `;
	}

	return `
    <div style="width: 120px">
      Could not find similar news articles
    </div>
  `;
};

/*
 ** Article = {
 **  url: string
 **  date: string
 **  title: string
 **  source: string
 ** }
 */
const article = ({ url, title, source, date }, idx) => {
    const num = idx + 1;
	return `
    <div class="article-row">
        <span class="article-number">${(num <10 ? `0${num}` : num)} </span>
        <a href=${url} class="article-headline" target="_blank">${title}</a>
        <p class="article-source">${source} - ${date.split('T')[0]}</p>
        <hr/>
    </div>
  `;
};

chrome.runtime.onMessage.addListener(messageReceived);

function messageReceived(msg) {
    const articles = msg.rows;
    content.innerHTML = articleList(articles);
}