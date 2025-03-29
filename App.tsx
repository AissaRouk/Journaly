import React, {useEffect, useState} from 'react';
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

function App(): React.JSX.Element {
  // state for loading
  const [loading, setLoading] = useState<boolean>(true);

  // states for quote details
  const [quote, setQuote] = useState<string>();
  const [author, setAuthor] = useState<string>();
  const [error, setError] = useState<any>(null);

  //states for the InputText's
  //morning inputs
  const [intention, setIntention] = useState<string>('');
  const [grateful, setGrateful] = useState<string>('');
  const [today, setToday] = useState<string>('');
  const [affirmations, setAffirmations] = useState<string>('');
  //night iputs
  const [todaysRating, setTodaysRating] = useState<number>();
  const [thank, setThank] = useState<string>('');
  const [greatThings, setGreatThings] = useState<string>('');
  const [highlight, setHighlight] = useState<string>('');
  const counter: number[] = [1, 2, 3, 4, 5];
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

  //useEffect to check the time
  useEffect(() => {
    const checkTime = () => {
      const hours = new Date().getHours(); // Get current hour (0-23)
      setIsNight(hours >= 18 || hours < 6); // Night is from 6 PM to 6 AM
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

  // Custom input field
  const InputField: React.FC<{
    title: string;
    value: string;
    multiline?: boolean;
    onChangeText: (text: string) => void;
  }> = ({title, value, onChangeText, multiline}) => {
    return (
      <>
        <Text>{title}</Text>
        <TextInput
          style={styles.inputText}
          placeholder={'...'}
          value={value}
          onChangeText={onChangeText}
          multiline={multiline}
        />
      </>
    );
  };

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

  //all the inputs of the day
  const MorningInputs: React.FC = () => (
    <>
      {/* Title */}
      <Text style={styles.journalingTitle}>Morning journaling</Text>

      <InputField
        title={'I am grateful for'}
        value={grateful}
        onChangeText={setGrateful}
      />
      <InputField
        title={'What would make today great'}
        value={today}
        onChangeText={setToday}
      />
      <InputField
        title={'Daily affirmations, I am...'}
        value={affirmations}
        onChangeText={setAffirmations}
      />
      <InputField
        title={"Todays' intention"}
        value={intention}
        onChangeText={setIntention}
      />
    </>
  );

  //all the inputs of the night
  const NigthInputs: React.FC = () => {
    return (
      <>
        {/* Title */}
        <Text style={styles.journalingTitle}>Night journaling</Text>
        <Text
          style={[{textAlign: 'center', marginBottom: 15}, styles.ratingText]}>
          Rate today from 1 to 5
        </Text>

        {/* Counter component */}
        <CounterComponent />

        {/* InputFields */}
        <>
          <InputField
            value={thank}
            onChangeText={setThank}
            multiline
            title="I thank myself today for..."
          />
          <InputField
            value={greatThings}
            onChangeText={setGreatThings}
            multiline
            title="3 great things that happened today..."
          />
          <InputField
            value={highlight}
            onChangeText={setHighlight}
            title="5 min. reflection"
            multiline
          />
        </>
      </>
    );
  };

  return (
    <View style={styles.mainView}>
      <Text style={styles.title}>Diary</Text>

      {/* Day journaling */}
      <View style={styles.contentView}>
        {/* Activity Indicator */}
        {loading && <ActivityIndicator size={'large'} color={'black'} />}

        {/* Daily quote */}
        {quote && !error && (
          <>
            <Text style={styles.quote}>{quote}</Text>
            <Text style={[styles.quote, {marginBottom: 30}]}>{author}</Text>
          </>
        )}

        {/* Input components depending on the daytime */}
        {isNight ? <NigthInputs /> : <MorningInputs />}
      </View>

      {/* Submit button */}
      {/* <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: appBackgroundColor,
        }}> */}
      <TouchableOpacity
        onPress={() => handleOnSubmit()}
        style={styles.submitButton}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
      {/* </View> */}

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
                Please fill all the forms, if you don't feel like filling one of
                them, fill it with a dot
              </Text>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  mainView: {
    paddingHorizontal: 10,
    backgroundColor: '#f0efeb',
    flex: 1,
    justifyContent: 'center',
    overflow: 'scroll',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    fontFamily: 'serif',
    color: '#2E2E2E',
  },
  contentView: {
    marginVertical: 15,
    paddingHorizontal: 15,
    // backgroundColor: '#FAF8F5',
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
    marginVertical: 10,
  },
  journalingTitle: {
    textAlign: 'center',
    fontFamily: 'serif',
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 30,
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
    overflow: 'hidden',
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2E2E2E',
  },
});

export default App;
