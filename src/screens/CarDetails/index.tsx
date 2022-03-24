import React from 'react';
import { StatusBar } from 'react-native';

import { Acessory } from '../../components/Acessory';
import { BackButton } from '../../components/BackButton';
import { ImageSlider } from '../../components/ImageSlider';
import { Button } from '../../components/Button';

import { useNavigation, useRoute } from '@react-navigation/native';
import { StyleSheet } from 'react-native'
import { useTheme } from 'styled-components'

import Animated, { 
   useSharedValue,
   useAnimatedScrollHandler,
   useAnimatedStyle,
   interpolate,
   Extrapolate
} from 'react-native-reanimated';

import {
   Container,
   Header,
   CarImages,
   Details,
   Description,
   Brand,
   Name,
   Rent,
   Period,
   Price,
   About,
   Accessories,
   Footer
} from './styles';

import { getAcessoryIcon } from '../../utils/getAcessoryIcon';



import { CarDTO } from '../../dtos/CarDTO';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';

interface Params {
   car: CarDTO;
}

export function CarDetails(){
   const navigation = useNavigation<any>();
   const route = useRoute();
   const { car } = route.params as Params;
   
   const theme = useTheme();

   const scrollY = useSharedValue(0);
   const scrollHandler = useAnimatedScrollHandler(event => {
      scrollY.value = event.contentOffset.y;
      console.log(event.contentOffset.y)
   })

   const headerStyleAnimation = useAnimatedStyle(() => {
      return {
         height:interpolate(
            scrollY.value,
            [0,200],
            [200,50],
            Extrapolate.CLAMP
         )
      }
   })

   const sliderCarsStylesAnimation = useAnimatedStyle(() => {
      return {
         opacity: interpolate(
            scrollY.value,
            [0,150],
            [1,0],
            Extrapolate.CLAMP
            )
      }
   })

   function handleConfirmRental(){
      navigation.navigate('Scheduling', { car })
   }
   function handleGoBack(){
      navigation.goBack();
   }

   return (
      <Container>
         <StatusBar 
            barStyle="dark-content"
            translucent
            backgroundColor="transparent"
         />
   <Animated.View
      style={[
         headerStyleAnimation, 
         styles.header,
         {backgroundColor: theme.colors.background_secondary}
      ]}
   >
         <Header>
            <BackButton onPress={handleGoBack}/>
         </Header>
         <CarImages>
         <Animated.View style={[sliderCarsStylesAnimation]}>
            
            <ImageSlider 
               ImagesUrl={car.photos}
            />
            
         </Animated.View>
         </CarImages>
   </Animated.View>

      <Animated.ScrollView 
         contentContainerStyle={{
            paddingTop:getStatusBarHeight() +160, 
            paddingHorizontal: 24
         }}
         showsVerticalScrollIndicator={false}

         onScroll={scrollHandler}
         scrollEventThrottle={16}
      >
       
            <Details>
               <Description>
                  <Brand>{car.brand}</Brand>
                  <Name>{car.name}</Name>
               </Description>

               <Rent>
                  <Period>{car.rent.period}</Period>
                  <Price>R$ {car.rent.price}</Price>
               </Rent>
            </Details>
            
            <Accessories>
               {
                  car.accessories.map(accessory => (
                     <Acessory 
                        key={accessory.type}
                        name={accessory.name}
                        icon={getAcessoryIcon(accessory.type)}
                     />
                  ))
               }
               
            </Accessories>

            <About>
               {car.about}
            </About>
            
            </Animated.ScrollView>
        

         <Footer>
          <Button title="Escolher período do aluguel" onPress={handleConfirmRental}/>
         </Footer>
      </Container>
);
}

const styles = StyleSheet.create({
   header: {
      position:'absolute',
      overflow:'hidden',
      zIndex: 1,
   },
})