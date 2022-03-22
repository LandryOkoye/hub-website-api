const getArticleType = (article, views, latestDate) => {
  let type = "Casual";
  if (views > 10) type = "Popular";
  if (article.publishDate === latestDate) type = "Latest";
  return type;
};

module.exports = getArticleType;
