import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, Appbar } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import { FlatList } from 'react-native-gesture-handler';
import Job from '../job';
import { logout, useMyContextProvider } from '../index';

function Home({ navigation }) {
  const [job, setJob] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [jobs, setJobs] = React.useState([]);
  const [controller, dispatch] = useMyContextProvider();
  const { userLogin } = controller;
  const [isValid, setIsValid] = React.useState(false);
  const ref = firestore().collection('list');

  useEffect(() => {
    if (userLogin == null)
      navigation.navigate("Login")
  }, [userLogin]);

  useEffect(() => {
    return ref.onSnapshot(querySnapshot => {
      const list = [];
      querySnapshot.forEach(doc => {
        const { title } = doc.data();
        list.push({
          id: doc.id,
          title,
        });
      });
      list.sort((a, b)=> a.title.localeCompare(b.title));
      setJobs(list);

      if (loading) {
        setLoading(false);
      }
    });
  }, []);

  const addJob = async () => {
    if (isValid) {
      await ref.add({
        title: job,
      });
      setJob('');
    }
  };

  const handleLogout = () => {
    logout(dispatch);
  };

  const handleJobChange = (text) => {
    setJob(text);
    setIsValid(text.trim().length > 0);
  };

  if (loading) {
    return null;
  }

  return (
    <View style={{ flex: 1 }}>
      
      <Appbar.Header style={{alignSelf:"flex-end"}}>
      
      <Text style={styles.greeting}>Hello, {userLogin ? userLogin.fullName : 'User-Name'}</Text>
      <Appbar.Action textColor='black' buttonColor='red' icon="logout" mode="contained" onPress={handleLogout}/>
      </Appbar.Header>
      <View style={{ flexDirection: "row", alignItems: 'center', paddingHorizontal: 10 }}>
      <TextInput
          style={styles.input}
          label={'Add New Entity'}
          value={job}
          onChangeText={handleJobChange}
        />
       <Button textColor='black' buttonColor='pink' mode='contained' onPress={addJob} disabled={!isValid}>ADD</Button>
      </View>
      <FlatList
        style={{ flex: 1 }}
        data={jobs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Job {...item} />}
      />
     
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    flex: 1,
    marginRight: 10,
    backgroundColor: 'white',
  },
  greeting: {
    textAlign: 'center',
    fontSize: 18,
    marginVertical: 10,
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});

export default Home;
