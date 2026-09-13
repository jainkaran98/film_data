const API_KEY = 'ae2a4b49';
const API_URL = 'https://www.omdbapi.com/';

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
        const response = await fetch(
            `${API_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query)}&type=movie`
        );

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        hideLoading();

        if (data.Response === 'False') {
            showError(data.Error || 'No movies found');
            return;
        }

        displayResults(data.Search || []);
    } catch (error) {
        hideLoading();
        showError('Failed to fetch movies. Please try again later.');
        console.error('Search error:', error);
    }
}

function displayResults(movies) {
    clearResults();

    if (movies.length === 0) {
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

    movies.forEach((movie) => {
        const card = createMovieCard(movie);
        resultsContainer.appendChild(card);
    });
}

function createMovieCard(movie) {
    const card = document.createElement('div');
    card.className = 'movie-card';

    const imageUrl = movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x400?text=No+Image';

    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = movie.Title;
    img.className = 'movie-image';
    img.loading = 'lazy';

    const info = document.createElement('div');
    info.className = 'movie-info';

    const title = document.createElement('h3');
    title.className = 'movie-title';
    title.textContent = movie.Title;

    const year = document.createElement('p');
    year.className = 'movie-year';
    year.innerHTML = '<i class="fas fa-calendar"></i> ';
    year.appendChild(document.createTextNode(movie.Year));

    const type = document.createElement('p');
    type.className = 'movie-description';
    type.textContent = `Type: ${movie.Type}`;

    info.appendChild(title);
    info.appendChild(year);
    info.appendChild(type);

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
