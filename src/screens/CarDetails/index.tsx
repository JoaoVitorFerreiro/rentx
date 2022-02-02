import React from 'react';
import { Acessory } from '../../components/Acessory';
import { BackButton } from '../../components/BackButton';
import { ImageSlider } from '../../components/ImageSlider';

import { useNavigation, useRoute } from '@react-navigation/native';


import {
   Container,
   Header,
   CarImages,
   Content,
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


import { Button } from '../../components/Button';
import { CarDTO } from '../../dtos/CarDTO';

interface Params {
   car: CarDTO;
}

export function CarDetails(){
   const navigation = useNavigation<any>();
   const route = useRoute();
   const { car } = route.params as Params;

   function handleConfirmRental(){
      navigation.navigate('Scheduling', { car })
   }
   function handleGoBack(){
      navigation.goBack();
   }

   return (
      <Container>
         <Header>
            <BackButton onPress={handleGoBack}/>
         </Header>

         <CarImages>
            <ImageSlider 
               ImagesUrl={car.photos}
            />
         </CarImages>

         <Content>
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

            <About>{car.about}</About>
            
            
         </Content>

         <Footer>
          <Button title="Escolher período do aluguel" onPress={handleConfirmRental}/>
         </Footer>
      </Container>
);
}