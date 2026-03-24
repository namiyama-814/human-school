const WikiJS = require('wikijs').default;

async function getEdBug(name) {
  try {
    const page = await WikiJS({ apiUrl: 'https://ja.wikipedia.org/w/api.php' }).page(name);
    const categories = await page.categories();

    // 学歴優先度（大学 > 高校）
    const educationPriority = ["大学", "短期大学", "専門学校", "高等学校"];

    // 学校名抽出
    const educationMatches = categories
      .map(cat => {
        const names = cat.replace(/^Category:/, ""); // Category:を除去
        const regex = /(.+?)出身/i; //「出身」までを学校名として抽出
        const match = names.match(regex);
        return match ? match[1] : null;
      })
      .filter(Boolean);

    // 最終学歴を優先度順に決定
    let finalEducation = null;
    for (const eduType of educationPriority) {
      const match = educationMatches.find(school => school.includes(eduType));
      if (match) {
        finalEducation = match; // 学校名のみ
        break;
      }
    }

    console.log(`最終学歴：${finalEducation}`);
  } catch (err) {
    console.error(`ページ取得エラー: ${err.message}`);
  }
}

getEdBug("イーロンマスク");

module.exports = { getEdBug };