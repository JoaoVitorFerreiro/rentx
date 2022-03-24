import React, { useRef, useState } from 'react';
import { FlatList, ViewToken } from 'react-native';

import {
   Container,
   ImageIndexes,
   ImageIndex,
   CarImageWrapper,
   CarImage,
} from './styles';

interface Props {
    ImagesUrl: string[];
}

interface ChangeImageProps {
  viewableItems: ViewToken[];
  changed: ViewToken[];
}

export function ImageSlider({ ImagesUrl } : Props){
  const [imageIndex, setImageIndex] = useState(0);

  const indexChanced = useRef((info:ChangeImageProps) => {
    const index = info.viewableItems[0].index!;
    setImageIndex(index);
  });

   return (
    <Container>
      <ImageIndexes>  
        {
          ImagesUrl.map((item, index) => (
            <ImageIndex 
              key={String(index)}
              active={index === imageIndex} 
            />        
          ))
        }
      </ImageIndexes>

    
        <FlatList
          data={ImagesUrl}
          keyExtractor={key => key}
          renderItem={({item}) =>(
            <CarImageWrapper>
            <CarImage
              source={{ uri: item}}
              resizeMode='contain'
            />
            </CarImageWrapper>
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={indexChanced.current}
        >      
        </FlatList>
      
    </Container>
);
}