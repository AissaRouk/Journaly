import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Modal,
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
  const [intention, setIntention] = useState<string>('');
  const [grateful, setGrateful] = useState<string>('');
  const [today, setToday] = useState<string>('');
  const [affirmations, setAffirmations] = useState<string>('');
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

  const InputField: React.FC<{
    label: string;
    value: string;
    onChangeText: (text: string) => void;
  }> = ({label, value, onChangeText}) => {
    return (
      <>
        <Text>{label}</Text>
        <TextInput
          style={styles.inputText}
          placeholder={'...'}
          value={value}
          onChangeText={onChangeText}
        />
      </>
    );
  };

  return (
    <View style={{marginHorizontal: 10}}>
      <Text style={styles.title}>Diary</Text>

      {/* Day journaling */}
      <View style={styles.contentView}>
        {/* switch */}
        <View style={styles.switchStyle}>
          <Text>Sun icon</Text>
          <Text>Moon icon</Text>
        </View>

        {/* Activity Indicator */}
        {loading && (
          <ActivityIndicator
            size={'large'}
            color={'black'}
            style={styles.quote}
          />
        )}

        {/* Daily quote */}
        {quote && !error && (
          <Text style={styles.quote}>
            {quote} {'\n'} {author}
          </Text>
        )}

        {/* Daily Inputs */}
        <>
          <InputField
            label={"Todays' intention"}
            value={intention}
            onChangeText={setIntention}
          />
          <InputField
            label={'I am grateful for'}
            value={grateful}
            onChangeText={setGrateful}
          />
          <InputField
            label={'What would make today great'}
            value={today}
            onChangeText={setToday}
          />
          <InputField
            label={'Daily affirmations, I am...'}
            value={affirmations}
            onChangeText={setAffirmations}
          />
        </>
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
    fontSize: 30,
    fontWeight: 'bold',
    marginVertical: 15,
    textAlign: 'center',
  },
  contentView: {
    marginVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchStyle: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  inputText: {
    width: '100%',
    borderBottomWidth: 1,
    textAlign: 'center',
    marginBottom: 40,
  },
  quote: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginHorizontal: 20,
  },
  modalText: {
    textAlign: 'center',
    fontSize: 16,
  },
});

export default App;
