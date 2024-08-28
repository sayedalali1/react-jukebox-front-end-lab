import { useEffect, useState } from 'react';
import TrackList from './components/TrackList';
import * as trackService from './services/trackService';
import TrackForm from './components/TrackForm';

const App = () => {
  const [tracks, setTracks] = useState([]);

  const [isFormOpen, setIsFormOpen] = useState(false);

  const [editMode, setEditMode] = useState(false);

  const [editTrack, setEditTrack] = useState(null);

  useEffect(() => {

    const getTracks = async () => {
      try {
        const trackList = await trackService.index();
        if (trackList.error) {
          throw new Error(trackList.error);
        }
        setTracks(trackList);
      } catch (error) {
        console.log(error);
      }
    };
    getTracks();
  }, []);

  const handleAddTrack = async (formData) => {
    try {
      
      const newTrack = await trackService.create(formData);
      if (newTrack.error) {
        throw new Error(newTrack.error);
      }
      setTracks([...tracks, newTrack]);
    } catch (error) {
      console.log(error);
    }
  };

  const edit = (track) => {
    setIsFormOpen(true);
    setEditMode(true);
    setEditTrack(track);
  };

  const handleUpdateTrack = async (formData) => {
    try {
      const updatedTrack = await trackService.update(formData, editTrack._id);
      if (updatedTrack.error) {
        throw new Error(updatedTrack.error);
      }
      const updatedTrackList = tracks.map((track) =>
        track._id !== updatedTrack ? track : updatedTrack
      );
      setTracks(updatedTrackList);
    } catch (error) {
      console.log(error);
    }
  };

  const handleOnSubmit = async (formData) => {
    if (editMode) {
      await handleUpdateTrack(formData);
    } else {
      await handleAddTrack(formData);
    }
    setEditMode(false);
    setIsFormOpen(false);
  };

  const handleDeleteTrack = async (trackId) => {
    try {
      await trackService.deleteTrack(trackId);
      const updatedTrackList = tracks.filter((track) => track._id !== trackId);
      setTracks(updatedTrackList);
    } catch (err) {
      console.error("Failed to delete track:", err);
    }
  };

  return (
    <>
      {isFormOpen ? (
        <TrackForm
          setIsFormOpen={setIsFormOpen}
          handleOnSubmit={handleOnSubmit}
          track={editMode ? editTrack : null}
          handleDeleteTrack={handleDeleteTrack}
        />
      ) : (
        <>
          <button onClick={() => setIsFormOpen(true)}>Add New Track</button>
          <TrackList tracks={tracks} edit={edit} handleDeleteTrack={handleDeleteTrack} />
        </>
      )}
    </>
  );
};

export default App;
