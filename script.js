const search = document.getElementById('search');
const searchBtn = document.getElementById('search-btn');
const resultsContainer = document.getElementById('results');
const nextReultsContainer = document.getElementById('more-results');

let searchValue = "";

// Update DOM with search results
const updateResults = (data) => {
    const output = document.createElement('ul');
    output.classList.add('songs');
    data.data.forEach(item => {
        const result = document.createElement('li');
        result.innerHTML = `
        <li>
        <span><strong>${item.artist.name}</strong> - ${item.title}</span>
        <button class="btn lyrics-btn">Get Lyrics</button>
        </li>
        `

        output.appendChild(result);
    });

    resultsContainer.innerHTML = "";
    resultsContainer.appendChild(output);

    // Check if there more than 15 songs
    if (data.next || data.prev) {
        nextReultsContainer.innerHTML = `
        ${data.prev ? `<button class='btn change-btn'>Prev</button>` : ''}
        ${data.next ? `<button class='btn change-btn'>Next</button>` : ''}
        `
    } else {
        nextReultsContainer.innerHTML = '';
    }
}

// Search song
const searchSong = async () => {
    const response = await fetch(`https://api.lyrics.ovh/suggest/${searchValue}`)
    const data = await response.json();

    updateResults(data);
}

// Event listeners
search.addEventListener('input', () => {
    searchValue = search.value;
})

searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    searchSong();
    search.value = "";
});