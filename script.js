async function loadLatestNews() {
  const status = document.getElementById("newsStatus");
  const article = document.getElementById("latestNews");
  const newsUrl =
    "https://pychat-e7b75-default-rtdb.firebaseio.com/news.json?orderBy=%22time%22&limitToLast=1";

  try {
    const response = await fetch(newsUrl);
    if (!response.ok) {
      throw new Error("News unavailable");
    }

    const entries = await response.json();
    const latest = entries && typeof entries === "object"
      ? Object.values(entries)[0]
      : null;

    if (!latest || typeof latest !== "object") {
      status.textContent = "No news has been posted yet.";
      return;
    }

    document.getElementById("newsTitle").textContent =
      typeof latest.title === "string" ? latest.title : "Untitled";
    document.getElementById("newsBody").textContent =
      typeof latest.body === "string" ? latest.body : "";

    const time = document.getElementById("newsTime");
    if (typeof latest.time === "number" && Number.isFinite(latest.time)) {
      const date = new Date(latest.time);
      if (Number.isFinite(date.getTime())) {
        time.dateTime = date.toISOString();
        time.textContent = date.toLocaleString();
      }
    }

    article.hidden = false;
    status.hidden = true;
  } catch (error) {
    status.textContent = "Couldn't load recent news right now.";
  }
}

async function loadLatestRelease() {
  const button = document.getElementById("downloadBtn");
  const info = document.getElementById("releaseInfo");
  const releasesUrl =
    "https://api.github.com/repos/roadkiill/PyChat_App/releases/latest";

  try {
    const response = await fetch(releasesUrl);
    if (!response.ok) {
      throw new Error("Release unavailable");
    }

    const release = await response.json();
    const assets = Array.isArray(release.assets) ? release.assets : [];
    const exe = assets.find(asset =>
      typeof asset.name === "string" && asset.name.toLowerCase().endsWith(".exe")
    );

    if (exe) {
      button.href = exe.browser_download_url;
      button.download = exe.name;
      button.textContent = "Download PyChat ↓";
      info.textContent = `Latest version: ${release.tag_name} · Windows`;
    } else {
      button.href = release.html_url;
      button.textContent = "View latest release ↗";
      info.textContent = `Version ${release.tag_name} · No .exe asset found`;
    }

    button.classList.remove("disabled");
  } catch (error) {
    button.href = "https://github.com/roadkiill/PyChat_App/releases/latest";
    button.textContent = "View GitHub releases ↗";
    info.textContent = "Couldn't check the latest release. Visit GitHub instead.";
    button.classList.remove("disabled");
  }
}

loadLatestNews();
loadLatestRelease();