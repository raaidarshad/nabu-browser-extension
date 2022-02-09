<script>

	let articles;
	let targetUrl;

	browser.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
		const tab = tabs[0];

  		browser.runtime.sendMessage({'tabId': tab.id});
		});

	function messageReceived(msg) {
		articles = msg.rows;
		targetUrl = msg.url;
	}

	browser.runtime.onMessage.addListener(messageReceived);
</script>

<main>
	{#if articles}
		{#if articles.length > 0}
			{#each articles as article, idx}
				<div class='article-row'>
					<span class='article-number'>{(idx+1 <10 ? `0${idx+1}` : idx+1)} </span>
					<a href={article.url} class='article-headline' target='_blank'>{article.title}</a>
					<p class='article-source'>{article.source} - {article.date.split('T')[0]}</p>
					<hr/>
				</div>
			{/each}
		{:else}
			<div>Could not find similar news articles.</div>
		{/if}
	{:else}
		<div id='loading'>loading...</div>
	{/if}
</main>

<style>
	.article-number {
		font-family: 'Roboto Mono', monospace;
		font-size: 14px;
		color: #777;
	}

	.article-headline {
		font-family: 'Alegreya', serif;
		font-size: 18px;
		color: black;
		text-decoration: none;
	}

	.article-source {
		font-family: 'Catamaran', sans-serif;
		font-size: 14px;
		text-align: left;
		color: #777;
	}

	hr {
		border: none;
		height: 1px;
		color: black;
		background-color: black;
	}

	main {
		width: 500px;
		overflow-x: hidden;
	}
</style>