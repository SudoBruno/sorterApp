import { StatusBar } from 'expo-status-bar';
import qs from 'qs';
import { FormEvent, ReactChild, ReactFragment, ReactPortal, useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput, ScrollView, Linking } from 'react-native';
import gameServiceDatabase from './gameServiceDatabase';

export default function App() {

  const [numberOfGames, setNumberOfGames] = useState<number>(0);
  const [generatedNumbers, setGeneratedNumbers] = useState<any>([]);
  const [maxNumber, setMaxNumber] = useState<number>(60);
  const [emailTo, setEmailTo] = useState<string>('');
  const [sortedValues, setSortedValues] = useState<any>(
    {
      value0: '',
      value1: '',
      value2: '',
      value3: '',
      value4: '',
      value5: '',
    }
  );


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
        list[i] = tmp;
      }

      auxArray.push(list);
    }

    saveGamesOnDatabase(auxArray);
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

  function verifyMatchingValues(values: any) {
    let auxArray: any[] = [];
    let matches = 0;
    values.map((value: any[], index: any) => {
      value.map((itemOfArray, index) => {

        if (String(itemOfArray) === String(sortedValues[`value${index}`])) {
          matches++;

        }

      })
      auxArray.push(matches);

      matches = 0;

    })
   console.log(auxArray);
   
    showAllRegisterOnGameTable();
    return auxArray;
  }

  function conference() {

    let arrayOfAccerts = verifyMatchingValues(generatedNumbers)

    let gameMessage = '';
    let quadra = 0;
    let quina = 0;
    let sena = 0;

    arrayOfAccerts.forEach((element, index) => {
      gameMessage += `Jogo [${index + 1}] houveram [${element}] acerto(s) \n`
      if (Number(element) === 4) {
        quadra++;
      }
      if (Number(element) === 5) {
        quina++;
      }
      if (Number(element) === 6) {
        sena++;
      }


    });
    showAllRegisterOnGameTable();
    alert(gameMessage + '\n' +
      "Jogo(s) ganho(s) com a sena : " + sena + "\n" +
      "Jogo(s) ganho(s) com a quina : " + quina + "\n" +
      "Jogo(s) ganho(s) com a quadra : " + quadra + "\n"
    )
  }
  async function saveGamesOnDatabase(data: any) {
    gameServiceDatabase.dropTable();
    gameServiceDatabase.createTable();

    for (let game of data) {

      return gameServiceDatabase.create({ sortedNumbers: game })
      .then(id => console.log('Jogo created with id: ' + id))
      .catch(err => console.log(err))
       
    }


  }

  //Consta erro mas funciona
  function showAllRegisterOnGameTable() {
    {
      gameServiceDatabase.all()
        .then(
          game => game.forEach((register: any) => console.log(`id:${register.id}, values:${register.sortedNumbers}`))
        )
    }
  }

  return (
    <ScrollView key="scroolView">
      <View style={styles.container} key="17">
        <Text key="11">Insira a quantidad de Jogos</Text>
        <TextInput
          key="12"
          keyboardType="decimal-pad"
          style={styles.input}
          onChangeText={(e) => { setNumberOfGames(Number(e)) }}
          value={String(numberOfGames)}
        />
        <Button key="13" title="Gerar Número" onPress={(e) => { handleClickSorterButton(Number(numberOfGames)) }} />

        <TextInput
        key="14"
          style={styles.inputEmail}
          onChangeText={(e) => { setEmailTo(e) }}
          value={String(emailTo)}
        />
        <Button title="Enviar Email" key="15" onPress={(e) => {
          const body = functionTransformObject()
          sendEmail(emailTo, 'Números Mega Sena', body)
        }} />
        <StatusBar key="16" style="auto" />
      </View>
      <View key="sortedView">
        {generatedNumbers.map((item: any, index: number) => (
          <View style={styles.viewSorted} key={index}>
            {
              item.map((value: any, secondIndex: number) => {
                return secondIndex < 6 && (
                  <>
                    <View key={secondIndex} >
                      <Text key={secondIndex + index}
                        style={
                          {
                            backgroundColor: (index % 2) === 0 ? '#128C80' : '#16BAA9',
                            margin: 5,
                            minWidth: 50,
                            maxWidth: 50,
                            minHeight: 50,
                            maxHeight: 50,
                            textAlign: 'center',
                            borderRadius: 5,
                            padding: 13,
                          }
                        }
                      >
                        {`${value}`}
                      </Text>

                    </View>
                  </>
                )
              }
              )}
          </View>
        ))}
      </View>
      <View style={styles.sortedNumbers} key="1">
        <Text
          style={
            {
              textAlign: 'center',
              margin: 10,
              fontSize: 25
            }
          }
        >
          Digite as Dezenas Sorteadas:
        </Text>

        <View style={styles.inputsContainer} key="3">
          <TextInput
            style={styles.sortedInput}
            keyboardType="number-pad"
            onChangeText={(e) => {
              setSortedValues({ ...sortedValues, value0: e })
            }}
            key="4"
            value={String(sortedValues.value0)}
          />
          <TextInput
            style={styles.sortedInput}
            keyboardType="number-pad"
            onChangeText={(e) => {
              setSortedValues({ ...sortedValues, value1: e })
            }}
            key="5"
            value={String(sortedValues.value1)}
          />
          <TextInput
            style={styles.sortedInput}
            keyboardType="number-pad"
            onChangeText={(e) => {
              setSortedValues({ ...sortedValues, value2: e })
            }}
            key="6"
            value={String(sortedValues.value2)}
          />
          <TextInput
            style={styles.sortedInput}
            keyboardType="number-pad"
            onChangeText={(e) => {
              setSortedValues({ ...sortedValues, value3: e })
            }}
            key="7"
            value={String(sortedValues.value3)}
          />
          <TextInput
            style={styles.sortedInput}
            keyboardType="number-pad"
            onChangeText={(e) => {
              setSortedValues({ ...sortedValues, value4: e })
            }}
            key="8"
            value={String(sortedValues.value4)}
          />
          <TextInput
            style={styles.sortedInput}
            keyboardType="number-pad"
            onChangeText={(e) => {
              setSortedValues({ ...sortedValues, value5: e })
            }}
            key="9"
            value={String(sortedValues.value5)}
          />
        </View>
        <Button title="Verificar Numeros" key="10" onPress={(e) => {
          conference()
        }} />
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
  sortedNumbers: {
    display: 'flex',
    flexDirection: 'column',
  },
  inputsContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  sortedInput: {
    height: 60,
    width: 60,
    margin: 4,
    borderWidth: 4,
    padding: 10,
    borderRadius: 50,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
  },
});
