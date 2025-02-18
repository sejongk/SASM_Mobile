import React, { useState } from "react";
import { TouchableOpacity, View, ImageBackground, StyleSheet, Dimensions } from "react-native";
import { TextPretendard as Text } from '../../../../common/CustomText';
import Heart from "../../../../common/Heart";
import { Request } from "../../../../common/requests";
import { CATEGORY_LIST, MatchCategory } from "../../../../common/Category";
import Selector0 from "../../../../assets/img/Category/Selector0.svg";
import Selector1 from "../../../../assets/img/Category/Selector1.svg";
import Selector2 from "../../../../assets/img/Category/Selector2.svg";
import Selector3 from "../../../../assets/img/Category/Selector3.svg";
import Selector4 from "../../../../assets/img/Category/Selector4.svg";
import Selector5 from "../../../../assets/img/Category/Selector5.svg";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { TabProps } from "../../../../../App";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

export interface MyPlaceItemCardProps {
  id: number;
  place_name: string;
  category: string;
  rep_pic: string;
  address: string;
}


const MyPlaceItemCard = ({ data, edit, rerender }: { data: MyPlaceItemCardProps, edit: boolean, rerender: () => void }) => {
  const navigationToTab = useNavigation<StackNavigationProp<TabProps>>();
  const [like, setLike] = useState(true);
  const request = new Request();
  // 좋아요 클릭 이벤트
  const handleLike = async () => {
    const response = await request.post("/places/place_like/",
      { id: data.id },
    );
    setLike(!like);
    rerender();
  };

  const category = () => {
    let idx = MatchCategory(data.category);
    let list = [
      <Selector0 color={CATEGORY_LIST[0].color} width={15} height={15} />,
      <Selector1 color={CATEGORY_LIST[1].color} width={15} height={15} />,
      <Selector2 color={CATEGORY_LIST[2].color} width={15} height={15} />,
      <Selector3 color={CATEGORY_LIST[3].color} width={15} height={15} />,
      <Selector4 color={CATEGORY_LIST[4].color} width={15} height={15} />,
      <Selector5 color={CATEGORY_LIST[5].color} width={15} height={15} />
    ]
    return list[idx];
  }

  const handlePageGoToMap = async () => {
    let coor = { latitude: 0, longitude: 0 };
    const places = await request.get('/places/map_info/', {}, {});
    for (const place of places.data.data) {
      if (place.id === data.id) {
        coor = { latitude: place.latitude, longitude: place.longitude }
      }
    }
    navigationToTab.navigate('맵', { coor: { latitude: coor.latitude, longitude: coor.longitude } })
  }

  return (
    <View style={{ position: 'relative' }}>
      <TouchableWithoutFeedback style={{ marginHorizontal: 6, marginBottom: 20 }} onPress={handlePageGoToMap}>
        <ImageBackground
          source={{ uri: data.rep_pic }}
          style={{ width: 110, height: 150 }}
        >
          <View style={{ width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.3)', padding: 5, justifyContent: 'flex-end' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {category()}
              <Text style={textStyles.address}>{data.address.split(' ')[1]}, {data.address.split(' ')[0]}</Text>
            </View>
            <Text numberOfLines={1} style={textStyles.place_name}>{data.place_name}</Text>
          </View>
        </ImageBackground>
      </TouchableWithoutFeedback>
      {
        edit &&
        <View style={{ position: 'absolute', top: 10, right: 10 }}>
          <Heart like={like} onPress={handleLike} size={20}/>
        </View>
      }
    </View>
  );
}

const textStyles = StyleSheet.create({
  place_name: {
    fontSize: 12,
    color: "#F4F4F4",
    fontWeight: "700",
    lineHeight: 18,
    letterSpacing: -0.6
  },
  address: {
    fontSize: 10,
    lineHeight: 18,
    color: "#F4F4F4",
    marginLeft: 5,
  }
})

export default MyPlaceItemCard;