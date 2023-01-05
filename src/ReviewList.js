import React from 'react';
import {
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  Text,
  StatusBar,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const screenWidth = Dimensions.get('screen').width - 10;


// const Item = ({ title }) => (
//   <View style={styles.item}>
//     <Text style={styles.title}>{title.author_name}</Text>
//   </View>
// );

const ReviewList = ({ data }) => {
  const totalReviews = data.length;

  const renderItem = (item) => {
    return (
      <View style={styles.item}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5 }}>
          <Text style={styles.title}>Review {item.index + 1}</Text>
          <Text style={styles.title}>
            <Ionicons name="star" size={25} color="red" />
            {item.item.rating}
          </Text>
        </View>
        <ScrollView>
          <View>
            <Text>{item.item.text}</Text>
            <Text style={{ color: 'red' }}>
              Posted on: {new Date(item.item.time).toUTCString()}, {item.item.relative_time_description}
            </Text>
          </View>
        </ScrollView>
        <Text style={{ textAlign: 'right', fontSize: 20 }}>{item.index + 1}/{totalReviews}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.time}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      // style={styles.flatList}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  item: {
    width: screenWidth - 10,
    maxHeight: 250,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 10,
    backgroundColor: '#fff',
    elevation: 5,
    shadowColor: 'black',
    shadowRadius: 2,
    shadowOpacity: 1,

  },
  title: {
    fontSize: 25,
    color: 'red',
  },
});

export default ReviewList;
