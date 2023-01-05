import { useState, useRef } from 'react';
import { Text, View, StyleSheet, StatusBar, ActivityIndicator } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Constants from 'expo-constants';

const LAT = 21.1458;
const LON = 79.0882;
const apiKey = Constants.expoConfig.extra.placeApiKey;

import ReviewList from './src/ReviewList';

const App = () => {

  const [markerCoordinates, setMarkerCoordinates] = useState(null);
  const [reviewData, setReviewData] = useState(null);
  const [loading, setLoading] = useState(false);
  const mapRef = useRef(null);

  const fetchPlaceId = (location) => {


    let myPromise = new Promise((resolve, reject) => {
      var requestOptions = {
        method: 'GET',
        redirect: 'follow',
      };

      fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=10000&key=${apiKey}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((resp) => {
          if (resp.status)
            resolve(resp.results[0]);
          // let place = resp.results[0];
          // let placeId = place.place_id;
          // let placeName = place.name;
          // setMarkerCoordinates({"latitude": place.geometry.location.lat, "longitude": place.geometry.location.lng});
        })
        .catch((error) => reject(error));
    })

    return myPromise;

  };

  const fetchReview = (placeId) => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };

    fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((resp) => {
        setMarkerCoordinates({ "latitude": resp.result.geometry.location.lat, "longitude": resp.result.geometry.location.lng });
        setLoading(false);

        if (resp.result.reviews == null) {
          setReviewData(null);
          setMarkerCoordinates(null)
          alert('No reviews available');
        } else {
          setReviewData(resp.result.reviews);
        }

      })
      .catch((error) => {
        setLoading(false);
        alert("Error", `${error}`)
      });
  };

  const addMarker = (e) => {
    setLoading(true);
    setReviewData(null);
    let coordinate = e.nativeEvent.coordinate;
    let location = `${coordinate.latitude},${coordinate.longitude}`;
    setMarkerCoordinates(coordinate);

    fetchPlaceId(location)
      .then((placeDetails) => {
        // setMarkerCoordinates({ "latitude": placeDetails.geometry.location.lat, "longitude": placeDetails.geometry.location.lng });
        fetchReview(placeDetails.place_id);
      })
      .catch(err => {
        setLoading(false);
        alert('Error', err)
      })
  }
  if (mapRef && markerCoordinates) {
    mapRef.current.fitToCoordinates([{ latitude: markerCoordinates.latitude, longitude: markerCoordinates.longitude }],{ edgePadding: { top: 10, right: 100, bottom: 10, left: 100 } });
  }
  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: LAT,
          longitude: LON,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0922,
        }}
        provider={PROVIDER_GOOGLE}
        onPress={addMarker}
        onPoiClick={(e) => fetchReview(e.nativeEvent.placeId)}
      >
        {
          markerCoordinates && (<Marker coordinate={markerCoordinates} />)
        }

      </MapView>

      <View style={styles.titleView}>
        <Text style={styles.title}>Webuplab</Text>
      </View>
      <View style={styles.reviewList}>
        {
          reviewData && (<ReviewList data={reviewData} />)
        }
      </View>
      {loading && <ActivityIndicator animating={loading} style={{
        position: 'absolute', top: 0, bottom: 0, right: 0, left: 0, backgroundColor: '#40404087'
      }} size={'large'} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  titleView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'red',
  },
  title: {
    paddingVertical: 5,
    paddingLeft: 5,
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'left',
    color: '#fff'
  },
  map: {
    width: '100%',
    height: '100%',
  },
  reviewList: {
    position: 'absolute',
    bottom: 10,
  }
});

export default App;
