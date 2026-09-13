const API_URL = 'https://www.omdbapi.com/';
const API_KEY = 'ae2a4b49';

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
        // Using TMDB as fallback - no auth required
        const response = await fetch(
            `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&api_key=7d5f96b6c7bcdb6e9e52fbbfdbfdd7fe`
        );

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        hideLoading();

        if (!data.results || data.results.length === 0) {
            showError('No movies found');
            return;
        }

        displayResults(data.results || []);
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

    const posterPath = movie.poster_path
        ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
        : 'https://via.placeholder.com/300x400?text=No+Image';

    const img = document.createElement('img');
    img.src = posterPath;
    img.alt = movie.title;
    img.className = 'movie-image';
    img.loading = 'lazy';

    const info = document.createElement('div');
    info.className = 'movie-info';

    const title = document.createElement('h3');
    title.className = 'movie-title';
    title.textContent = movie.title;

    const releaseDate = movie.release_date || 'N/A';
    const year = document.createElement('p');
    year.className = 'movie-year';
    year.innerHTML = '<i class="fas fa-calendar"></i> ';
    year.appendChild(document.createTextNode(releaseDate));

    const rating = document.createElement('p');
    rating.className = 'movie-description';
    const ratingVal = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
    rating.textContent = `Rating: ${ratingVal}/10`;

    info.appendChild(title);
    info.appendChild(year);
    info.appendChild(rating);

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
