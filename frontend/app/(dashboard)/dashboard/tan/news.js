import React, { useState, useEffect } from 'react';

const NewsComponent = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const apiKey = 'ca0e0c77619f40faaa8e8216a8515765';
    const url = `https://newsapi.org/v2/everything?q=investment OR savings OR finance&apiKey=${apiKey}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        // Check if data was received successfully
        if (data.status === 'ok') {
          const randomArticles = getRandomArticles(data.articles, 5);
          setArticles(randomArticles);
        } else {
          console.error('Error fetching news data:', data.message);
        }
      })
      .catch(error => console.error('Error fetching news data:', error));
  }, []);

  function getRandomArticles(articles, count) {
    const randomArticles = [];
    const totalArticles = articles.length;
    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * totalArticles);
      randomArticles.push(articles[randomIndex]);
    }
    return randomArticles;
  }

  return (
    <div>
      <ul className="space-y-2">
        {articles.map((article, index) => (
          <li key={index} className="flex items-center">
            <span className="mr-2">&#10148;</span>{/* Pointer */}
            <a href={article.url} target="_blank" rel="noopener noreferrer">{article.title}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NewsComponent;
