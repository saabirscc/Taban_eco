// const CleanupStory = require('../models/CleanupStory');

// // Create a new cleanup story
// const createCleanupStory = async (req, res) => {
//   try {
//     const { location, description } = req.body;
//     const beforeImage = req.files['beforeImage']?.[0]?.path;
//     const afterImage = req.files['afterImage']?.[0]?.path;

//     if (!beforeImage || !afterImage) {
//       return res.status(400).json({ success: false, message: 'Both images are required.' });
//     }

//     const newCleanupStory = new CleanupStory({
//       beforeImage,
//       afterImage,
//       location,
//       description,
//     });

//     await newCleanupStory.save();
//     res.status(201).json({ success: true, message: 'Cleanup story posted successfully', data: newCleanupStory });
//   } catch (err) {
//     res.status(500).json({ success: false, message: 'Failed to post cleanup story', error: err });
//   }
// };

// // Get all cleanup stories
// const getCleanupStories = async (req, res) => {
//   try {
//     const stories = await CleanupStory.find().sort({ createdAt: -1 });
//     res.status(200).json(stories);
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to fetch cleanup stories', error: err });
//   }
// };

// // Delete a cleanup story
// const deleteCleanupStory = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const deletedStory = await CleanupStory.findByIdAndDelete(id);
//     if (!deletedStory) {
//       return res.status(404).json({ message: 'Story not found' });
//     }
//     res.status(200).json({ message: 'Cleanup story deleted successfully' });
//   } catch (err) {
//     res.status(500).json({ message: 'Error deleting cleanup story', error: err });
//   }
// };

// // Update a cleanup story
// const updateCleanupStory = async (req, res) => {
//   const { id } = req.params;
//   const { location, description } = req.body;

//   try {
//     const updatedStory = await CleanupStory.findByIdAndUpdate(
//       id,
//       { location, description },
//       { new: true }
//     );
//     if (!updatedStory) {
//       return res.status(404).json({ message: 'Story not found' });
//     }
//     res.status(200).json({ message: 'Cleanup story updated successfully', data: updatedStory });
//   } catch (err) {
//     res.status(500).json({ message: 'Error updating cleanup story', error: err });
//   }
// };

// module.exports = {
//   createCleanupStory,
//   getCleanupStories,
//   deleteCleanupStory,
//   updateCleanupStory
// };







//last
const CleanupStory = require('../models/CleanupStory');

// Create a new cleanup story
const createCleanupStory = async (req, res) => {
  try {
    const { location, description } = req.body;
    const beforeImage = req.files['beforeImage']?.[0]?.path;
    const afterImage = req.files['afterImage']?.[0]?.path;

    if (!beforeImage || !afterImage) {
      return res.status(400).json({ success: false, message: 'Both images are required.' });
    }

    const newCleanupStory = new CleanupStory({
      beforeImage,
      afterImage,
      location,
      description,
    });

    await newCleanupStory.save();
    res.status(201).json({ success: true, message: 'Cleanup story posted successfully', data: newCleanupStory });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to post cleanup story', error: err });
  }
};

// Get all cleanup stories
const getCleanupStories = async (req, res) => {
  try {
    const stories = await CleanupStory.find().sort({ createdAt: -1 });
    // Format stories to always return arrays for images
    const formattedStories = stories.map(story => {
      const obj = story.toObject();
      return {
        ...obj,
        beforeImages: obj.beforeImage ? [obj.beforeImage] : [],
        afterImages: obj.afterImage ? [obj.afterImage] : [],
        // Optionally, remove the old fields if you don't want them in the response:
        // beforeImage: undefined,
        // afterImage: undefined,
      };
    });
    res.status(200).json(formattedStories);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch cleanup stories', error: err });
  }
};

// Delete a cleanup story
const deleteCleanupStory = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedStory = await CleanupStory.findByIdAndDelete(id);
    if (!deletedStory) {
      return res.status(404).json({ message: 'Story not found' });
    }
    res.status(200).json({ message: 'Cleanup story deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting cleanup story', error: err });
  }
};

// Update a cleanup story
const updateCleanupStory = async (req, res) => {
  const { id } = req.params;
  const { location, description } = req.body;

  try {
    const updatedStory = await CleanupStory.findByIdAndUpdate(
      id,
      { location, description },
      { new: true }
    );
    if (!updatedStory) {
      return res.status(404).json({ message: 'Story not found' });
    }
    res.status(200).json({ message: 'Cleanup story updated successfully', data: updatedStory });
  } catch (err) {
    res.status(500).json({ message: 'Error updating cleanup story', error: err });
  }
};

module.exports = {
  createCleanupStory,
  getCleanupStories,
  deleteCleanupStory,
  updateCleanupStory
};