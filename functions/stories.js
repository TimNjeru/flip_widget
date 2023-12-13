const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({origin: ["http://localhost:61659", "https://app.flutterflow.io"]});
exports.getStoriesWithTopAddStories = functions.https.onRequest(async (req, res) => {
    try {
        const storiesSnapshot = await admin.firestore().collection('stories').get();
        let stories = [];
        for (let doc of storiesSnapshot.docs) {
            let story = {...doc.data()};  // Convert to plain JS object
            story.id = doc.id;  // Include the story ID

            // Get the top 3 addStories for this story
            const addStoriesSnapshot = await admin.firestore().collection('stories').doc(doc.id).collection('addStories').orderBy('likes', 'desc').limit(3).get();
            let addStories = [];
            addStoriesSnapshot.forEach(addStoryDoc => {
                let addStory = {...addStoryDoc.data()};  // Convert to plain JS object
                addStory.id = addStoryDoc.id;  // Include the addStory ID
                addStories.push(addStory);
            });

            // Add the top addStories to this story
            story.topAddStories = addStories;

            stories.push(story);
        }

        res.send(JSON.stringify(stories));  // Send as JSON string
    } catch (error) {
        console.error("Error: ", error);
        res.status(500).send(error);
    }
});