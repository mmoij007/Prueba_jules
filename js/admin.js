document.addEventListener('DOMContentLoaded', () => {
    applySavedThemeAdmin();
    displayAdminArtworks();

    const addArtworkForm = document.getElementById('add-artwork-form');
    if (addArtworkForm) {
        addArtworkForm.addEventListener('submit', handleAddArtwork);
    }
});

function applySavedThemeAdmin() {
    const savedTheme = localStorage.getItem('theme') || 'light'; // Default to light
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
}

// Placeholder for initial artworks if localStorage is empty
// This should ideally be consistent with main.js initial data
const initialArtworksAdminFallback = [
    { id: 1, title: "Starry Night", artist: "Vincent van Gogh", style: "Post-Impressionism", imageUrl: "images/starry_night.jpg", audioUrl: "audio/starry_night_commentary.mp3" },
    { id: 2, title: "Mona Lisa", artist: "Leonardo da Vinci", style: "Renaissance", imageUrl: "images/mona_lisa.jpg", audioUrl: "audio/mona_lisa_analysis.mp3" },
    { id: 3, title: "The Persistence of Memory", artist: "Salvador Dalí", style: "Surrealism", imageUrl: "images/persistence_of_memory.jpg" },
    { id: 4, title: "The Scream", artist: "Edvard Munch", style: "Expressionism", imageUrl: "images/the_scream.jpg" },
    { id: 5, title: "Girl with a Pearl Earring", artist: "Johannes Vermeer", style: "Baroque", imageUrl: "images/girl_with_pearl_earring.jpg" }
];


function loadArtworksFromStorage() {
    const storedArtworks = localStorage.getItem('artworks');
    if (storedArtworks) {
        try {
            return JSON.parse(storedArtworks);
        } catch (e) {
            console.error("Error parsing artworks from localStorage:", e);
            // Fallback to initial data if parsing fails
            return JSON.parse(JSON.stringify(initialArtworksAdminFallback)); // Deep copy
        }
    }
    // If nothing in localStorage, save and return initial data
    localStorage.setItem('artworks', JSON.stringify(initialArtworksAdminFallback));
    return JSON.parse(JSON.stringify(initialArtworksAdminFallback)); // Deep copy
}

function displayAdminArtworks() {
    const artworks = loadArtworksFromStorage();
    const artworksListDiv = document.getElementById('admin-artworks-list');

    if (!artworks || artworks.length === 0) {
        artworksListDiv.innerHTML = '<p>No artworks found in storage.</p>';
        return;
    }

    let tableHtml = `
        <table>
            <thead>
                <tr>
                    <th>Thumbnail</th>
                    <th>Title</th>
                    <th>Artist</th>
                    <th>Style</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
    `;

    artworks.forEach(artwork => {
        tableHtml += `
            <tr>
                <td><img src="${artwork.imageUrl || 'images/placeholder.png'}" alt="${artwork.title}" class="thumbnail" onerror="this.onerror=null;this.src='images/placeholder.png';"></td>
                <td>${artwork.title || 'N/A'}</td>
                <td>${artwork.artist || 'N/A'}</td>
                <td>${artwork.style || 'N/A'}</td>
                <td>
                    <button class="edit-btn" data-id="${artwork.id}">Edit</button>
                    <button class="delete-btn" data-id="${artwork.id}">Delete</button>
                </td>
            </tr>
        `;
    });

    tableHtml += `
            </tbody>
        </table>
    `;

    artworksListDiv.innerHTML = tableHtml;

    // Add event listeners for edit/delete buttons later
    // Example:
    // document.querySelectorAll('.edit-btn').forEach(button => {
    //     button.addEventListener('click', (e) => handleEditArtwork(e.target.dataset.id));
    // });
    // document.querySelectorAll('.delete-btn').forEach(button => {
    //     button.addEventListener('click', (e) => handleDeleteArtwork(e.target.dataset.id));
    // });
}

// Functions for handleEditArtwork and handleDeleteArtwork will be added later if this phase is expanded.
// For now, this script focuses on displaying artworks and adding new ones.

function handleAddArtwork(event) {
    event.preventDefault();
    const feedbackDiv = document.getElementById('admin-feedback');
    feedbackDiv.textContent = ''; // Clear previous feedback

    const form = event.target;
    const newArtwork = {
        id: Date.now(), // Simple unique ID
        title: form.title.value.trim(),
        artist: form.artist.value.trim(),
        style: form.style.value.trim(),
        epoch: form.epoch.value.trim(),
        imageUrl: form.imageUrl.value.trim() || 'images/placeholder.png', // Default placeholder if empty
        highResImageUrl: form.highResImageUrl.value.trim(),
        audioUrl: form.audioUrl.value.trim(),
        details: form.details.value.trim(),
        techniques: form.techniques.value.trim(),
        dimensions: form.dimensions.value.trim(),
        historicalContext: form.historicalContext.value.trim(),
        artistBio: form.artistBio.value.trim()
    };

    if (!newArtwork.title || !newArtwork.artist) {
        feedbackDiv.textContent = 'Error: Title and Artist are required.';
        feedbackDiv.style.color = 'red';
        return;
    }

    try {
        let artworks = loadArtworksFromStorage(); // loadArtworksFromStorage already handles empty/invalid cases
        artworks.push(newArtwork);
        localStorage.setItem('artworks', JSON.stringify(artworks));

        displayAdminArtworks(); // Refresh the list
        form.reset(); // Clear the form
        feedbackDiv.textContent = 'Artwork added successfully!';
        feedbackDiv.style.color = 'green';
        setTimeout(() => feedbackDiv.textContent = '', 3000); // Clear feedback after 3s

    } catch (error) {
        console.error("Error adding artwork:", error);
        feedbackDiv.textContent = 'Error adding artwork. See console for details.';
        feedbackDiv.style.color = 'red';
    }
}
