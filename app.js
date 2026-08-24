const users = [
    {
        username: "404Kid",
        domain: "hello-with.localnode.app",
        avatar: "👤",
        description: "Люблю игры, программирование и придумывать странные проекты.",
        tags: ["games", "programming", "GraphWar"]
    },
    {
        username: "Alex",
        domain: "hello-with.localnode.app",
        avatar: "🎮",
        description: "Играю в игры и иногда пишу на JavaScript.",
        tags: ["games", "javascript", "coding"]
    },
    {
        username: "Pixel",
        domain: "pixel.localnode.app",
        avatar: "🎨",
        description: "Рисование, дизайн и немного программирования.",
        tags: ["art", "design", "programming"]
    },
    {
        username: "CoolCat",
        domain: "coolcat.localnode.app",
        avatar: "🐱",
        description: "Minecraft, мемы и всякие интересные штуки.",
        tags: ["minecraft", "games", "memes"]
    }
];


const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const results = document.getElementById("results");
const resultCount = document.getElementById("resultCount");


function normalize(text) {
    return text
        .toLowerCase()
        .trim();
}


function createUserCard(user) {
    const card = document.createElement("a");

    /*
     * Пока это обычная ссылка.
     *
     * Когда настоящий backend будет готов,
     * здесь можно будет использовать:
     *
     * https://404Kid.hello-with.localnode.app
     */

    card.href = `https://${user.username}.${user.domain}`;

    card.className = "user-card";

    const top = document.createElement("div");
    top.className = "user-top";

    const avatar = document.createElement("div");
    avatar.className = "avatar";
    avatar.textContent = user.avatar;

    const nameBlock = document.createElement("div");

    const username = document.createElement("h3");
    username.className = "username";
    username.textContent = user.username;

    const url = document.createElement("div");
    url.className = "user-url";
    url.textContent = `${user.username}.${user.domain}`;

    nameBlock.appendChild(username);
    nameBlock.appendChild(url);

    top.appendChild(avatar);
    top.appendChild(nameBlock);


    const description = document.createElement("p");

    description.className = "user-description";
    description.textContent = user.description;


    const tags = document.createElement("div");
    tags.className = "tags";

    user.tags.forEach(tag => {
        const element = document.createElement("span");

        element.className = "tag";
        element.textContent = tag;

        tags.appendChild(element);
    });


    card.appendChild(top);
    card.appendChild(description);
    card.appendChild(tags);

    return card;
}


function renderUsers(list) {

    results.innerHTML = "";

    resultCount.textContent =
        `${list.length} ${getResultWord(list.length)}`;


    if (list.length === 0) {

        const empty = document.createElement("div");

        empty.className = "empty";

        empty.textContent =
            "Ничего не найдено 😔";

        results.appendChild(empty);

        return;
    }


    list.forEach(user => {
        results.appendChild(
            createUserCard(user)
        );
    });
}


function getResultWord(count) {

    if (count % 10 === 1 && count % 100 !== 11) {
        return "результат";
    }

    if (
        count % 10 >= 2 &&
        count % 10 <= 4 &&
        (count % 100 < 10 || count % 100 >= 20)
    ) {
        return "результата";
    }

    return "результатов";
}


function searchUsers(query) {

    const text = normalize(query);

    if (!text) {
        return users;
    }


    const words = text
        .split(/\s+/)
        .filter(Boolean);


    return users.filter(user => {

        const searchableText = normalize(
            [
                user.username,
                user.description,
                ...user.tags
            ].join(" ")
        );


        return words.every(word =>
            searchableText.includes(word)
        );
    });
}


searchForm.addEventListener("submit", event => {

    event.preventDefault();

    const found = searchUsers(
        searchInput.value
    );

    renderUsers(found);


    const url = new URL(
        window.location.href
    );

    if (searchInput.value.trim()) {

        url.searchParams.set(
            "q",
            searchInput.value.trim()
        );

    } else {

        url.searchParams.delete("q");

    }


    history.replaceState(
        null,
        "",
        url
    );
});


/*
 * Если открыть:
 *
 * xyvera.localnode.app/search?q=games
 *
 * поисковый запрос автоматически загрузится.
 */

const params =
    new URLSearchParams(
        window.location.search
    );

const initialQuery =
    params.get("q");


if (initialQuery) {

    searchInput.value =
        initialQuery;

    renderUsers(
        searchUsers(initialQuery)
    );

} else {

    renderUsers(users);

}
