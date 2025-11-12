import React, { useState } from "react";
import { View, Text, TextInput, Button, FlatList, Image, StyleSheet } from "react-native";
import axios from "axios"; // library for making http requests because deezer is a web service hosted online https://medium.com/@sumitlaxane06/why-you-should-use-an-axios-instance-for-api-calls-cdd3333d98ac

export default function App() {
  const [search, setSearch] = useState(""); //initially search is empty
  const [tracks, setTracks] = useState([]); //array is initalized as empty for the lists of songs returned by searching for an artist/song

  const searchTracks = async () => { //async function triggered when user presses search
    if (!search) return; //if search is empty, does nothing

    try {
      const response = await axios.get(`https://api.deezer.com/search`, { //users response makes a get request to deezer api
        params: { q: search }, //q is the user input search compared to the data inside deezer web service
      });
      setTracks(response.data.data); // Deezer returns results in data.data
    } catch (e) {
      console.error("Error fetching Deezer data:", e); //if error is encountered during api request
    }
  };

  return (//ui
    <View style={styles.container}> 
      <Text style={styles.title}>Song Search</Text> {/*title on top of the page*/}

      <TextInput
        style={styles.input}
        placeholder="Search for a song/artist..."
        value={search} //links users search state to the search state
        onChangeText={setSearch} //https://reactnative.dev/docs/textinput updates state when the user types
      />

      <Button title="Search" onPress={searchTracks} />

      <FlatList //renders list of the music
        data={tracks} //tracks tells the system what to display
        keyExtractor={(item) => item.id.toString()} //assigns unique key to each song https://reactnative.dev/docs/flatlist
        renderItem={({ item }) => ( // https://reactnative.dev/docs/flatlist defines how each song should be displayed in the track list
          <View style={styles.track}>
            <Image source={{ uri: item.album.cover_medium }} style={styles.image} /> {/*shows the album coverusing the image from the url from the api*/}
            <View style={styles.trackInfo}> {/*uses the styling of flexbox 1 for this section*/}
              <Text style={styles.trackTitle}>{item.title}</Text> {/*shows the title of the song*/}
              <Text style={styles.artist}>{item.artist.name}</Text>{/*shows the artist name of the song*/}
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    marginTop: 50, 
    backgroundColor: "#fff" 
  },
  title: { //text size and header weight
    fontSize: 22, 
    fontWeight: "bold", 
    marginBottom: 10 
  },
  input: {//styling for the text input box
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  track: { //styling for the track layout 
    flexDirection: "row", 
    alignItems: "center", 
    marginVertical: 8 
  },
  image: { //styling for the size and shape of albumb images
    width: 60, 
    height: 60, 
    borderRadius: 8, 
    marginRight: 10 
  },
  trackTitle: { //name of the song styling
    fontSize: 12,
    fontWeight: "600"
   },
  artist: { //name of the artist styling
    color: "#666" 
  },
  trackInfo:{
    flex:1,
  }
});
