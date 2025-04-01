import {MMKVLoader, useMMKVStorage} from 'react-native-mmkv-storage';

// Initialize MMKV storage
const storage = new MMKVLoader().initialize();

// Export states and their setters
export const useStorageStates = () => {
  //states for the Morning inputs
  const [intention, setIntention] = useMMKVStorage('intention', storage, '');
  const [grateful, setGrateful] = useMMKVStorage('grateful', storage, '');
  const [today, setToday] = useMMKVStorage('today', storage, '');
  const [affirmations, setAffirmations] = useMMKVStorage(
    'affirmations',
    storage,
    '',
  );

  //   states for the night inputs
  const [todaysRating, setTodaysRating] = useMMKVStorage<number>(
    'todaysRating',
    storage,
    0,
  );
  const [thank, setThank] = useMMKVStorage('thank', storage, '');
  const [greatThings, setGreatThings] = useMMKVStorage(
    'greatThings',
    storage,
    '',
  );
  const [highlight, setHighlight] = useMMKVStorage('highlight', storage, '');

  //states for control

  // State to track whether the morning journaling has been completed
  const [isMorningJournalingFilled, setIsMorningJournalingFilled] =
    useMMKVStorage('isMorningJournalingFilled', storage, false);

  return {
    intention,
    setIntention,
    grateful,
    setGrateful,
    today,
    setToday,
    affirmations,
    setAffirmations,
    todaysRating,
    setTodaysRating,
    thank,
    setThank,
    greatThings,
    setGreatThings,
    highlight,
    setHighlight,
    isMorningJournalingFilled,
    setIsMorningJournalingFilled,
  };
};
