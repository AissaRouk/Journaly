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

  const handleOnSubmit = () => {
    //if all forms filled, show success modal
    if (intention && grateful && today && affirmations) {
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

  const InputField: React.FC<{
    title: string;
    value: string;
    onChangeText: (text: string) => void;
  }> = ({title, value, onChangeText}) => {
    return (
      <>
        <Text>{title}</Text>
        <TextInput
          style={styles.inputText}
          placeholder={'...'}
          value={value}
          onChangeText={onChangeText}
        />
      </>
    );
  };

  //all the inputs of the day
  const MorningInputs: React.FC = () => (
    <>
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
        <Text
          style={[{textAlign: 'center', marginBottom: 15}, styles.ratingText]}>
          Rate today from 1 to 5
        </Text>
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
        <InputField
          value={thank}
          onChangeText={setThank}
          title="I thank myself today for..."
        />
        <InputField
          value={greatThings}
          onChangeText={setGreatThings}
          title="3 great things that happened today..."
        />
        <InputField
          value={highlight}
          onChangeText={setHighlight}
          title="5 min. reflection"
        />
      </>
    );
  };

  return (
    <View style={{marginHorizontal: 10, backgroundColor: '#FAF8F5'}}>
      <Text style={styles.title}>Diary</Text>

      {/* Day journaling */}
      <View style={styles.contentView}>
        {/* switch */}
        <View style={styles.switchStyle}>
          <Text>Sun icon</Text>
          <Text>Moon icon</Text>
        </View>

        {/* Activity Indicator */}
        {loading && <ActivityIndicator size={'large'} color={'black'} />}

        {/* Daily quote */}
        {quote && !error && (
          <>
            <Text style={styles.quote}>{quote}</Text>
            <Text style={[styles.quote, {marginBottom: 30}]}>{author}</Text>
          </>
        )}

        {/* Daily Inputs */}
        {/* <MorningInputs /> */}
        {/* Night Inputs */}
        <NigthInputs />
      </View>

      {/* Submit button */}
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <TouchableOpacity
          onPress={() => handleOnSubmit()}
          style={{
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderWidth: 0.5,
            borderColor: 'black',
            borderRadius: 5,
          }}>
          <Text>Submit</Text>
        </TouchableOpacity>
      </View>

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
    backgroundColor: '#FAF8F5',

    paddingVertical: 20,
  },
  switchStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
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
    backgroundColor: '#E3D5C9',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#C2B8A3',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.1,
    shadowRadius: 5,
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
