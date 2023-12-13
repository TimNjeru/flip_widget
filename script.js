// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCPHkF2w182lNaB2lGcKlxnKQgr0xaIkpc",
    authDomain: "mwalim-57e1f.firebaseapp.com",
    projectId: "mwalim-57e1f",
    storageBucket: "mwalim-57e1f.appspot.com",
    messagingSenderId: "329777917463",
    appId: "1:329777917463:web:54c16d86d88f90db73b652",
    measurementId: "G-EWWP5PTFS6"
};

// Initialize Firebase app and Firestore
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Fetch stories from Firestore and populate the flipbook
function fetchStories() {
    const storyListContainer = document.getElementById('storyList');

    db.collection('stories').doc('addStories').collection('storiesData').get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const storyData = doc.data();

                // Create elements for story list (storyList)
                const storyListItem = document.createElement('div');
                storyListItem.classList.add('story-item');
                storyListItem.innerHTML = `
          <img src="${storyData.coverImage}" alt="${storyData.title}">
          <h3>${storyData.title}</h3>
          <p>${storyData.description}</p>
        `;
                storyListContainer.appendChild(storyListItem);

                // Generate flipbook dynamically for each story
                const flipbookContainer = document.createElement('div');
                flipbookContainer.classList.add('flip-book');
                const flipbook = new St.PageFlip(flipbookContainer, {
                    width: 550,
                    height: 733,
                    // ... other flipbook settings
                });

                const storyPages = storyData.pages; // Assuming 'pages' contains HTML for pages
                flipbook.loadFromHTML(storyPages);

                // Append flipbook to the document
                document.body.appendChild(flipbookContainer);

                // Handle flipbook events or interactions if needed
                flipbook.on('flip', (e) => {
                    console.log(`Flipped to page ${e.data}`);
                    // Additional logic for page flip event
                });

                // Handle other story interactions
                // Implement functionalities for likes, dislikes, comments, sharing, etc.
                // ...

            });
        })
        .catch((error) => {
            console.error('Error getting stories: ', error);
        });
}

// Event listener when DOM content is loaded
document.addEventListener('DOMContentLoaded', function() {
    fetchStories(); // Fetch stories from Firestore and create flipbooks
});
