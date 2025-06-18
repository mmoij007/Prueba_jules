// Main JavaScript file
console.log("JavaScript file loaded");

let artworks = []; // Will be populated from localStorage or initial data

const initialArtworks = [
    {
        id: 1,
        title: "Starry Night",
        artist: "Vincent van Gogh",
        imageUrl: "images/starry_night.jpg",
        highResImageUrl: "images/starry_night_high_res.jpg", // Placeholder
        style: "Post-Impressionism",
        epoch: "1889",
        details: "A famous depiction of Van Gogh's view from the window of his asylum room.",
        techniques: "Oil on canvas",
        historicalContext: "Painted during Van Gogh's stay at the Saint-Paul-de-Mausole asylum.",
        artistBio: "Dutch Post-Impressionist painter who is among the most famous and influential figures in the history of Western art.",
        dimensions: "73.7 cm × 92.1 cm",
        audioUrl: "audio/starry_night_commentary.mp3" // Placeholder audio
    },
    {
        id: 2,
        title: "Mona Lisa",
        artist: "Leonardo da Vinci",
        imageUrl: "images/mona_lisa.jpg",
        highResImageUrl: "images/mona_lisa_high_res.jpg", // Placeholder
        style: "Renaissance",
        epoch: "1503-1506",
        details: "A half-length portrait painting by Italian artist Leonardo da Vinci.",
        techniques: "Oil on poplar panel",
        historicalContext: "High Renaissance period, commissioned by Francesco del Giocondo.",
        artistBio: "An Italian polymath of the High Renaissance who is widely considered one of the most diversely talented individuals ever to have lived.",
        dimensions: "77 cm × 53 cm",
        audioUrl: "audio/mona_lisa_analysis.mp3" // Placeholder audio
    },
    {
        id: 3,
        title: "The Persistence of Memory",
        artist: "Salvador Dalí",
        imageUrl: "images/persistence_of_memory.jpg", // Placeholder
        style: "Surrealism",
        epoch: "1931",
        details: "Known for its striking imagery of soft, melting pocket watches.",
        techniques: "Oil on canvas",
        historicalContext: "Surrealist movement, exploring Freudian concepts of dreams and subconsciousness.",
        artistBio: "A Spanish surrealist artist renowned for his technical skill, precise draftsmanship, and the striking and bizarre images in his work.",
        dimensions: "24 cm x 33 cm"
    },
    {
        id: 4,
        title: "The Scream",
        artist: "Edvard Munch",
        imageUrl: "images/the_scream.jpg", // Placeholder
        style: "Expressionism",
        epoch: "1893",
        details: "An iconic piece of modern art, symbolizing the anxiety of the human condition.",
        techniques: "Oil, tempera, pastel and crayon on cardboard",
        // historicalContext: "Late 19th-century Symbolist movement, reflecting personal anguish.",
        // artistBio: "Norwegian Symbolist painter, printmaker, and an important forerunner of Expressionistic art.",
        dimensions: "91 cm × 73.5 cm"
    },
    {
        id: 5,
        title: "Girl with a Pearl Earring",
        artist: "Johannes Vermeer",
        imageUrl: "images/girl_with_pearl_earring.jpg", // Placeholder
        style: "Baroque",
        epoch: "1665",
        details: "A tronie of a young woman by Dutch Golden Age painter Johannes Vermeer.",
        techniques: "Oil on canvas",
        // historicalContext: "Dutch Golden Age, known for its intimate genre scenes.",
        // artistBio: "Dutch Baroque Period painter who specialized in domestic interior scenes of middle-class life.",
        dimensions: "44.5 cm × 39 cm"
    }
];

function initializeArtworks() {
    const storedArtworks = localStorage.getItem('artworks');
    if (storedArtworks) {
        try {
            artworks = JSON.parse(storedArtworks);
            if (!Array.isArray(artworks) || artworks.length === 0) { // Basic validation
                console.warn("Stored artworks data is invalid or empty. Falling back to initial data.");
                artworks = JSON.parse(JSON.stringify(initialArtworks)); // Deep copy
                localStorage.setItem('artworks', JSON.stringify(artworks));
            }
        } catch (e) {
            console.error("Error parsing artworks from localStorage in main.js:", e);
            artworks = JSON.parse(JSON.stringify(initialArtworks)); // Deep copy
            localStorage.setItem('artworks', JSON.stringify(artworks));
        }
    } else {
        artworks = JSON.parse(JSON.stringify(initialArtworks)); // Deep copy
        localStorage.setItem('artworks', JSON.stringify(artworks));
    }
}


const artworkGrid = document.getElementById('artwork-grid');
const searchBar = document.getElementById('search-bar');
const artistFilter = document.getElementById('artist-filter');
const styleFilter = document.getElementById('style-filter');
const modal = document.getElementById('quick-preview-modal');
const modalImage = document.getElementById('modal-image');
const modalTitle = document.getElementById('modal-title');
const modalArtist = document.getElementById('modal-artist');
const modalDetails = document.getElementById('modal-details');
const modalFavoriteBtn = document.getElementById('modal-favorite-btn');
const closeButton = document.querySelector('.close-button');

let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

function saveFavorites() {
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

let collections = JSON.parse(localStorage.getItem('collections')) || [];

function saveCollections() {
    localStorage.setItem('collections', JSON.stringify(collections));
}

function displayArtworks(artworksToDisplay, targetGrid = artworkGrid, isCollectionView = false) {
    targetGrid.innerHTML = ''; // Clear existing artworks
    const artworksData = artworksToDisplay || artworks;

    artworksData.forEach(artwork => {
        const artworkItem = document.createElement('div');
        artworkItem.classList.add('artwork-item');

        // "Add to Collection" dropdown
        let collectionOptionsHtml = '<option value="">Add to collection...</option>';
        collections.forEach(collection => {
            collectionOptionsHtml += `<option value="${collection.name}">${collection.name}</option>`;
        });

        artworkItem.innerHTML = `
            <img src="${artwork.imageUrl}" alt="${artwork.title}" onerror="this.src='images/placeholder.png';">
            <h3>${artwork.title}</h3>
            <p>Artist: ${artwork.artist}</p>
            <p>Style: ${artwork.style}</p>
            <button class="preview-btn" data-id="${artwork.id}">Quick Preview</button>
            <button class="favorite-btn ${favorites.includes(artwork.id) ? 'favorited' : ''}" data-id="${artwork.id}">
                ${favorites.includes(artwork.id) ? '★ Favorited' : '☆ Favorite'}
            </button>
            <div class="add-to-collection-dropdown">
                <select class="collection-select" data-artwork-id="${artwork.id}">
                    ${collectionOptionsHtml}
                </select>
            </div>
        `;
        targetGrid.appendChild(artworkItem);
    });

    if (!isCollectionView) { // Main grid listeners
        addPreviewButtonListeners();
        addFavoriteButtonListeners(targetGrid); // Pass targetGrid
        addCollectionSelectListeners(targetGrid); // Pass targetGrid
    } else { // Collection view listeners (might be different if needed)
        addPreviewButtonListeners(targetGrid); // Ensure preview works in collection view
        addFavoriteButtonListeners(targetGrid);
        addCollectionSelectListeners(targetGrid);
    }
}

function populateFilters() {
    const artists = [...new Set(artworks.map(art => art.artist))];
    artists.forEach(artist => {
        const option = document.createElement('option');
        option.value = artist;
        option.textContent = artist;
        artistFilter.appendChild(option);
    });

    const styles = [...new Set(artworks.map(art => art.style))];
    styles.forEach(style => {
        const option = document.createElement('option');
        option.value = style;
        option.textContent = style;
        styleFilter.appendChild(option);
    });
}

function filterAndSearchArtworks() {
    const searchTerm = searchBar.value.toLowerCase();
    const selectedArtist = artistFilter.value;
    const selectedStyle = styleFilter.value;

    let filteredArtworks = artworks;

    if (searchTerm) {
        filteredArtworks = filteredArtworks.filter(art => art.title.toLowerCase().includes(searchTerm));
    }

    if (selectedArtist) {
        filteredArtworks = filteredArtworks.filter(art => art.artist === selectedArtist);
    }

    if (selectedStyle) {
        filteredArtworks = filteredArtworks.filter(art => art.style === selectedStyle);
    }

    displayArtworks(filteredArtworks);
}

function openModal(artworkId) {
    const artwork = artworks.find(art => art.id === parseInt(artworkId));
    if (artwork) {
        modalImage.src = artwork.imageUrl;
        modalImage.onerror = () => {
            modalImage.src = 'images/placeholder.png';
            modalImage.style.cursor = 'default'; // No zoom for placeholder
        }
        modalImage.src = artwork.imageUrl; // Use imageUrl for preview
        modalImage.style.cursor = 'zoom-in';


        modalTitle.textContent = artwork.title;
        modalArtist.textContent = `Artist: ${artwork.artist}`;
        document.getElementById('modal-basic-details').textContent = `Style: ${artwork.style} | Epoch: ${artwork.epoch}`; // Basic details

        // Populate extended details
        document.getElementById('modal-techniques').textContent = artwork.techniques || "Not available";
        document.getElementById('modal-dimensions').textContent = artwork.dimensions || "Not available";
        document.getElementById('modal-historical-context').textContent = artwork.historicalContext || "Not available";
        document.getElementById('modal-artist-bio').textContent = artwork.artistBio || "Not available";
        document.getElementById('modal-view-stats').textContent = `Viewed ${Math.floor(Math.random() * 500) + 50} times`; // Mocked stats

        modalFavoriteBtn.dataset.id = artwork.id;
        updateFavoriteButtonState(modalFavoriteBtn, artwork.id);

        // Update "Add to Collection" dropdown in modal
        const modalCollectionSelect = document.getElementById('modal-collection-select');
        if (modalCollectionSelect) {
            modalCollectionSelect.innerHTML = '<option value="">Add to collection...</option>';
            collections.forEach(collection => {
                modalCollectionSelect.innerHTML += `<option value="${collection.name}">${collection.name}</option>`;
            });
            modalCollectionSelect.dataset.artworkId = artwork.id;
        }

        // Handle Audio Player
        const audioPlayer = document.getElementById('modal-audio-player');
        const audioContainer = document.getElementById('modal-audio-container');
        if (artwork.audioUrl && audioPlayer && audioContainer) {
            audioPlayer.src = artwork.audioUrl;
            audioContainer.style.display = 'block';
        } else if (audioContainer) {
            audioContainer.style.display = 'none';
            if (audioPlayer) {
                audioPlayer.pause();
                audioPlayer.src = '';
            }
        }

        modal.classList.add('visible');
    }
}

function closeModal() {
    modal.classList.remove('visible');

    // Pause and reset audio player
    const audioPlayer = document.getElementById('modal-audio-player');
    if (audioPlayer) {
        audioPlayer.pause();
        audioPlayer.src = '';
    }
    // Hide the audio container as well
    const audioContainer = document.getElementById('modal-audio-container');
    if (audioContainer) {
        audioContainer.style.display = 'none';
    }
}

function updateFavoriteButtonState(button, artworkId) {
    if (favorites.includes(artworkId)) {
        button.classList.add('favorited');
        button.textContent = '★ Favorited';
    } else {
        button.classList.remove('favorited');
        button.textContent = '☆ Favorite';
    }
}

function toggleFavorite(artworkId) {
    const id = parseInt(artworkId);
    const index = favorites.indexOf(id);
    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push(id);
    }
    saveFavorites();

    // Update all visible favorite buttons for this artwork
    document.querySelectorAll(`.favorite-btn[data-id="${id}"]`).forEach(btn => {
        updateFavoriteButtonState(btn, id);
    });
}

function addFavoriteButtonListeners(container = document) {
    const favoriteButtons = container.querySelectorAll('.favorite-btn:not(#modal-favorite-btn)');
    favoriteButtons.forEach(button => {
        // Check if listener already attached to prevent duplicates if function is called multiple times on same elements
        if (!button.dataset.listenerAttached) {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleFavorite(button.dataset.id);
            });
            button.dataset.listenerAttached = 'true';
        }
    });
}

function addCollectionSelectListeners(container = document) {
    const collectionSelects = container.querySelectorAll('.collection-select:not(#modal-collection-select)');
    collectionSelects.forEach(select => {
        if (!select.dataset.listenerAttached) {
            select.addEventListener('change', (e) => {
                const artworkId = parseInt(e.target.dataset.artworkId);
                const collectionName = e.target.value;
                if (artworkId && collectionName) {
                    addToCollection(artworkId, collectionName);
                    e.target.value = ""; // Reset dropdown
                    alert(`Artwork added to ${collectionName}`);
                }
            });
            select.dataset.listenerAttached = 'true';
        }
    });
}


function addPreviewButtonListeners(container = document) {
    const previewButtons = container.querySelectorAll('.preview-btn');
    previewButtons.forEach(button => {
        if (!button.dataset.listenerAttached) {
            button.addEventListener('click', () => {
                openModal(button.dataset.id);
            });
            button.dataset.listenerAttached = 'true';
        }
    });
}

// --- Collections Functions ---
const newCollectionNameInput = document.getElementById('new-collection-name');
const createCollectionBtn = document.getElementById('create-collection-btn');
const collectionsListDiv = document.getElementById('collections-list');
const collectionArtworksDisplayDiv = document.getElementById('collection-artworks-display');
const currentCollectionTitle = document.getElementById('current-collection-title');
const collectionArtworkGrid = document.getElementById('collection-artwork-grid');
const backToCollectionsListBtn = document.getElementById('back-to-collections-list');


function createCollection() {
    const name = newCollectionNameInput.value.trim();
    if (name && !collections.find(c => c.name === name)) {
        collections.push({ name: name, artworks: [] });
        saveCollections();
        displayCollections();
        newCollectionNameInput.value = '';
        // Refresh artwork cards to include new collection in dropdowns
        filterAndSearchArtworks();
    } else if (collections.find(c => c.name === name)) {
        alert("Collection with this name already exists.");
    } else {
        alert("Please enter a valid collection name.");
    }
}

function displayCollections() {
    collectionsListDiv.innerHTML = '';
    if (collections.length === 0) {
        collectionsListDiv.innerHTML = '<p>No collections yet. Create one!</p>';
        return;
    }
    collections.forEach(collection => {
        const listItem = document.createElement('div');
        listItem.classList.add('collection-list-item');
        listItem.innerHTML = `
            <span data-collection-name="${collection.name}">${collection.name} (${collection.artworks.length} artworks)</span>
            <button class="delete-collection-btn" data-collection-name="${collection.name}">Delete</button>
        `;
        collectionsListDiv.appendChild(listItem);
    });

    // Add event listeners for viewing a collection
    collectionsListDiv.querySelectorAll('.collection-list-item span').forEach(span => {
        span.addEventListener('click', () => viewCollection(span.dataset.collectionName));
    });
    // Add event listeners for deleting a collection
    collectionsListDiv.querySelectorAll('.delete-collection-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteCollection(btn.dataset.collectionName);
        });
    });
}

function deleteCollection(collectionName) {
    if (confirm(`Are you sure you want to delete the collection "${collectionName}"?`)) {
        collections = collections.filter(c => c.name !== collectionName);
        saveCollections();
        displayCollections();
        // Refresh main artwork grid to update collection dropdowns
        filterAndSearchArtworks();
    }
}


function addToCollection(artworkId, collectionName) {
    const collection = collections.find(c => c.name === collectionName);
    if (collection && !collection.artworks.includes(artworkId)) {
        collection.artworks.push(artworkId);
        saveCollections();
        displayCollections(); // Update count on collection list
    } else if (collection && collection.artworks.includes(artworkId)) {
        alert("Artwork already in this collection.");
    }
}

function viewCollection(collectionName) {
    const collection = collections.find(c => c.name === collectionName);
    if (!collection) return;

    currentCollectionTitle.textContent = `Artworks in: ${collection.name}`;
    const collectionArtworks = artworks.filter(art => collection.artworks.includes(art.id));

    displayArtworks(collectionArtworks, collectionArtworkGrid, true); // Display in the specific grid for collections

    // Show collection view, hide main catalog and collections list
    artworkGrid.style.display = 'none'; // Hide main catalog grid
    document.getElementById('art-catalog').querySelector('.filters').style.display = 'none'; // Hide filters
    collectionsListDiv.style.display = 'none';
    document.querySelector('#collections-manager .collection-controls').style.display = 'none';


    collectionArtworksDisplayDiv.style.display = 'block';
    backToCollectionsListBtn.style.display = 'block';
}

function showMainCatalogView() {
    artworkGrid.style.display = 'grid'; // Or your default display type
    document.getElementById('art-catalog').querySelector('.filters').style.display = 'flex';// Or your default
    collectionsListDiv.style.display = 'block';
    document.querySelector('#collections-manager .collection-controls').style.display = 'flex'; // Or your default

    collectionArtworksDisplayDiv.style.display = 'none';
    backToCollectionsListBtn.style.display = 'none';
    filterAndSearchArtworks(); // Refresh main catalog
}


// Event Listeners
searchBar.addEventListener('input', filterAndSearchArtworks);
artistFilter.addEventListener('change', filterAndSearchArtworks);
styleFilter.addEventListener('change', filterAndSearchArtworks);
closeButton.addEventListener('click', closeModal);
window.addEventListener('click', (event) => {
    if (event.target == modal) {
        closeModal();
    }
});

if (createCollectionBtn) {
    createCollectionBtn.addEventListener('click', createCollection);
}
if (backToCollectionsListBtn) {
    backToCollectionsListBtn.addEventListener('click', showMainCatalogView);
}


// --- Zoom Modal Elements and Functions ---
const zoomModal = document.getElementById('zoom-modal');
const zoomedImage = document.getElementById('zoomed-image');
const closeZoomButton = document.querySelector('.close-zoom-button');

if (modalImage) {
    modalImage.addEventListener('click', () => {
        const artworkId = modalFavoriteBtn.dataset.id; // Get current artwork ID from favorite button
        const artwork = artworks.find(art => art.id === parseInt(artworkId));
        if (artwork && modalImage.src !== 'images/placeholder.png') { // Only zoom if not placeholder
            zoomedImage.src = artwork.highResImageUrl || artwork.imageUrl; // Use highRes if available
            // zoomModal.style.display = 'block';
            zoomModal.classList.add('visible');
        }
    });
}

if (closeZoomButton) {
    closeZoomButton.addEventListener('click', () => {
        // zoomModal.style.display = 'none';
        zoomModal.classList.remove('visible');
    });
}

// Close zoom modal if clicked outside the image content
if (zoomModal) {
    zoomModal.addEventListener('click', (event) => {
        if (event.target === zoomModal) { // Clicked on the modal background
            // zoomModal.style.display = 'none';
            zoomModal.classList.remove('visible');
        }
    });
}


// --- Theme Toggle ---
const themeToggleBtn = document.getElementById('theme-toggle-btn');

function applyTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggleBtn.textContent = 'Switch to Light Mode';
    } else {
        document.body.classList.remove('dark-mode');
        themeToggleBtn.textContent = 'Switch to Dark Mode';
    }
}

function toggleTheme() {
    const currentThemeIsDark = document.body.classList.contains('dark-mode');
    const newTheme = currentThemeIsDark ? 'light' : 'dark';
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
}

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
}

// Apply saved theme on initial load
function loadSavedTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light'; // Default to light
    applyTheme(savedTheme);
}

// --- Ambient Sound ---
const ambientSoundToggleBtn = document.getElementById('ambient-sound-toggle-btn');
const ambientAudioPlayer = document.getElementById('ambient-audio-player');

function applyAmbientSoundState(state) {
    if (state === 'playing') {
        ambientAudioPlayer.play().catch(e => console.warn("Ambient audio play failed:", e)); // Autoplay might be blocked
        ambientSoundToggleBtn.textContent = 'Pause Ambient Sound';
    } else {
        ambientAudioPlayer.pause();
        ambientSoundToggleBtn.textContent = 'Play Ambient Sound';
    }
}

function toggleAmbientSound() {
    const isPlaying = !ambientAudioPlayer.paused;
    const newState = isPlaying ? 'paused' : 'playing';
    localStorage.setItem('ambientSound', newState);
    applyAmbientSoundState(newState);
}

if (ambientSoundToggleBtn && ambientAudioPlayer) {
    ambientSoundToggleBtn.addEventListener('click', toggleAmbientSound);
}

function loadAmbientSoundState() {
    const savedState = localStorage.getItem('ambientSound') || 'paused'; // Default to paused
    // Don't autoplay on initial load, user should initiate first
    if (savedState === 'playing') {
       // To prevent autoplay on load, we can set it to paused initially,
       // and user has to click once to enable. Or, try to play and respect browser policy.
       // For now, we'll just set the button text correctly.
       // If we want it to resume playing, applyAmbientSoundState(savedState) would be here.
       ambientSoundToggleBtn.textContent = 'Play Ambient Sound'; // Default to requiring a click
       localStorage.setItem('ambientSound', 'paused'); // Reset to paused to avoid autoplay issues
    } else {
       ambientSoundToggleBtn.textContent = 'Play Ambient Sound';
    }
     // If you want to attempt to play if it was 'playing':
    // applyAmbientSoundState(savedState);
    // However, be mindful of autoplay policies. Best to let user initiate.
}


// Initial setup
document.addEventListener('DOMContentLoaded', () => {
    initializeArtworks(); // Load or set artworks in localStorage
    loadSavedTheme(); // Apply theme first
    loadAmbientSoundState(); // Setup ambient sound button
    populateFilters(); // Depends on artworks array
    displayArtworks(); // Main catalog, depends on artworks array

    if (modalFavoriteBtn) {
        modalFavoriteBtn.addEventListener('click', () => {
            toggleFavorite(modalFavoriteBtn.dataset.id);
        });
    }

    // Setup for modal's collection select
    const modalCollectionSelect = document.getElementById('modal-collection-select'); // Need to add this ID to HTML if not present
    if (modalCollectionSelect) { // Check if the element exists in the modal
         modalCollectionSelect.addEventListener('change', (e) => {
            const artworkId = parseInt(e.target.dataset.artworkId);
            const collectionName = e.target.value;
            if (artworkId && collectionName) {
                addToCollection(artworkId, collectionName);
                e.target.value = ""; // Reset dropdown
                alert(`Artwork added to ${collectionName} from modal.`);
            }
        });
    }


    displayCollections(); // Display existing collections

    // Create a placeholder image if it doesn't exist
    // This is a fallback for the onerror event on artwork images
    const placeholderImg = new Image();
    placeholderImg.src = 'images/placeholder.png';
    // You might want to actually create this placeholder.png in your images folder
});
