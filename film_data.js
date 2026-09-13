const movieInput = document.getElementById('movieInput');
const searchBtn = document.getElementById('searchBtn');
const resultsContainer = document.getElementById('results-container');
const loadingEl = document.getElementById('loading');
const errorEl = document.getElementById('error-message');

searchBtn.addEventListener('click', handleSearch);
movieInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
});

async function handleSearch() {
    const query = movieInput.value.trim();

    if (!query) {
        showError('Please enter a movie name');
        return;
    }

    clearResults();
    showLoading();

    try {
        // Using TVMaze API - completely free, no authentication required
        const response = await fetch(
            `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`
        );

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        hideLoading();

        if (!data || data.length === 0) {
            showError('No movies found. Try a different search.');
            return;
        }

        displayResults(data);
    } catch (error) {
        hideLoading();
        showError('Failed to fetch movies. Please try again later.');
        console.error('Search error:', error);
    }
}

function displayResults(results) {
    clearResults();

    if (results.length === 0) {
        const noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.style.gridColumn = '1 / -1';
        noResults.innerHTML = '<i class="fas fa-film"></i>';
        const p = document.createElement('p');
        p.textContent = 'No movies found. Try a different search.';
        noResults.appendChild(p);
        resultsContainer.appendChild(noResults);
        return;
    }

    results.forEach((result) => {
        const card = createMovieCard(result.show);
        resultsContainer.appendChild(card);
    });
}

function createMovieCard(show) {
    const card = document.createElement('div');
    card.className = 'movie-card';

    const imageUrl = show.image?.medium
        ? show.image.medium
        : 'https://via.placeholder.com/300x400?text=No+Image';

    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = show.name;
    img.className = 'movie-image';
    img.loading = 'lazy';
    img.onerror = () => {
        img.src = 'https://via.placeholder.com/300x400?text=No+Image';
    };

    const info = document.createElement('div');
    info.className = 'movie-info';

    const title = document.createElement('h3');
    title.className = 'movie-title';
    title.textContent = show.name;

    const premiered = document.createElement('p');
    premiered.className = 'movie-year';
    premiered.innerHTML = '<i class="fas fa-calendar"></i> ';
    premiered.appendChild(document.createTextNode(show.premiered || 'N/A'));

    const genre = document.createElement('p');
    genre.className = 'movie-description';
    const genres = show.genres?.length ? show.genres.join(', ') : 'N/A';
    genre.textContent = `Genre: ${genres}`;

    info.appendChild(title);
    info.appendChild(premiered);
    info.appendChild(genre);

    card.appendChild(img);
    card.appendChild(info);

    return card;
}

function clearResults() {
    resultsContainer.innerHTML = '';
    hideError();
}

function showLoading() {
    loadingEl.classList.remove('hidden');
}

function hideLoading() {
    loadingEl.classList.add('hidden');
}

function showError(message) {
    errorEl.innerHTML = '';
    const icon = document.createElement('i');
    icon.className = 'fas fa-exclamation-circle';
    const span = document.createElement('span');
    span.textContent = message;
    errorEl.appendChild(icon);
    errorEl.appendChild(span);
    errorEl.classList.remove('hidden');
}

function hideError() {
    errorEl.classList.add('hidden');
}
