import React from 'react';
import axios from 'axios';

import { getRandomInt } from '../utility';

const API_URL = 'https://randomuser.me/api/';
const RESULTS_COUNT = 40;
const API_PARAMS = new URLSearchParams([['results', RESULTS_COUNT]]);

export const ProfileContext = React.createContext({
  profiles: [],
});

function ProfilesReducer(state, action) {
  let profiles;

  switch (action.type) {
    case 'ascending':
      profiles = [...state.profiles];
      profiles.sort((profileA, profileB) => (profileA.handle > profileB.handle ? 1 : -1));
      return { profiles };

    case 'descending':
      profiles = [...state.profiles];
      profiles.sort((profileA, profileB) => (profileA.handle < profileB.handle ? 1 : -1));
      return { profiles };

    case 'PROFILES_FETCH_COMPLETE':
      profiles = action.profiles;
      return { profiles };

    default:
      throw new Error();
  }
}

async function fetchRandomUserProfiles() {
  const randomUserProfiles = await axios.get(API_URL, { params: API_PARAMS });
  return randomUserProfiles.data.results;
}

function convertToMatchProfile(randomUserProfile) {
  return {
    photoUrl: randomUserProfile.picture.large,
    handle: randomUserProfile.name.first,
    location: randomUserProfile.location.city,
    age: randomUserProfile.dob.age,
    photoCount: getRandomInt(2, 6),
    id: randomUserProfile.login.uuid,
  };
}

function ProfilesContextProvider({ children }) {
  const [state, dispatch] = React.useReducer(ProfilesReducer, {
    profiles: [],
  });

  React.useEffect(() => {
    fetchRandomUserProfiles()
      .then((randomUserProfiles) => randomUserProfiles.map(convertToMatchProfile))
      .then((matchProfiles) => {
        dispatch({ type: 'PROFILES_FETCH_COMPLETE', profiles: matchProfiles });
      });
  }, []);

  return (
    <ProfileContext.Provider value={{ ...state, dispatch }}>{children}</ProfileContext.Provider>
  );
}

export default ProfilesContextProvider;
