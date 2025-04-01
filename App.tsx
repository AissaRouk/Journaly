import React, {ReactNode, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {appBackgroundColor} from './Src/Utils/Styles';
import {useStorageStates} from './Src/Utils/Hooks/storageHooks';

function App(): React.JSX.Element {
  // MMKV storage variable

  // state for loading
  const [loading, setLoading] = useState<boolean>(true);

  // states for quote details
  const [quote, setQuote] = useState<string>();
  const [author, setAuthor] = useState<string>();
  const [error, setError] = useState<any>(null);

  //state for the counter
  const counter: number[] = [1, 2, 3, 4, 5]; // Ensure this is defined and populated

  // Access MMKV storage states
  const {
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
  } = useStorageStates();

  //time states
  const [isNight, setIsNight] = useState<boolean>(true);

  //state for the modal
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [errorInSubmition, setErrorInSubmition] = useState<boolean>(false);

  // fetching the quote
  useEffect(() => {
    //fetching the quote from an API
    const fetchQuote = async () => {
      try {
        const response = await fetch('https://zenquotes.io/api/today');
        const data = await response.json();
        setQuote(data[0].q);
        setAuthor(data[0].a);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuote();
  }, []);

  useEffect(() => {
    if (error) console.error('Error in App: ' + JSON.stringify(error));
  }, [error]);

  // useEffect to show the Modal only for 3 seconds
  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => {
        setSubmitted(false);
      }, 3000); // Hide message after 3 seconds
      setIsMorningJournalingFilled(true);
      return () => clearTimeout(timer);
    }
  }, [submitted]);

  // useEffect to show the Modal only for 3 seconds
  useEffect(() => {
    if (errorInSubmition) {
      const timer = setTimeout(() => {
        setErrorInSubmition(false);
      }, 3000); // Hide message after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [errorInSubmition]);

  //useEffect to check if it's night or not
  useEffect(() => {
    const checkTime = () => {
      const hours = new Date().getHours(); // Get current hour (0-23)
      setIsNight(hours >= 18 && hours <= 23); // Night is from 6 PM to 6 AM
    };

    checkTime(); // Run on mount

    const interval = setInterval(checkTime, 300000); // Check every 5 minutes

    return () => clearInterval(interval); // Cleanup
  }, []);

  const handleOnSubmit = () => {
    //if all forms filled (night forms or day forms), show success modal
    if (
      (intention && grateful && today && affirmations) ||
      (todaysRating && thank && greatThings && highlight && counter)
    ) {
      setSubmitted(true);
      setIntention('');
      setGrateful('');
      setToday('');
      setAffirmations('');
    }
    // if not, show alert Modal
    else {
      setErrorInSubmition(true);
    }
  };

  //Components

  // counter for rating
  const CounterComponent: React.FC = () => {
    return (
      <ScrollView
        horizontal
        contentContainerStyle={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          width: '100%', // Ensures full width for proper centering
          marginBottom: 30,
        }}>
        {/* counter for rating your day */}
        {counter.map((item, key) => (
          <TouchableOpacity
            key={key}
            onPress={() => setTodaysRating(item)}
            style={[
              todaysRating == item && {
                backgroundColor: 'black',
                borderRadius: 10,
                height: 30,
                width: 30,
                justifyContent: 'center',
                alignItems: 'center',
              },
            ]}>
            <Text
              style={[
                {
                  color: 'black',
                  textAlign: 'center',
                  fontSize: 18,
                  marginHorizontal: 10,
                },
                todaysRating == item && {color: 'white'},
              ]}>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  //all the inputs of the night

  return (
    <ScrollView
      contentContainerStyle={styles.scrollViewContent} // Ensures proper padding and alignment
      keyboardShouldPersistTaps="handled" // Allows tapping outside inputs to dismiss the keyboard
    >
      <View style={styles.mainView}>
        <Text style={styles.title}>Diary</Text>

        {/* Content journaling */}
        <View style={styles.contentView}>
          {/* Activity Indicator */}
          {loading && <ActivityIndicator size={'large'} color={'black'} />}

          {/* Daily quote */}
          {quote && !error && (
            <View
              style={{
                borderColor: '#be5d42',
                borderWidth: 1,
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 20,
              }}>
              <Text style={styles.quote}>{quote}</Text>
              <Text style={[styles.quote]}>{author}</Text>
            </View>
          )}

          {/* Input components depending on the daytime */}
          {isNight ? (
            // Night Inputs
            <>
              {/* Title */}
              <Text style={styles.journalingTitle}>Night journaling</Text>
              <Text style={[{marginBottom: 15}, styles.ratingText]}>
                Rate today from 1 to 5
              </Text>

              {/* Counter component */}
              <CounterComponent />

              {/* InputFields */}
              <>
                <Text style={styles.ratingText}>
                  I thank myself today for...
                </Text>
                <TextInput
                  style={styles.inputText}
                  placeholder={'...'}
                  value={thank}
                  onChangeText={setThank}
                  multiline
                  scrollEnabled
                  numberOfLines={3} // Sets the initial number of lines
                  textAlignVertical="top" // Ensures text starts at the top
                />

                <Text style={styles.ratingText}>
                  3 great things that happened today...
                </Text>
                <TextInput
                  style={styles.inputText}
                  placeholder={'...'}
                  value={greatThings}
                  onChangeText={setGreatThings}
                  multiline
                  scrollEnabled
                  numberOfLines={3} // Sets the initial number of lines
                  textAlignVertical="top" // Ensures text starts at the top
                />

                <Text style={styles.ratingText}>5 min. reflection</Text>
                <TextInput
                  style={styles.inputText}
                  placeholder={'...'}
                  value={highlight}
                  onChangeText={setHighlight}
                  multiline
                  scrollEnabled
                  numberOfLines={3} // Sets the initial number of lines
                  textAlignVertical="top" // Ensures text starts at the top
                />
              </>
            </>
          ) : (
            // Morning Inputs
            <>
              {/* Title */}
              <Text style={styles.journalingTitle}>Morning journaling</Text>

              <Text style={styles.ratingText}>I am grateful for</Text>
              <TextInput
                style={[styles.inputText, {height: 60}]} // Approximate height for 3 lines
                placeholder={'...'}
                value={grateful}
                onChangeText={setGrateful}
                multiline
                scrollEnabled
                numberOfLines={3} // Sets the initial number of lines
                textAlignVertical="top" // Ensures text starts at the top
              />

              <Text style={styles.ratingText}>What would make today great</Text>
              <TextInput
                style={styles.inputText}
                placeholder={'...'}
                value={today}
                onChangeText={setToday}
                multiline
                scrollEnabled
                numberOfLines={3} // Sets the initial number of lines
                textAlignVertical="top" // Ensures text starts at the top
              />

              <Text style={styles.ratingText}>Daily affirmations, I am...</Text>
              <TextInput
                style={styles.inputText}
                placeholder={'...'}
                value={affirmations}
                onChangeText={setAffirmations}
                multiline
                scrollEnabled
                numberOfLines={3} // Sets the initial number of lines
                textAlignVertical="top" // Ensures text starts at the top
              />

              <Text style={styles.ratingText}>Todays' intention</Text>
              <TextInput
                style={styles.inputText}
                placeholder={'...'}
                value={intention}
                onChangeText={setIntention}
                multiline
                scrollEnabled
                numberOfLines={3} // Sets the initial number of lines
                textAlignVertical="top" // Ensures text starts at the top
              />
            </>
          )}
        </View>

        {/* Submit button */}
        <TouchableOpacity
          onPress={() => handleOnSubmit()}
          style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>

        {/* Modal */}
        <Modal
          visible={submitted || errorInSubmition}
          transparent={true}
          animationType="fade"
          onRequestClose={() => {
            setSubmitted(false);
            setErrorInSubmition(false);
          }}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {submitted && (
                <Text style={styles.modalText}>
                  Great job, another day working on yourself, I'm proud of you!!
                </Text>
              )}
              {errorInSubmition && (
                <Text style={styles.modalText}>
                  Please fill all the forms, if you don't feel like filling one
                  of them, fill it with a dot
                </Text>
              )}
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1, // Ensures the content takes up the full height
    paddingBottom: 20, // Adds some padding at the bottom
  },
  mainView: {
    paddingHorizontal: 10,
    backgroundColor: appBackgroundColor,
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'serif',
    color: '#2E2E2E',
  },
  contentView: {
    marginVertical: 15,
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  inputText: {
    width: '100%',
    borderBottomWidth: 1,
    borderColor: '#8B8B8B',
    textAlign: 'left',
    fontSize: 16,
    paddingBottom: 5,
    marginBottom: 20,
    fontFamily: 'serif',
    color: '#2E2E2E',
  },
  quote: {
    fontSize: 18,
    fontWeight: 'bold',
    fontStyle: 'italic',
    textAlign: 'center',
    color: '#4F4F4F',
  },
  journalingTitle: {
    textAlign: 'center',
    fontFamily: 'serif',
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 30,
    marginTop: 20,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  ratingText: {
    fontSize: 18,
    marginHorizontal: 5,
    color: '#2E2E2E',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
  },
  modalText: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#4F4F4F',
  },
  submitButton: {
    backgroundColor: '#be5d42',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#C2B8A3',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
    marginTop: 20,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2E2E2E',
  },
});

export default App;
