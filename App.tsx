import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
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
  const [intention, setIntention] = useState<string>();
  const [grateful, setGrateful] = useState<string>();
  const [today, setToday] = useState<string>();
  const [affirmations, setAffirmations] = useState<string>();

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

  return (
    <View style={{marginHorizontal: 10}}>
      <Text style={styles.title}>Diario</Text>
      <Text style={{textAlign: 'center', fontSize: 30}}>1 2 3 4 5 6 7 8 9</Text>

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
            {quote} - {author}
          </Text>
        )}

        {/* Daily Inputs */}
        <>
          <Text>Todays' intention</Text>
          <TextInput
            placeholder="Todays' intention"
            style={styles.inputText}
            multiline
            value={intention}
            onChangeText={setIntention}
          />
          <Text>I am grateful for</Text>
          <TextInput
            placeholder="I am grateful for ..."
            style={styles.inputText}
            multiline
            value={grateful}
            onChangeText={setGrateful}
          />
          <Text>What would make today great</Text>
          <TextInput
            placeholder="I want to do ..."
            style={styles.inputText}
            multiline
            value={today}
            onChangeText={setGrateful}
          />
          <Text>Daily affirmations, I am...</Text>
          <TextInput
            placeholder="I am ..."
            style={styles.inputText}
            multiline
            value={affirmations}
            onChangeText={setAffirmations}
          />
        </>
      </View>
      {/* Night journaling */}
      {/* Submit button */}
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <TouchableOpacity
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
});

export default App;
