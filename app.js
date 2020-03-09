const main = document.getElementById("main");

window.addEventListener("load", e => {
  loadTopics();
    // 注册 serviceWorker
    if ("serviceWorker" in navigator) {
        try {
          navigator.serviceWorker.register("sw.js");
          console.log("serviceWorker register success!");
        } catch (error) {
          console.log("serviceWorker register failure!");
        }
      }
});

async function loadTopics() {
  const res = await fetch(`https://cnodejs.org/api/v1/topics`);
  const json = await res.json();
  main.innerHTML = await json.data.map(createTopic).join("\n");
}

function createTopic(topic) {
  return `
    <div class="topic">
      <img src="${topic.author.avatar_url}" alt=""/>
      <div class="title">${topic.title}</div>
    </div>
  `;
}