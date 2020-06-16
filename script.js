const search = document.getElementById('search');
const searchBtn = document.getElementById('search-btn');
const resultsContainer = document.getElementById('results');
const nextResultsContainer = document.getElementById('more-results');

let searchValue = "";

// Get more songs
const getMoreSongs = async (url) => {
    const response = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
    const data = await response.json();
    updateResults(data);
}

// Update DOM with search results
const updateResults = (data) => {
    const output = document.createElement('ul');
    output.classList.add('songs');
    data.data.forEach(item => {
        const result = document.createElement('li');
        result.innerHTML = `
        <li>
        <span><strong>${item.artist.name}</strong> - ${item.title}</span>
        <button class="btn lyrics-btn" data-artist="${item.artist.name}" data-title="${item.title}">Get Lyrics</button>
        </li>
        `

        output.appendChild(result);
    });

    resultsContainer.innerHTML = "";
    resultsContainer.appendChild(output);

    // Check if there more than 15 songs
    if (data.next || data.prev) {
        nextResultsContainer.innerHTML = `
        ${data.prev ? `<button class='btn change-btn' onclick="getMoreSongs('${data.prev}')">Prev</button>` : ''}
        ${data.next ? `<button class='btn change-btn' onclick="getMoreSongs('${data.next}')">Next</button>` : ''}
        `
    } else {
        nextResultsContainer.innerHTML = '';
    }
}

// Search song
const searchSong = async () => {
    const response = await fetch(`https://api.lyrics.ovh/suggest/${searchValue}`)
    const data = await response.json();
    updateResults(data);
}

// Get song lyrics
const getLyrics = async (artist, title) => {
    const response = await fetch(`https://api.lyrics.ovh/v1/${artist}/${title}`)
    const data = await response.json();

    const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');

    resultsContainer.innerHTML = `
    <h2>${artist} - ${title}</h2>
    <p>${lyrics}</p>
    `

    nextResultsContainer.innerHTML = '';
}

// Event listeners
search.addEventListener('input', () => {
    searchValue = search.value;
})

searchBtn.addEventListener('click', (e) => {
    e.preventDefault();

    if (searchValue === "") {
        alert('Please enter artist or song name')
    } else {
        searchSong();
        search.value = "";
    }
});

resultsContainer.addEventListener('click', (e) => {
    const target = e.target;

    if (target.type === 'submit') {
        const artist = target.getAttribute('data-artist')
        const title = target.getAttribute('data-title')
        getLyrics(artist, title);
    }
})