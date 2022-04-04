import { StatusBar } from 'expo-status-bar';
import qs from 'qs';
import { FormEvent, ReactChild, ReactFragment, ReactPortal, useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput, ScrollView, Linking } from 'react-native';

export default function App() {

  const [numberOfGames, setNumberOfGames] = useState<number>(0);
  const [generatedNumbers, setGeneratedNumbers] = useState<any>([]);
  const [maxNumber, setMaxNumber] = useState<number>(60);
  const [emailTo, setEmailTo] = useState<string>('');


  function handleClickSorterButton(numberOfGames: number) {
    let auxArray = []
    let list = [];
    for (let numberOfTimesToRun = 0; numberOfTimesToRun < numberOfGames; numberOfTimesToRun++) {
      list = [];
      let randomNumber;
      let tmp;

      for (let i = 0; i < maxNumber; i++) {
        list[i] = i + 1;
      }

      for (let i = list.length; i;) {
        randomNumber = Math.random() * i-- | 0;
        tmp = list[randomNumber];
        // troca o número aleatório pelo atual
        list[randomNumber] = list[i];
        // troca o atual pelo aleatório
        list[i] = Number(tmp);
      }
      console.log(list);

      auxArray.push(list);
    }

    setGeneratedNumbers(auxArray);
  }

  async function sendEmail(to: any, subject: any, body: any) {

    let url = `mailto:${to}`;

    // Create email link query
    const query = qs.stringify({
      subject: subject,
      body: body,
    });

    if (query.length) {
      url += `?${query}`;
    }

    // check if we can use this link
    const canOpen = await Linking.canOpenURL(url);

    if (!canOpen) {
      throw new Error('Provided URL can not be handled');
    }

    return Linking.openURL(url);
  }

  function functionTransformObject() {
    let mountedBody = ``;

    const converted = generatedNumbers.map((item: any[], index1: any) => {
      mountedBody = mountedBody.concat(`\n`)
      item.map((numberArray: string, index2: number) => {
        if (index2 < 6) {
          return mountedBody = mountedBody.concat('|' + numberArray + '|');
        }

      })

    })

    return mountedBody;

  }


  return (
    <ScrollView>
      <View style={styles.container}>
        <Text>Insira a quantidad de Jogos</Text>
        <TextInput
          keyboardType="decimal-pad"
          style={styles.input}
          onChangeText={(e) => { setNumberOfGames(Number(e)) }}
          value={String(numberOfGames)}
        />
        <Button title="Gerar Número" onPress={(e) => { handleClickSorterButton(Number(numberOfGames)) }} />

        <TextInput
          style={styles.inputEmail}
          onChangeText={(e) => { setEmailTo(e) }}
          value={String(emailTo)}
        />
        <Button title="Enviar Email" onPress={(e) => {
          const body = functionTransformObject()
          sendEmail(emailTo, 'Números Mega Sena', body)
        }} />
        <StatusBar style="auto" />
      </View>
      <View key="sortedView">
        {generatedNumbers.map((item: any, index: number) => (
          <View style={styles.viewSorted} key={index}>
            {
              item.map((value: any, secondIndex: number) => {
                return secondIndex < 6 && (
                  <>
                    <View key={secondIndex}>
                      <Text key={secondIndex + index}>{` |${value}| `}</Text>
                    </View>
                  </>
                )
              }
              )}
          </View>
        ))}
      </View>
    </ScrollView >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 200,

  },
  viewSorted: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',

  },
  input: {
    height: 40,
    width: 70,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  inputEmail: {
    height: 40,
    width: 400,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
