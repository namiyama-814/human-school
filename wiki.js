const WikiJS = require('wikijs').default;

async function getEdBug(name) {
  try {
    const page = await WikiJS({ apiUrl: 'https://ja.wikipedia.org/w/api.php' }).page(name);
    const categories = await page.categories();

    const educationPriority = ["大学", "短期大学", "専門学校", "高等学校"];

    const educationMatches = categories
      .map(cat => {
        const names = cat.replace(/^Category:/, "");
        const regex = /(.+?)出身/i;
        const match = names.match(regex);
        return match ? match[1] : null;
      })
      .filter(Boolean);

    let finalEducation = null;
    for (const eduType of educationPriority) {
      const match = educationMatches.find(school => school.includes(eduType));
      if (match) {
        finalEducation = match;
        break;
      }
    }

    if (finalEducation) {
      console.info(`[${new Date().toISOString()}] 人物：${name} 最終学歴：${finalEducation}`);
    } else {
      console.warn(`[${new Date().toISOString()}] 人物：${name} 学歴情報なし`);
    }

    return finalEducation;
  } catch (err) {
    console.error(`[${new Date().toISOString()}] ページ取得エラー: ${err.message}`);
    return null;
  }
}

module.exports = { getEdBug };